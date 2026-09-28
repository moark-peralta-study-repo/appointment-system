
function Service({ icon, title, text, price }) {
  return (
    <div className="service-card-new">

      <div className="service-top-new">
        <div className="service-icon-new">
          {icon}
        </div>

        <span className="service-arrow-new">
          ↗
        </span>
      </div>

      <div className="service-content-new">

        <h3>{title}</h3>

        <p>{text}</p>

      </div>

      <div className="service-bottom-new">
        <span>{price}</span>
        <span className="service-learn-new">
          Learn more
        </span>
      </div>

    </div>
  );
}

export default Services;