import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Le nom d’utilisateur est obligatoire.";
    if (!formData.password.trim()) newErrors.password = "Le mot de passe est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // 1️⃣ Get JWT tokens
      const response = await axiosInstance.post("/token/", {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // 2️⃣ Fetch user info
      const meResponse = await axiosInstance.get("/user/me/");
      const { est_admin } = meResponse.data || {};
      localStorage.setItem("is_staff", est_admin || false);

      // 3️⃣ Redirect based on role
      navigate(est_admin ? "/admin-taches" : "/taches");
    } catch (err) {
      console.error(err.response?.data);
      if (err.response?.status === 401) {
        setServerError("Nom d’utilisateur ou mot de passe invalide.");
      } else if (err.response?.data) {
        // Backend validation errors
        const msg = Object.values(err.response.data).flat().join(" ");
        setServerError(msg || "Erreur lors de la connexion.");
      } else {
        setServerError("Erreur réseau ou serveur.");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow p-4 m-5 bg-light" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Connexion</h3>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          {["username", "password"].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label">
                {field === "username" ? "Nom d’utilisateur" : "Mot de passe"}{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`form-control ${errors[field] ? "is-invalid" : ""}`}
                placeholder={field === "password" ? "Entrez votre mot de passe" : "Entrez votre nom d’utilisateur"}
              />
              {errors[field] && <div className="text-danger">{errors[field]}</div>}
            </div>
          ))}
          <button
            type="submit"
            className="btn btn-lg shadow w-100"
            style={{ backgroundColor: "#7C3AED", color: "white" }}
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
