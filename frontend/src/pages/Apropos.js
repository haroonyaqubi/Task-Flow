import React from "react";
import { Link } from "react-router-dom";

function Apropos() {
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center my-5">
            <h1 className="mb-5 text-center fw-bold">À propos</h1>

            {/* Notre histoire */}
            <div
                className="card bg-light text-dark mb-4 shadow rounded-3 p-4"
                style={{ maxWidth: "700px" }}
            >
                <div className="card-body">
                    <h3 className="card-title fw-semibold mb-3">Notre histoire</h3>
                    <p className="card-text">
                        Task Flow a commencé comme une idée simple : créer un outil
                        intuitif et facile à utiliser pour garder toutes vos tâches en un
                        seul endroit et vous aider à suivre vos progrès. Depuis, nous avons
                        grandi en une communauté d’utilisateurs qui apprécient la clarté, la
                        simplicité et l’efficacité.
                    </p>
                </div>
            </div>

            {/* Nos valeurs */}
            <div
                className="card bg-light text-dark mb-4 shadow rounded-3 p-4"
                style={{ maxWidth: "700px" }}
            >
                <div className="card-body">
                    <h3 className="card-title fw-semibold mb-3">Nos valeurs</h3>
                    <ul className="card-text">
                        <li>
                            <strong>Conception centrée sur l’utilisateur :</strong> Nos
                            fonctionnalités sont pensées pour répondre à vos besoins
                            quotidiens.
                        </li>
                        <li>
                            <strong>Fiabilité :</strong> Vos tâches sont en sécurité et
                            accessibles à tout moment, partout.
                        </li>
                        <li>
                            <strong>Amélioration continue :</strong> Nous écoutons vos retours
                            et faisons évoluer l’application constamment.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Rejoignez-nous */}
            <div
                className="card bg-light text-dark mb-4 shadow rounded-3 p-4 text-center"
                style={{ maxWidth: "700px" }}
            >
                <div className="card-body">
                    <h3 className="card-title fw-semibold mb-3">Rejoignez-nous</h3>
                    <p className="card-text">
                        Prêt à prendre le contrôle de votre liste de tâches ? Rejoignez des
                        centaines d’utilisateurs qui font confiance à Complice Tâches pour
                        rester organisés et atteindre leurs objectifs chaque jour.
                    </p>

                    <Link
                        to="/register"
                        className="btn mt-3 shadow fw-bold px-4 py-2"
                        style={{ backgroundColor: "#7C3AED", color: "white" }}
                    >
                        Créer un compte
                    </Link>



                </div>
            </div>
        </div>
    );
}

export default Apropos;
