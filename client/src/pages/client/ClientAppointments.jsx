import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiCat, PiDog } from "react-icons/pi";
import { FiPlus } from "react-icons/fi";
import ClientHeader from "../../components/client/ClientHeader";
import AdminModal from "../../components/admin/AdminModal";
import DogLoader from "../../components/admin/DogLoader";
import {
	useMyAppointments,
	useCancelMyAppointment,
} from "../../hooks/useClientData";
import { isToday, isWithinDays, format12h, formatDate } from "../../utils/admin";

const SPECIES_ICON = (s) => (s === "cat" ? <PiCat size={20} /> : <PiDog size={20} />);

/* ---------------- CANCEL CONFIRM ---------------- */
function CancelModal({ appointment, onClose }) {
	const cancel = useCancelMyAppointment();

	const confirm = () => {
		cancel.mutate(appointment._id, {
			onSuccess: onClose,
			onError: () => {},
		});
	};

	const pet = appointment.pet;
	return (
		<AdminModal
			eyebrow="CANCEL VISIT"
			title="Cancel this appointment?"
			onClose={onClose}
			footer={
				<>
					<button className="admin-secondary-button" type="button" onClick={onClose}>
						Keep appointment
					</button>
					<button
						className="admin-secondary-button"
						style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
						type="button"
						disabled={cancel.isPending}
						onClick={confirm}
					>
						{cancel.isPending ? "Cancelling…" : "Yes, cancel it"}
					</button>
				</>
			}
		>
			<p className="admin-slot-note">
				{pet?.name ?? "Your pet"} — {formatDate(appointment.date)} at{" "}
				{format12h(appointment.time)}
			</p>
			<p className="admin-form-desc">
				Cancelling frees the slot so another pet can book it. You can always
				schedule a new visit afterwards.
			</p>
			{cancel.error && <div className="admin-form-error">⚠ {cancel.error.message}</div>}
		</AdminModal>
	);
}

/* ---------------- PAGE ---------------- */
function ClientAppointments() {
	const navigate = useNavigate();
	const { data: appointments = [], isPending } = useMyAppointments();
	const [statusFilter, setStatusFilter] = useState("upcoming");
	const [search, setSearch] = useState("");
	const [canceling, setCanceling] = useState(null);

	const rows = useMemo(() => {
		const q = search.trim().toLowerCase();
		return appointments
			.filter((a) => {
				if (statusFilter === "upcoming")
					return a.status === "pending" || a.status === "confirmed";
				if (statusFilter === "completed") return a.status === "completed";
				if (statusFilter === "cancelled") return a.status === "cancelled";
				return true;
			})
			.filter((a) => {
				if (!q) return true;
				return `${a.pet?.name ?? ""} ${a.reason ?? ""} ${a.vet ?? ""}`
					.toLowerCase()
					.includes(q);
			})
			.sort((x, y) => {
				// Upcoming first (date/time), history newest first.
				if (statusFilter === "upcoming")
					return `${x.date} ${x.time}` < `${y.date} ${y.time}` ? -1 : 1;
				return new Date(y.date) - new Date(x.date);
			});
	}, [appointments, statusFilter, search]);

	const todayCount = appointments.filter((a) => isToday(a.date) && (a.status === "confirmed" || a.status === "pending")).length;
	const upcomingCount = appointments.filter((a) => a.status === "pending" || a.status === "confirmed").length;
	const canCancel = (a) => a.status === "pending" || a.status === "confirmed";

	return (
		<>
			<ClientHeader
				title="My Appointments"
				subtitle="Upcoming visits and your appointment history."
				actions={
					<button className="admin-primary-button" type="button" onClick={() => navigate("/book-appointment")}>
						<FiPlus />
						<span>Book an appointment</span>
					</button>
				}
			/>

			{isPending ? (
				<div className="admin-loading" style={{ minHeight: "50vh" }}>
					<DogLoader />
					<p>Loading your appointments…</p>
				</div>
			) : (
				<section className="admin-panel client-appointments-panel">
					<div className="client-appt-toolbar">
						<div className="client-appt-tabs">
							<button
								type="button"
								className={statusFilter === "upcoming" ? "active" : ""}
								onClick={() => setStatusFilter("upcoming")}
							>
								Upcoming
								<span className="client-appt-tab-count">{upcomingCount}</span>
							</button>
							<button
								type="button"
								className={statusFilter === "completed" ? "active" : ""}
								onClick={() => setStatusFilter("completed")}
							>
								Completed
							</button>
							<button
								type="button"
								className={statusFilter === "cancelled" ? "active" : ""}
								onClick={() => setStatusFilter("cancelled")}
							>
								Cancelled
							</button>
						</div>

						<input
							type="search"
							className="client-appt-search"
							placeholder="Search pet, reason or vet…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							disabled={statusFilter !== "upcoming"}
						/>
					</div>

					{statusFilter === "upcoming" && todayCount > 0 && (
						<div className="client-today-banner">
							<span>⏰</span>
							<strong>You have {todayCount} visit{todayCount === 1 ? "" : "s"} today</strong>
							<em>Please arrive 10 minutes early.</em>
						</div>
					)}

					{rows.length === 0 ? (
						<p className="admin-panel-empty">
							{statusFilter === "upcoming"
								? "Nothing scheduled. Book a visit when your pet is due."
								: "No appointments in this view."}
						</p>
					) : (
						<div className="client-appt-list">
							{rows.map((a) => {
								const pet = a.pet;
								return (
									<article className="client-appt-card" key={a._id}>
										<div className="client-appt-when">
											<span className="client-appt-day">
												{formatDate(a.date)}
												{isToday(a.date) && canCancel(a) ? " · Today" : ""}
											</span>
											<strong>{format12h(a.time)}</strong>
										</div>

										<div className="client-appt-who">
											<div className="client-appt-avatar">{SPECIES_ICON(pet?.species)}</div>
											<div>
												<strong>{pet?.name ?? "Unknown pet"}</strong>
												<span>
													{pet?.breed ?? pet?.species ?? "—"} · {a.reason ?? "Visit"}
												</span>
											</div>
										</div>

										<div className="client-appt-vet">
											<span>Veterinarian</span>
											<strong>{a.vet ?? "—"}</strong>
										</div>

										<span
											className={`status ${a.status === "confirmed" ? "confirmed" : a.status}`}
										>
											{a.status.charAt(0).toUpperCase() + a.status.slice(1)}
										</span>

										{canCancel(a) && (
											<button
												className="client-appt-cancel"
												type="button"
												onClick={() => setCanceling(a)}
											>
												Cancel
											</button>
										)}
									</article>
								);
							})}
						</div>
					)}
				</section>
			)}

			{canceling && <CancelModal appointment={canceling} onClose={() => setCanceling(null)} />}
		</>
	);
}

export default ClientAppointments;
