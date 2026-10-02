import { Link } from "react-router-dom";

import mochi from "../assets/images/pets/mochi.jpeg";
import luna from "../assets/images/pets/luna.jpeg";
import bruno from "../assets/images/pets/bruno.jpeg";
import cookie from "../assets/images/pets/cookie.jpeg";

import logo from "../assets/logo/happy-paws-logo.png";

function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="navbar-inner">

          <a href="#home" className="logo">
            <img src={logo} alt="Mutuals Paws" />
          </a>

          <nav className="nav-links">
            <a href="#services">Services</a>
            <a href="#pets">Pet Care</a>
            <a href="#vets">Veterinarians</a>
            <a href="#visit">Visit Us</a>
          </nav>

         

        <div className="nav-right">
        <Link
            to="/admin/login"
            className="staff-login-button"
        >
            Staff Login
        </Link>

        <span className="phone">
            ☎ 0917 123 4567
        </span>

        <button
            type="button"
            className="login-button"
        >
            Login
        </button>

        <Link
            to="/book-appointment"
            className="book-button"
        >
            Book Appointment
        </Link>
        </div>


        </div>


            </header>


      {/* ================= HERO ================= */}
      <main>

        <section className="hero" id="home">
          <div className="hero-inner">

            <div className="hero-text">

              <div className="eyebrow">
                ✦ CARING FOR PETS, CARING FOR FAMILY
              </div>

              <h1>
                Better care for
                <span> happier paws.</span>
              </h1>

              <p>
                Compassionate veterinary care for the pets
                who are part of your family. From everyday
                wellness to unexpected moments, we're here
                to help them live their happiest, healthiest lives.
              </p>

              <div className="hero-buttons">

                <Link
                to="/book-appointment"
                className="primary-button"
                >
                Book an Appointment
                <span>→</span>
                </Link>

                <button
                  type="button"
                  className="secondary-button"
                >
                  Explore Services
                </button>

              </div>

              <div className="rating">
                <span className="stars">
                  ★★★★★
                </span>

                <strong>4.9/5</strong>

                <span>
                  trusted by pet parents
                </span>
              </div>

            </div>


            <div className="hero-photo">

              <div className="hero-photo-box">
                <img
                  src={bruno}
                  alt="Bruno"
                />
              </div>

              <div className="hero-stat">
                <strong>98.6%</strong>

                <span>
                  of pet parents would recommend
                  Mutuals Paws
                </span>
              </div>

            </div>

          </div>
        </section>


        {/* ================= QUICK BOOKING ================= */}
        <section className="booking">

          <div className="booking-inner">

            <div className="booking-heading">

              <h2>
                Find an appointment
              </h2>

              <p>
                Tell us what your pet needs and we'll
                help you find the right time.
              </p>

            </div>


            <div className="booking-fields">

              <div className="field">

                <label>
                  Pet Type
                </label>

                <select defaultValue="">
                  <option value="" disabled>
                    Select pet type
                  </option>

                  <option>
                    Dog
                  </option>

                  <option>
                    Cat
                  </option>

                  <option>
                    Other
                  </option>
                </select>

              </div>


              <div className="field">

                <label>
                  Reason for Visit
                </label>

                <select defaultValue="">
                  <option value="" disabled>
                    Select service
                  </option>

                  <option>
                    Wellness Exam
                  </option>

                  <option>
                    Vaccination
                  </option>

                  <option>
                    Dental Care
                  </option>

                  <option>
                    Diagnostic Testing
                  </option>

                </select>

              </div>


              <div className="field">

                <label>
                  Preferred Date
                </label>

                <input
                  type="date"
                  aria-label="Preferred appointment date"
                />

              </div>


            <Link
            to="/book-appointment"
            className="find-button"
            >
            Find Times →
            </Link>

            </div>

          </div>

        </section>


        {/* ================= WHY US ================= */}
        <section className="features">

          <div className="section-container">

            <div className="section-heading">

              <span>
                WHY MUTUALS PAWS
              </span>

              <h2>
                Care that feels different.
              </h2>

              <p>
                We combine compassionate people,
                modern technology, and thoughtful
                veterinary care under one roof.
              </p>

            </div>


            <div className="feature-grid">

              <div className="feature-card">

                <div className="feature-icon">
                  ♡
                </div>

                <h3>
                  Gentle by nature
                </h3>

                <p>
                  We take the time to make every pet
                  feel safe, calm, and comfortable
                  throughout their visit.
                </p>

              </div>


              <div className="feature-card">

                <div className="feature-icon">
                  ▣
                </div>

                <h3>
                  Everything in one place
                </h3>

                <p>
                  Keep appointments, vaccinations,
                  medical history, and important
                  pet information organized online.
                </p>

              </div>


              <div className="feature-card">

                <div className="feature-icon">
                  ✚
                </div>

                <h3>
                  Modern veterinary care
                </h3>

                <p>
                  Our team uses reliable diagnostic
                  tools and modern techniques to
                  provide informed care.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================= SERVICES ================= */}
      
