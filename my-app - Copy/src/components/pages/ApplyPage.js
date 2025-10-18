import React, { useState } from "react";
import axios from "axios";
import "./ApplyPage.css"; // create this file for custom styles

const BACKEND_URL = "http://192.168.220.36:5000/api/applications";


function ApplyPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    resume: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") setFormData({ ...formData, resume: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!formData.resume) return setError("Please upload your resume.");

    const data = new FormData();
    for (let key in formData) data.append(key, formData[key]);

    try {
      const res = await axios.post(BACKEND_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      setFormData({ name: "", email: "", phone: "", role: "", resume: null });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit application.");
    }
  };

  return (
    <div className="apply-container">
      <div className="apply-card">
        <h2 className="apply-title">Apply for Internship / Job</h2>
        <p className="apply-subtitle">Complete the form below to submit your application</p>

        {message && <div className="apply-success">{message}</div>}
        {error && <div className="apply-error">{error}</div>}

        <form className="apply-form" onSubmit={handleSubmit}>
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
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Job / Internship Role"
            value={formData.role}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            required
          />
          {formData.resume && <p className="file-name">Selected File: {formData.resume.name}</p>}

          <button type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
}

export default ApplyPage;
