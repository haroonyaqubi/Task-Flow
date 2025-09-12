import React from 'react';
import { Link } from 'react-router-dom';

function Accueil() {
    return (
        <div className="container mt-5">
            <div className="row">
                {[
                    "/static/images/note1.jpg",
                    "/static/images/note2.jpg",
                    "/static/images/note3.jpg"
                ].map((imgSrc, i) => (
                    <div className="col-lg-4" key={i}>
                        <img
                            src={imgSrc}
                            alt={`Note ${i + 1}`}
                            className="img-fluid rounded shadow"
                        />
                    </div>
                ))}
            </div>

            <div className="row mt-5">
                <div className="col-md-10 offset-md-1 text-center">
                    <p className="h1 text-primary">
                        Rapide et facile à utiliser, à tout moment, n’importe où !
                    </p>
                    <p className="h2 mt-3">Planifie ta meilleure journée !</p>
                    <p className="h5">Gardons une trace de tes tâches en un seul endroit !</p>

                    <Link
                        to="/taches"
                        className="btn btn-lg mt-3 mb-3 shadow text-white"
                        style={{ backgroundColor: '#7C3AED' }}
                    >
                        Commençons
                    </Link>


                </div>
            </div>
        </div>
    );
}

export default Accueil;
