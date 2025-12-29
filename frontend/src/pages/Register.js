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
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Le nom d'utilisateur est requis.";
    if (!formData.first_name.trim()) newErrors.first_name = "Le prénom est requis.";
    if (!formData.last_name.trim()) newErrors.last_name = "Le nom est requis.";
    if (!formData.email) {
      newErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide.";
    }
    if (!formData.password) newErrors.password = "Le mot de passe est requis.";
    if (formData.password.length < 8) newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    if (!formData.consentement_rgpd) newErrors.consentement_rgpd = "Vous devez accepter la politique de confidentialité.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post("/user/register/", formData);

      // Success - redirect to login
      navigate("/login", { state: { message: "Inscription réussie! Veuillez vous connecter." } });

    } catch (err) {
      console.error(err.response?.data);
      if (err.response?.data) {
        setServerError(
          err.response.data.error ||
          Object.values(err.response.data).flat().join(" ")
        );
      } else {
        setServerError("Échec de l'inscription. Veuillez réessayer.");
      }
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
          {["username", "first_name", "last_name", "email", "password"].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label">
                {field === "first_name" ? "Prénom" :
                 field === "last_name" ? "Nom" :
                 field === "username" ? "Nom d'utilisateur" :
                 field === "email" ? "Email" : "Mot de passe"}
                <span className="text-danger">*</span>
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`form-control ${errors[field] ? "is-invalid" : ""}`}
                placeholder={
                  field === "first_name" ? "Entrez votre prénom" :
                  field === "last_name" ? "Entrez votre nom" :
                  field === "username" ? "Entrez votre nom d'utilisateur" :
                  field === "email" ? "exemple@email.com" :
                  "Entrez votre mot de passe"
                }
                disabled={loading}
              />
              {errors[field] && <div className="text-danger">{errors[field]}</div>}
            </div>
          ))}

          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="consentement_rgpd"
              checked={formData.consentement_rgpd}
              onChange={handleChange}
              className={`form-check-input ${errors.consentement_rgpd ? "is-invalid" : ""}`}
              disabled={loading}
              id="consentement"
            />
            <label className="form-check-label" htmlFor="consentement">
              J'accepte les CGU et la{" "}
              <a href="/privacy_policy" target="_blank" rel="noopener noreferrer">
                politique de confidentialité
              </a>
              <span className="text-danger">*</span>
            </label>
            {errors.consentement_rgpd && <div className="text-danger">{errors.consentement_rgpd}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-lg shadow w-100"
            style={{ backgroundColor: "#7C3AED", color: "white" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Inscription...
              </>
            ) : (
              "S'inscrire"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;