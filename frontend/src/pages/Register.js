import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";

function Register() {
  const navigate = useNavigate();

  // Form state
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  // Validate form (French validation messages)
  const validate = () => {
    const newErrors = {};

    // French validation messages
    if (!formData.username.trim()) newErrors.username = "Le nom d'utilisateur est requis.";
    if (!formData.first_name.trim()) newErrors.first_name = "Le prénom est requis.";
    if (!formData.last_name.trim()) newErrors.last_name = "Le nom est requis.";

    if (!formData.email) {
      newErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide.";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (!formData.consentement_rgpd) {
      newErrors.consentement_rgpd = "Vous devez accepter la politique de confidentialité.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      // Send registration data to backend
      const response = await axiosInstance.post("/user/register/", formData);

      // Success - redirect to login page
      navigate("/login", {
        state: {
          message: "Inscription réussie! Veuillez vous connecter."
        }
      });

    } catch (err) {
      console.error(err.response?.data);
      if (err.response?.data) {
        // Show backend error messages
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

        {serverError && (
          <ErrorDisplay
            error={serverError}
            onClose={() => setServerError("")}
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Form fields */}
          {["username", "first_name", "last_name", "email", "password"].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label">
                {/* French field names */}
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

          {/* GDPR consent checkbox */}
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
          {loading ? (
            <LoadingSpinner text="Inscription..." />
          ) : (
            <button
              type="submit"
              className="btn btn-lg shadow w-100"
              style={{ backgroundColor: "#7C3AED", color: "white" }}
              disabled={loading}
            >
              S'inscrire
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;