import React, { useState } from "react";
import axiosInstance from "../axiosInstance";

function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    message: "",
    cgu: false,
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis.";
    if (!formData.email) {
      newErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide.";
    }
    if (!formData.telephone.trim())
      newErrors.telephone = "Le téléphone est requis.";
    if (!formData.message.trim())
      newErrors.message = "Le message est requis.";
    if (!formData.cgu) newErrors.cgu = "Vous devez accepter les CGU.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setServerMessage("");

      const response = await axiosInstance.post("/contact/", {
        name: `${formData.prenom} ${formData.nom}`,
        email: formData.email,
        subject: `Contact from ${formData.prenom} ${formData.nom}`,
        message: `${formData.message}\n\nTéléphone: ${formData.telephone}`,
      });

      setServerMessage(response.data.success || "Message envoyé avec succès !");
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        message: "",
        cgu: false,
      });
      setErrors({});

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setServerMessage("Votre session a expiré. Veuillez vous reconnecter.");
      } else {
        setServerMessage(
          err.response?.data?.error ||
            "Erreur réseau. Veuillez réessayer plus tard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5 mb-5">
      <div
        className="card shadow p-4 bg-light"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <h3 className="text-center mb-3">Contactez-nous</h3>
        <p className="text-center text-muted mb-4">
          Notre équipe est là pour vous aider
        </p>

        {serverMessage && (
          <div
            className={`alert ${
              serverMessage.includes("succès")
                ? "alert-success"
                : "alert-danger"
            }`}
          >
            {serverMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="nom" className="form-label">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                className={`form-control ${errors.nom ? "is-invalid" : ""}`}
                value={formData.nom}
                onChange={handleChange}
                placeholder="Entrez votre nom"
                disabled={loading}
              />
              {errors.nom && <small className="text-danger">{errors.nom}</small>}
            </div>
            <div className="col-md-6">
              <label htmlFor="prenom" className="form-label">
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                className={`form-control ${errors.prenom ? "is-invalid" : ""}`}
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Entrez votre prénom"
                disabled={loading}
              />
              {errors.prenom && (
                <small className="text-danger">{errors.prenom}</small>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              disabled={loading}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="telephone" className="form-label">
              Téléphone
            </label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              className={`form-control ${
                errors.telephone ? "is-invalid" : ""
              }`}
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Votre numéro de téléphone"
              disabled={loading}
            />
            {errors.telephone && (
              <small className="text-danger">{errors.telephone}</small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className={`form-control ${errors.message ? "is-invalid" : ""}`}
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Écrivez votre message..."
              disabled={loading}
            />
            {errors.message && (
              <small className="text-danger">{errors.message}</small>
            )}
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              id="cgu"
              name="cgu"
              className={`form-check-input ${errors.cgu ? "is-invalid" : ""}`}
              checked={formData.cgu}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="cgu" className="form-check-label">
              J'accepte les CGU et la politique de confidentialité
            </label>
            {errors.cgu && (
              <small className="text-danger d-block">{errors.cgu}</small>
            )}
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
                Envoi en cours...
              </>
            ) : (
              "Envoyer"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;