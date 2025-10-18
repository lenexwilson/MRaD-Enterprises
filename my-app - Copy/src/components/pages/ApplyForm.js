import React, { useState } from "react";
import axios from "axios";
import "./ApplyForm.css";

const BACKEND_URL = "http://localhost:5000";

function ApplyForm({ selectedRole, type }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appliedFor: selectedRole || "",
    type: type || "job",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/applications`, formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        appliedFor: "",
        type: type || "job",
        message: "",
      });
    } catch (err) {
      console.error("❌ Error submitting application:", err);
      alert("Error submitting form");
    }
  };

  return (
    <div className="apply-container">
      <h1>Apply for {formData.appliedFor || "a position"}</h1>
      {submitted ? (
        <p className="success-msg">✅ Your application was submitted successfully!</p>
      ) : (
        <form onSubmit={handleSubmit} className="apply-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="appliedFor"
            placeholder="Role (e.g. Software Engineer)"
            value={formData.appliedFor}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Why should we hire you?"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button type="submit">Submit Application</button>
        </form>
      )}
    </div>
  );
}

export default ApplyForm;
