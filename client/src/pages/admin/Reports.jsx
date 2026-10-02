import AdminSidebar from "../../components/AdminSidebar";

function Reports() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-page-header">
          <div>
            <p className="admin-eyebrow">CLINIC ANALYTICS</p>

            <h1>Reports</h1>

            <p>
              Monitor clinic activity, appointments, patients, and
              veterinarian performance.
            </p>
          </div>

          <div className="reports-header-actions">
            <select className="reports-date-select" defaultValue="month">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>

            <button className="admin-primary-button" type="button">
              Export Report
            </button>
          </div>
        </header>

        {/* Summary */}
        <section className="reports-summary">
          <div className="reports-summary-card">
            <div className="reports-summary-icon blue">▣</div>

            <div>
              <span>Total Appointments</span>
              <strong>186</strong>
              <small>+12.5% from last month</small>
            </div>
          </div>

          <div className="reports-summary-card">
            <div className="reports-summary-icon green">✓</div>

            <div>
              <span>Completed Visits</span>
              <strong>152</strong>
              <small>81.7% completion rate</small>
            </div>
          </div>

          <div className="reports-summary-card">
            <div className="reports-summary-icon yellow">◷</div>

            <div>
              <span>New Patients</span>
              <strong>24</strong>
              <small>+8.3% from last month</small>
            </div>
          </div>

          <div className="reports-summary-card">
            <div className="reports-summary-icon soft-blue">₱</div>

            <div>
              <span>Clinic Revenue</span>
              <strong>₱184,500</strong>
              <small>This month's total</small>
            </div>
          </div>
        </section>

        {/* Main Reports */}
        <section className="reports-grid">
          {/* Appointment Overview */}
          <div className="admin-panel reports-panel">
            <div className="reports-panel-header">
              <div>
                <h2>Appointment Overview</h2>
                <p>Appointments recorded throughout the month.</p>
              </div>

              <span className="reports-panel-label">October 2026</span>
            </div>

            <div className="reports-chart">
              <div className="reports-chart-row">
                <span>Week 1</span>

                <div className="reports-bar-track">
                  <div
                    className="reports-bar"
                    style={{ width: "72%" }}
                  ></div>
                </div>

                <strong>42</strong>
              </div>

              <div className="reports-chart-row">
                <span>Week 2</span>

                <div className="reports-bar-track">
                  <div
                    className="reports-bar"
                    style={{ width: "88%" }}
                  ></div>
                </div>

                <strong>51</strong>
              </div>

              <div className="reports-chart-row">
                <span>Week 3</span>

                <div className="reports-bar-track">
                  <div
                    className="reports-bar"
                    style={{ width: "65%" }}
                  ></div>
                </div>

                <strong>38</strong>
              </div>

              <div className="reports-chart-row">
                <span>Week 4</span>

                <div className="reports-bar-track">
                  <div
                    className="reports-bar"
                    style={{ width: "94%" }}
                  ></div>
                </div>

                <strong>55</strong>
              </div>
            </div>

            <div className="reports-chart-footer">
              <span>Total appointments</span>
              <strong>186</strong>
            </div>
          </div>

          {/* Appointment Status */}
          <div className="admin-panel reports-panel">
            <div className="reports-panel-header">
              <div>
                <h2>Appointment Status</h2>
                <p>Current appointment distribution.</p>
              </div>
            </div>

            <div className="reports-status-list">
              <div className="reports-status-item">
                <div className="reports-status-name">
                  <span className="reports-status-dot confirmed"></span>
                  <span>Confirmed</span>
                </div>

                <strong>86</strong>
              </div>

              <div className="reports-status-item">
                <div className="reports-status-name">
                  <span className="reports-status-dot pending"></span>
                  <span>Pending</span>
                </div>

                <strong>24</strong>
              </div>

              <div className="reports-status-item">
                <div className="reports-status-name">
                  <span className="reports-status-dot completed"></span>
                  <span>Completed</span>
                </div>

                <strong>64</strong>
              </div>

              <div className="reports-status-item">
                <div className="reports-status-name">
                  <span className="reports-status-dot cancelled"></span>
                  <span>Cancelled</span>
                </div>

                <strong>12</strong>
              </div>
            </div>

            <div className="reports-status-total">
              <span>Total</span>
              <strong>186 appointments</strong>
            </div>
          </div>
        </section>

        {/* Veterinarian Workload */}
        <section className="admin-panel reports-panel reports-vet-panel">
          <div className="reports-panel-header">
            <div>
              <h2>Veterinarian Workload</h2>
              <p>Appointments handled by each veterinarian this month.</p>
            </div>
          </div>

          <div className="reports-vet-list">
            <div className="reports-vet-row">
              <div className="reports-vet-info">
                <div className="reports-vet-avatar">ED</div>

                <div>
                  <strong>Dr. Evelyn Dane</strong>
                  <span>General Practice</span>
                </div>
              </div>

              <div className="reports-vet-progress">
                <div className="reports-progress-track">
                  <div
                    className="reports-progress-bar"
                    style={{ width: "90%" }}
                  ></div>
                </div>

                <strong>45</strong>
              </div>
            </div>

            <div className="reports-vet-row">
              <div className="reports-vet-info">
                <div className="reports-vet-avatar">AM</div>

                <div>
                  <strong>Dr. Alex Mercer</strong>
                  <span>Surgery & Diagnostics</span>
                </div>
              </div>

              <div className="reports-vet-progress">
                <div className="reports-progress-track">
                  <div
                    className="reports-progress-bar"
                    style={{ width: "78%" }}
                  ></div>
                </div>

                <strong>39</strong>
              </div>
            </div>

            <div className="reports-vet-row">
              <div className="reports-vet-info">
                <div className="reports-vet-avatar">ER</div>

                <div>
                  <strong>Dr. Elena Rostova</strong>
                  <span>Internal Medicine</span>
                </div>
              </div>

              <div className="reports-vet-progress">
                <div className="reports-progress-track">
                  <div
                    className="reports-progress-bar"
                    style={{ width: "68%" }}
                  ></div>
                </div>

                <strong>34</strong>
              </div>
            </div>

            <div className="reports-vet-row">
              <div className="reports-vet-info">
                <div className="reports-vet-avatar">MB</div>

                <div>
                  <strong>Dr. Marcus Bennett</strong>
                  <span>Dermatology</span>
                </div>
              </div>

              <div className="reports-vet-progress">
                <div className="reports-progress-track">
                  <div
                    className="reports-progress-bar"
                    style={{ width: "55%" }}
                  ></div>
                </div>

                <strong>27</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Services */}
        <section className="admin-panel reports-panel">
          <div className="reports-panel-header">
            <div>
              <h2>Popular Services</h2>
              <p>Most requested veterinary services this month.</p>
            </div>
          </div>

          <div className="reports-services-grid">
            <div className="reports-service-item">
              <div>
                <strong>General Check-up</strong>
                <span>64 appointments</span>
              </div>

              <b>34%</b>
            </div>

            <div className="reports-service-item">
              <div>
                <strong>Vaccination</strong>
                <span>42 appointments</span>
              </div>

              <b>23%</b>
            </div>

            <div className="reports-service-item">
              <div>
                <strong>Consultation</strong>
                <span>31 appointments</span>
              </div>

              <b>17%</b>
            </div>

            <div className="reports-service-item">
              <div>
                <strong>Dental Cleaning</strong>
                <span>24 appointments</span>
              </div>

              <b>13%</b>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reports;