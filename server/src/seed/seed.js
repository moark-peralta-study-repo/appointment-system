/**
 * Demo seed — transfers the sample data shown in the admin UI into MongoDB.
 *
 * Usage (from server/):
 *   npm run seed          # idempotent — safe to re-run
 *   npm run seed --fresh  # drops the collections first
 *
 * Credentials that get created:
 *   Staff portal (vet owner): admin@mutualspaws.com / admin123  (Dr. Evelyn Dane)
 *   Other vets:               vet12345
 *   Pet owners:               patient123
 *
 * The seed creates the vet profiles + pets + appointments directly with
 * Mongoose models so "no double-booking" (rule #2) and schedule-slot rules
 * are never in doubt: every appointment falls inside the vets' seeded
 * schedule (Mon–Fri 09:00–17:00, 30-min slots).
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";
import Pet from "../models/Pet.js";
import Vet from "../models/Vet.js";
import Appointment from "../models/Appointment.js";

const FRESH = process.argv.includes("--fresh");

const WEEKDAYS = [1, 2, 3, 4, 5]; // Mon–Fri (JS getDay() numbers)
const SCHEDULE = WEEKDAYS.map((day) => ({
	day,
	start: "09:00",
	end: "17:00",
	slotMinutes: 30,
}));

/** YYYY-MM-DD in the server's local timezone. */
function localDateStr(d) {
	const x = new Date(d);
	const p = (n) => String(n).padStart(2, "0");
	return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`;
}

function daysAgo(n, time, status) {
	const d = new Date();
	d.setDate(d.getDate() - n);
	d.setHours(0, 0, 0, 0);
	return { date: d, time, status };
}

// --- Sample data (from the admin UI) ------------------------------------

const VETS = [
	{ name: "Dr. Evelyn Dane", email: "admin@mutualspaws.com", password: "admin123", phone: "+63 917 245 0001", specialty: "General Practice", bio: "Clinic owner and lead veterinarian." },
	{ name: "Dr. Alex Mercer", email: "alex.mercer@mutualspaws.com", password: "vet12345", phone: "+63 918 562 0002", specialty: "Surgery & Diagnostics" },
	{ name: "Dr. Elena Rostova", email: "elena.rostova@mutualspaws.com", password: "vet12345", phone: "+63 905 731 0003", specialty: "Internal Medicine" },
	{ name: "Dr. Marcus Bennett", email: "marcus.bennett@mutualspaws.com", password: "vet12345", phone: "+63 917 843 0004", specialty: "Dermatology" },
	{ name: "Dr. Claire Morgan", email: "claire.morgan@mutualspaws.com", password: "vet12345", phone: "+63 919 325 0005", specialty: "Emergency Care" },
	{ name: "Dr. Noah Williams", email: "noah.williams@mutualspaws.com", password: "vet12345", phone: "+63 906 482 0006", specialty: "Preventive Care" },
];

const OWNERS = [
	{ name: "Maria Lopez", email: "maria.lopez@email.com", phone: "+63 917 245 1832" },
	{ name: "James Reyes", email: "james.reyes@email.com", phone: "+63 918 562 9041" },
	{ name: "Sofia Cruz", email: "sofia.cruz@email.com", phone: "+63 905 731 4268" },
	{ name: "Anna Garcia", email: "anna.garcia@email.com", phone: "+63 917 843 2157" },
	{ name: "Daniel Santos", email: "daniel.santos@email.com", phone: "+63 919 325 6714" },
	{ name: "Rachel Tan", email: "rachel.tan@email.com", phone: "+63 906 482 1935" },
];

const PETS = [
	{ owner: "Maria Lopez", name: "Mochi", species: "dog", breed: "Golden Retriever", age: 3, gender: "male" },
	{ owner: "Maria Lopez", name: "Loki", species: "dog", breed: "Corgi", age: 1, gender: "male" },
	{ owner: "James Reyes", name: "Luna", species: "cat", breed: "Persian", age: 2, gender: "female" },
	{ owner: "Sofia Cruz", name: "Bruno", species: "dog", breed: "Labrador Retriever", age: 5, gender: "male", notes: "Under observation — mild hip mobility concern. Recheck in 2 weeks." },
	{ owner: "Sofia Cruz", name: "Pepper", species: "cat", breed: "Maine Coon", age: 2, gender: "female" },
	{ owner: "Sofia Cruz", name: "Rocky", species: "dog", breed: "German Shepherd", age: 4, gender: "male" },
	{ owner: "Anna Garcia", name: "Cookie", species: "dog", breed: "Shih Tzu", age: 4, gender: "female" },
	{ owner: "Daniel Santos", name: "Milo", species: "dog", breed: "Beagle", age: 6, gender: "male" },
	{ owner: "Daniel Santos", name: "Biscuit", species: "cat", breed: "Tabby", age: 3, gender: "male" },
	{ owner: "Rachel Tan", name: "Nala", species: "cat", breed: "Siamese", age: 1, gender: "female" },
];

async function seed() {
	await mongoose.connect(process.env.MONGO_URI);
	console.log(`MongoDB connected: ${mongoose.connection.host}`);

	if (FRESH) {
		await Promise.all([
			User.deleteMany({}),
			Pet.deleteMany({}),
			Vet.deleteMany({}),
			Appointment.deleteMany({}),
		]);
		console.log("Dropped all demo collections.");
	}

	// --- Users -----------------------------------------------------------
	// Note: passwords are hashed in a pre-save hook, which $setOnInsert
	// bypasses — so we create users the normal way (idempotent via
	// find-or-create).
	const users = {}; // name -> User

	async function upsertUser(doc) {
		let u = await User.findOne({ email: doc.email });
		if (!u) {
			u = await User.create({
				name: doc.name,
				email: doc.email,
				password: doc.password,
				role: doc.role,
				phone: doc.phone,
			});
		}
		return u;
	}

	for (const o of OWNERS) {
		users[o.name] = await upsertUser({ ...o, password: "patient123", role: "user" });
	}
	for (const v of VETS) {
		users[v.name] = await upsertUser({ name: v.name, email: v.email, password: v.password, role: "vet", phone: v.phone });
	}

	// --- Vet profiles ----------------------------------------------------
	const vetProfiles = {};
	for (const v of VETS) {
		vetProfiles[v.name] = await Vet.findOneAndUpdate(
			{ user: users[v.name]._id },
			{ $setOnInsert: { specialty: v.specialty, bio: v.bio ?? null, schedule: SCHEDULE, active: true } },
			{ upsert: true, returnDocument: 'after' },
		);
	}

	// --- Pets ------------------------------------------------------------
	const pets = {};
	for (const p of PETS) {
		pets[p.name] = await Pet.findOneAndUpdate(
			{ name: p.name, owner: users[p.owner]._id },
			{ $setOnInsert: { species: p.species, breed: p.breed, age: p.age, gender: p.gender } },
			{ upsert: true, returnDocument: 'after' },
		);
	}

	// --- Appointments ------------------------------------------------------
	// Today: the three entries from the dashboard mock (times on schedule slots).
	const today = new Date();
	today.setHours(0, 0, 0, 0); // store as local midnight, same as parseDateParam
	const todays = [
		{ date: today, time: "09:00", pet: "Mochi", owner: "Maria Lopez", vet: "Dr. Evelyn Dane", reason: "General Check-up", status: "confirmed" },
		{ date: today, time: "09:30", pet: "Luna", owner: "James Reyes", vet: "Dr. Alex Mercer", reason: "Vaccination", status: "pending" },
		{ date: today, time: "10:00", pet: "Bruno", owner: "Sofia Cruz", vet: "Dr. Elena Rostova", reason: "Consultation", status: "confirmed" },
	];
	// History: completed visits → the Medical Records page + reports data.
	const history = [
		{ ...daysAgo(7, "10:00", "completed"), pet: "Mochi", owner: "Maria Lopez", vet: "Dr. Evelyn Dane", reason: "General Check-up", vetNotes: "Healthy. Weight stable. Boosters current." },
		{ ...daysAgo(5, "14:30", "completed"), pet: "Luna", owner: "James Reyes", vet: "Dr. Alex Mercer", reason: "Vaccination", vetNotes: "Annual rabies + FVRCP administered. Mild soreness possible for a day." },
		{ ...daysAgo(14, "13:00", "completed"), pet: "Cookie", owner: "Anna Garcia", vet: "Dr. Evelyn Dane", reason: "Dental Cleaning", vetNotes: "Full dental clean, one extraction. On antibiotics 5 days." },
	];

	for (const a of [...todays, ...history]) {
		const exists = await Appointment.findOne({ pet: pets[a.pet]._id, date: a.date, time: a.time });
		if (exists) continue;
		await Appointment.create({
			owner: users[a.owner]._id,
			pet: pets[a.pet]._id,
			vet: users[a.vet]._id,
			date: a.date,
			time: a.time,
			reason: a.reason,
			status: a.status,
			vetNotes: a.vetNotes,
		});
		console.log(`Appointment: ${a.pet} @ ${localDateStr(a.date)} ${a.time} (${a.status})`);
	}

	console.log(`Seeded ${Object.keys(users).length} users, ${Object.keys(vetProfiles).length} vet profiles, ${Object.keys(pets).length} pets.`);
	await mongoose.disconnect();
	console.log("Seed complete.");
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
