import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [worksheets, setWorksheets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // For editing
  const [editingWorksheet, setEditingWorksheet] = useState(null);
  const [editedData, setEditedData] = useState({ hoursWorked: "", summary: "" });

  // Fetch all data from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    const fetchWorksheets = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/worksheets`);
        setWorksheets(res.data);
      } catch (err) {
        console.error("Error fetching worksheets:", err);
      }
    };

    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/applications`);
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    Promise.all([fetchMessages(), fetchWorksheets(), fetchApplications()]).then(() =>
      setLoading(false)
    );
  }, []);

  // Handle edit button click
  const handleEditClick = (worksheet) => {
    setEditingWorksheet(worksheet);
    setEditedData({
      hoursWorked: worksheet.hoursWorked,
      summary: worksheet.summary,
    });
  };

  // Handle input change
  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/worksheets/${editingWorksheet._id}`,
        editedData
      );

      // Update frontend state
      setWorksheets((prev) =>
        prev.map((w) => (w._id === res.data._id ? res.data : w))
      );

      // Reset editing mode
      setEditingWorksheet(null);
      setEditedData({ hoursWorked: "", summary: "" });
      alert("Worksheet updated successfully!");
    } catch (err) {
      console.error("Error updating worksheet:", err);
      alert("Failed to update worksheet!");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading admin data...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h1 className="text-3xl font-bold mb-5 text-center">Admin Dashboard</h1>

      {/* Messages */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">User Messages</h2>
        {messages.length > 0 ? (
          <ul className="border p-4 rounded">
            {messages.map((msg) => (
              <li key={msg._id} className="border-b py-2">
                <strong>{msg.name}</strong> ({msg.email})<br />
                {msg.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages found.</p>
        )}
      </section>

      {/* Worksheets */}
      <section style={{ marginTop: "40px" }}>
        <h2 className="text-2xl font-semibold mb-3">Worksheets</h2>
        {worksheets.length > 0 ? (
          <table className="border-collapse border w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Employee ID</th>
                <th className="border px-4 py-2">Hours Worked</th>
                <th className="border px-4 py-2">Summary</th>
                <th className="border px-4 py-2">Submitted At</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {worksheets.map((w) => (
                <tr key={w._id}>
                  <td className="border px-4 py-2">{w.userId}</td>
                  <td className="border px-4 py-2">{w.hoursWorked}</td>
                  <td className="border px-4 py-2">{w.summary}</td>
                  <td className="border px-4 py-2">
                    {new Date(w.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEditClick(w)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No worksheets found.</p>
        )}
      </section>

      {/* Edit Form (Popup/Modal style) */}
      {editingWorksheet && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h3 className="text-xl font-semibold mb-3">Edit Worksheet</h3>

            <label className="block mb-2">Hours Worked:</label>
            <input
              type="number"
              name="hoursWorked"
              value={editedData.hoursWorked}
              onChange={handleChange}
              className="border p-2 w-full mb-3"
            />

            <label className="block mb-2">Summary:</label>
            <textarea
              name="summary"
              value={editedData.summary}
              onChange={handleChange}
              className="border p-2 w-full mb-3"
              rows="3"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditingWorksheet(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job/Internship Applications */}
      <section style={{ marginTop: "40px" }}>
        <h2 className="text-2xl font-semibold mb-3">Internship / Job Applications</h2>
        {applications.length > 0 ? (
          <ul className="border p-4 rounded">
            {applications.map((app) => (
              <li key={app._id} className="border-b py-2">
                <strong>{app.name}</strong> — {app.role}
                <br />
                <a
                  href={`http://localhost:5000/${app.resume.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No applications found.</p>
        )}
      </section>
    </div>
  );
};

export default AdminMessages;