<section
  className="services"
  id="services"
>
  <div className="section-container">

    <div className="section-heading services-heading">
      <span>OUR SERVICES</span>

      <h2>
        Here for every stage.
      </h2>

      <p>
        From preventative care to specialized
        treatment, we're here when your pet
        needs us.
      </p>
    </div>

    <div className="service-grid">

      <Service
        icon="♡"
        title="Wellness Exams"
        text="Routine health checks designed to catch concerns early."
        price="From ₱850"
      />

      <Service
        icon="✦"
        title="Dental Care"
        text="Professional dental cleaning to support healthy teeth and gums."
        price="From ₱1,200"
      />

      <Service
        icon="✚"
        title="Vaccinations"
        text="Essential vaccinations to help protect your pet from illness."
        price="From ₱550"
      />

      <Service
        icon="!"
        title="Urgent Care"
        text="Prompt veterinary attention for unexpected health concerns."
        price="Emergency care"
      />

      <Service
        icon="⌕"
        title="Diagnostics"
        text="Bloodwork and testing to help our veterinarians understand your pet."
        price="20+ Tests"
      />

      <Service
        icon="◆"
        title="Surgery"
        text="Specialized procedures supported by careful monitoring and aftercare."
        price="Consultation"
      />

    </div>

  </div>
</section>




        {/* ================= PET PORTAL ================= */}
        <section
          className="pet-section"
          id="pets"
        >

          <div className="pet-inner">

            <div className="pet-text">

              <span className="section-label">
                YOUR PET'S HEALTH
              </span>

              <h2>
                Their records,
                <span> always close.</span>
              </h2>

              <p>
                With your Mutuals Paws client portal,
                you can keep your pet's important
                health information organized and
                accessible whenever you need it.
              </p>


              <ul>

                <li>
                  ✓ View medical records
                </li>

                <li>
                  ✓ Keep track of vaccinations
                </li>

                <li>
                  ✓ Manage upcoming appointments
                </li>

                <li>
                  ✓ Update your pet's information
                </li>

              </ul>


              <button
                type="button"
                className="primary-button"
              >
                View Pet Records →
              </button>

            </div>


            <div className="record-wrapper">

              <div className="record-card">

                <div className="record-top">

                  <div>

                    <span>
                      PET PROFILE
                    </span>

                    <h3>
                      Mochi
                    </h3>

                  </div>

                  <span className="healthy">
                    ● Healthy
                  </span>

                </div>


                <div className="record-profile">

                  <img
                    src={mochi}
                    alt="Mochi"
                  />

                  <div>

                    <h3>
                      Mochi
                    </h3>

                    <p>
                      Golden Retriever · 3 years old
                    </p>

                  </div>

                </div>


                <div className="record-stats">

                  <div>

                    <span>
                      Last Visit
                    </span>

                    <strong>
                      Aug 18
                    </strong>

                  </div>


                  <div>

                    <span>
                      Vaccines
                    </span>

                    <strong>
                      Up to date
                    </strong>

                  </div>


                  <div>

                    <span>
                      Next Checkup
                    </span>

                    <strong>
                      Nov 18
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= VETERINARIANS ================= */}
        <section
          className="vets"
          id="vets"
        >

          <div className="section-container">

            <div className="section-heading">

              <span>
                OUR VETERINARIANS
              </span>

              <h2>
                Meet your pet's care team.
              </h2>

              <p>
                Experienced professionals who
                treat every patient with patience,
                respect, and care.
              </p>

            </div>


            <div className="vet-grid">

              <Vet
                image={luna}
                name="Dr. Evelyn Dane"
                specialty="General Practice"
              />

              <Vet
                image={bruno}
                name="Dr. Alex Mercer"
                specialty="Surgery & Diagnostics"
              />

              <Vet
                image={cookie}
                name="Dr. Elena Rostova"
                specialty="Internal Medicine"
              />

            </div>

          </div>

        </section>


        {/* ================= TESTIMONIALS ================= */}
        <section className="testimonials">

          <div className="section-container">

            <div className="section-heading">

              <span>
                PET PARENTS
              </span>

              <h2>
                Loved by our community.
              </h2>

              <p>
                A few words from the people who
                trust us with their pets.
              </p>

            </div>


            <div className="testimonial-grid">

              <Review
                text="The staff were so gentle with Mochi. We both felt comfortable from the moment we walked in."
                name="Maria L."
                pet="Mochi's mom"
              />

              <Review
                text="I love being able to see my pet's records and appointments online. It makes everything so much easier."
                name="James R."
                pet="Luna's dad"
              />

              <Review
                text="The veterinarians took their time explaining everything. I never felt rushed during our visit."
                name="Sofia C."
                pet="Cookie's mom"
              />

            </div>

          </div>

        </section>


        {/* ================= EMERGENCY ================= */}
        <section className="emergency">

          <div className="emergency-inner">

            <div>

              <span className="emergency-label">
                NEED HELP NOW?
              </span>

              <h2>
                Is your pet having an emergency?
              </h2>

              <p>
                Call our clinic directly for urgent
                veterinary assistance.
              </p>

            </div>

            <button
              type="button"
              className="emergency-button"
            >
              ☎ Call Clinic
            </button>

          </div>

        </section>


        {/* ================= LOCATION ================= */}
