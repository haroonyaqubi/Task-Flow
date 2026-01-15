import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";

function Login() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  // Validate form (French messages)
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Le nom d'utilisateur est obligatoire.";
    if (!formData.password.trim()) newErrors.password = "Le mot de passe est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      //Get JWT tokens from backend
      const response = await axiosInstance.post("/token/", {
        username: formData.username,
        password: formData.password,
      });

      //Store tokens in localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("token_timestamp", Date.now().toString());

      //Fetch user info to check if admin
      const meResponse = await axiosInstance.get("/user/me/");
      const { est_admin } = meResponse.data || {};
      localStorage.setItem("is_staff", est_admin || false);

      //Redirect based on user role
      navigate(est_admin ? "/admin-taches" : "/taches");

    } catch (err) {
      console.error(err.response?.data);
      if (err.response?.status === 401) {
        setServerError("Nom d'utilisateur ou mot de passe invalide.");
      } else if (err.response?.data) {
        // Show backend validation errors
        const msg = Object.values(err.response.data).flat().join(" ");
        setServerError(msg || "Erreur lors de la connexion.");
      } else {
        setServerError("Erreur réseau ou serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow p-4 m-5 bg-light" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Connexion</h3>
        {serverError && (
          <ErrorDisplay
            error={serverError}
            onClose={() => setServerError("")}
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username field */}
          <div className="mb-3">
            <label className="form-label">
              Nom d'utilisateur <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              placeholder="Entrez votre nom d'utilisateur"
              disabled={loading}
            />
            {errors.username && <div className="text-danger">{errors.username}</div>}
          </div>

          {/* Password field */}
          <div className="mb-3">
            <label className="form-label">
              Mot de passe <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Entrez votre mot de passe"
              disabled={loading}
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>

          {loading ? (
            <LoadingSpinner text="Connexion..." />
          ) : (
            <button
              type="submit"
              className="btn btn-lg shadow w-100"
              style={{ backgroundColor: "#7C3AED", color: "white" }}
              disabled={loading}
            >
              Connexion
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;