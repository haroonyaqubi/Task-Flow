import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
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
        if (!formData.consentement_rgpd) newErrors.consentement_rgpd = "Vous devez accepter la politique de confidentialité.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const response = await fetch("http://127.0.0.1:8000/api/user/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const data = await response.json();
                setServerError(data.error || "Échec de l'inscription");
            } else {
                navigate("/login");
            }
        } catch (err) {
            setServerError("Erreur réseau");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card shadow p-4 bg-light mb-5" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-center mb-4">S'inscrire</h3>

                {serverError && <div className="alert alert-danger">{serverError}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Username */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Nom d'utilisateur <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className={`form-control ${errors.username ? "is-invalid" : ""}`}
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <div className="text-danger">{errors.username}</div>}
                    </div>

                    {/* First Name */}
                    <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">
                            Prénom <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
                    </div>

                    {/* Last Name */}
                    <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">
                            Nom <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                        {errors.last_name && <div className="text-danger">{errors.last_name}</div>}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email <span className="text-danger">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Mot de passe <span className="text-danger">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>

                    {/* RGPD */}
                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            id="consentement_rgpd"
                            name="consentement_rgpd"
                            className={`form-check-input ${errors.consentement_rgpd ? "is-invalid" : ""}`}
                            checked={formData.consentement_rgpd}
                            onChange={handleChange}
                        />
                        <label htmlFor="consentement_rgpd" className="form-check-label">
                            J’accepte les CGU et la{" "}
                            <a href="/privacy_policy" target="_blank" rel="noopener noreferrer">
                                politique de confidentialité
                            </a>
                        </label>
                        {errors.consentement_rgpd && <div className="text-danger">{errors.consentement_rgpd}</div>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-lg shadow w-100"
                        style={{ backgroundColor: "#7C3AED", color: "white" }}
                    >
                        S'inscrire
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;



