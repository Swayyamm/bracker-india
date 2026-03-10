import React from "react";

const Contact = () => {
  return (
    <div className="contact-page container">

      <h1 className="page-title">Contact Us</h1>

      <div className="contact-grid">

        <div>
          <p><b>Address:</b> Ahmedabad, Gujarat</p>
          <p><b>Phone:</b> +91-XXXXXXXXXX</p>
          <p><b>Email:</b> info@brackerindia.com</p>
        </div>

        <form className="contact-form">

          <input placeholder="Name" />
          <input placeholder="Email" />
          <textarea rows="4" placeholder="Message" />

          <button className="btn">Send</button>

        </form>

      </div>

    </div>
  );
};

export default Contact;