import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        // Track if there's an error and store error details
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    // This runs when an error is thrown
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Save error details to state
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // Log error to console for debugging
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
    // Reset the app when user clicks "Reload"
    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload(); // Refresh the page
    }
    render() {
        // If there's an error, show error message

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

        // If no error, render children normally
        return this.props.children;
    }
}
export default ErrorBoundary;
