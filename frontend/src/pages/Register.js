import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    consentement_rgpd: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Le nom d'utilisateur est obligatoire.";
    if (!formData.first_name.trim()) newErrors.first_name = "Le prénom est obligatoire.";
    if (!formData.last_name.trim()) newErrors.last_name = "Le nom est obligatoire.";
    if (!formData.email.trim()) newErrors.email = "L'email est obligatoire.";
    if (!formData.password.trim()) newErrors.password = "Le mot de passe est requis.";
    if (!formData.consentement_rgpd)
      newErrors.consentement_rgpd = "Vous devez accepter la politique de confidentialité.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await axiosInstance.post("user/register/", formData);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.error || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow p-4 bg-light mb-5" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center mb-4">S'inscrire</h3>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Inputs */}
          {["username", "first_name", "last_name", "email", "password"].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label">
                {field.replace("_", " ")} <span className="text-danger">*</span>
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`form-control ${errors[field] ? "is-invalid" : ""}`}
              />
              {errors[field] && <div className="text-danger">{errors[field]}</div>}
            </div>
          ))}

          {/* Consent */}
          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="consentement_rgpd"
              checked={formData.consentement_rgpd}
              onChange={handleChange}
              className={`form-check-input ${errors.consentement_rgpd ? "is-invalid" : ""}`}
            />
            <label className="form-check-label">
              J’accepte les CGU et la{" "}
              <a href="/privacy_policy" target="_blank" rel="noopener noreferrer">
                politique de confidentialité
              </a>
            </label>
            {errors.consentement_rgpd && (
              <div className="text-danger">{errors.consentement_rgpd}</div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-lg shadow w-100"
            style={{ backgroundColor: "#7C3AED", color: "white" }}
            disabled={loading}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
