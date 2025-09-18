import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "Le nom d’utilisateur est obligatoire.";
    if (!formData.password.trim())
      newErrors.password = "Le mot de passe est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post("token/", {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Get current user info
      const meResponse = await axiosInstance.get("user/me/");
      const { is_staff } = meResponse.data;
      localStorage.setItem("is_staff", is_staff);

      navigate(is_staff ? "/admin-taches" : "/taches");
    } catch (err) {
      console.error(err);
      setServerError("Nom d’utilisateur ou mot de passe invalide.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow p-4 m-5 bg-light" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Connexion</h3>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">
              Nom d’utilisateur <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              placeholder="Entrez votre nom d’utilisateur"
            />
            {errors.username && <div className="text-danger">{errors.username}</div>}
          </div>

          {/* Password */}
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
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-lg shadow w-100"
            style={{ backgroundColor: "#7C3AED", color: "white" }}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Connexion"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
