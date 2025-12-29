import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container mt-5">
                    <div className="card border-danger">
                        <div className="card-header bg-danger text-white">
                            <h4 className="mb-0">Une erreur est survenue</h4>
                        </div>
                        <div className="card-body">
                            <p className="card-text">
                                Désolé, quelque chose s'est mal passé. L'erreur a été enregistrée.
                            </p>
                            <div className="alert alert-light">
                                <small>
                                    <strong>Erreur :</strong> {this.state.error && this.state.error.toString()}
                                </small>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={this.handleReset}
                                >
                                    Recharger la page
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => window.location.href = '/'}
                                >
                                    Retour à l'accueil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;