```jsx
<section
  className="pet-section"
  id="pets"
>
  <div className="pet-inner">

    <div className="pet-text">

      <span className="section-label">
        YOUR PET'S HEALTH
      </span>

      <h2>
        Their records,
        <span> always close.</span>
      </h2>

      <p>
        With your Mutuals Paws client portal,
        you can keep your pet's important
        health information organized and
        accessible whenever you need it.
      </p>

      <ul>

        <li>
          <span>✓</span>
          View medical records
        </li>

        <li>
          <span>✓</span>
          Keep track of vaccinations
        </li>

        <li>
          <span>✓</span>
          Manage upcoming appointments
        </li>

        <li>
          <span>✓</span>
          Update your pet's information
        </li>

      </ul>

      <button
        type="button"
        className="primary-button"
      >
        View Pet Records →
      </button>

    </div>


    <div className="record-wrapper">

      <div className="record-card">

        <div className="record-top">

          <div>
            <span>
              PET PROFILE
            </span>

            <h3>
              Mochi
            </h3>
          </div>

          <span className="healthy">
            ● Healthy
          </span>

        </div>


        <div className="record-profile">

          <img
            src={mochi}
            alt="Mochi"
          />

          <div>

            <h3>
              Mochi
            </h3>

            <p>
              Golden Retriever · 3 years old
            </p>

          </div>

        </div>


        <div className="record-stats">

          <div>
            <span>
              Last Visit
            </span>

            <strong>
              Aug 18
            </strong>
          </div>

          <div>
            <span>
              Vaccines
            </span>

            <strong>
              Up to date
            </strong>
          </div>

          <div>
            <span>
              Next Checkup
            </span>

            <strong>
              Nov 18
            </strong>
          </div>

        </div>

      </div>

      <div className="record-decoration">
        <span>♥</span>
        <p>Always here for them.</p>
      </div>

    </div>

  </div>
</section>



      </main>


      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <img
              src={logo}
              alt="Mutuals Paws"
            />

            <p>
              Compassionate veterinary care
              for the pets who mean the most
              to you.
            </p>

          </div>


          <div>

            <h3>
              Explore
            </h3>

            <a href="#services">
              Services
            </a>

            <a href="#pets">
              Pet Care
            </a>

            <a href="#vets">
              Veterinarians
            </a>

            <a href="#visit">
              Visit Us
            </a>

          </div>


          <div>

            <h3>
              Client
            </h3>

            <a href="#home">
              Client Login
            </a>

            <a href="#home">
              Appointments
            </a>

            <a href="#pets">
              Pet Records
            </a>

          </div>


          <div>

            <h3>
              Contact
            </h3>

            <a href="#home">
              0917 123 4567
            </a>

            <a href="#visit">
              Quezon City
            </a>

            <a href="#home">
              info@mutualspaws.com
            </a>

          </div>

        </div>


        <div className="footer-bottom">
          © 2026 Mutuals Paws. All rights reserved.
        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   SERVICE COMPONENT
========================================================= */


function Service({ icon, title, text, price }) {
  return (
    <div className="service-card-new">

      <div className="service-icon-new">
        {icon}
      </div>

      <div className="service-content-new">

        <h3>{title}</h3>

        <p>{text}</p>

        <div className="service-bottom-new">
          <span>{price}</span>

          <span className="service-arrow-new">
            →
          </span>
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   VET COMPONENT
========================================================= */

function Vet({
  image,
  name,
  specialty
}) {
  return (
    <div className="vet-card">

      <div className="vet-photo">

        <img
          src={image}
          alt={name}
        />

        <span className="vet-badge">
          VET
        </span>

      </div>

      <div className="vet-info">

        <div className="vet-specialty">
          {specialty}
        </div>

        <h3>
          {name}
        </h3>

        <p>
          Dedicated to providing thoughtful,
          personalized care for every patient.
        </p>

        <div className="vet-footer">
          <span>
            Meet your veterinarian
          </span>

          <span className="vet-arrow">
            ↗
          </span>
        </div>

      </div>

    </div>
  );
}



/* =========================================================
   REVIEW COMPONENT
========================================================= */

function Review({
  text,
  name,
  pet
}) {
  return (
    <div className="review-card">

      <div className="review-top">

        <div className="review-stars">
          ★★★★★
        </div>

        <span className="review-quote">
          “
        </span>

      </div>

      <p>
        {text}
      </p>

      <div className="review-person">

        <div className="review-avatar">
          {name.charAt(0)}
        </div>

        <div>
          <strong>
            {name}
          </strong>

          <span>
            {pet}
          </span>
        </div>

      </div>

    </div>
  );
}

export default Home;