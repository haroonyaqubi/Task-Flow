import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        setServerError("");
        if (!validate()) return;

        try {
            // Step 1: Login
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username: formData.username,
                password: formData.password,
            });


            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);



            // Step 2: Fetch user info with access token
            const meResponse = await axios.get("http://127.0.0.1:8000/api/user/me/", {
                headers: { Authorization: `Bearer ${response.data.access}` },
            });

            const { is_staff } = meResponse.data;

            // Step 3: Redirect based on role
            if (is_staff) {
                navigate("/admin-taches");
            } else {
                navigate("/taches");
            }
        } catch (err) {
            console.error(err);
            setServerError("Nom d’utilisateur ou mot de passe invalide.");
        }
    };

    const renderLabel = (text) => (
        <>
            {text} <span className="text-danger">*</span>
        </>
    );

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card shadow p-4 m-5 bg-light" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Connexion</h3>

                {serverError && <div className="alert alert-danger">{serverError}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            {renderLabel("Nom d’utilisateur")}
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.username ? "is-invalid" : ""}`}
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Entrez votre nom d’utilisateur"
                        />
                        {errors.username && <div className="text-danger">{errors.username}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            {renderLabel("Mot de passe")}
                        </label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Entrez votre mot de passe"
                        />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>

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
