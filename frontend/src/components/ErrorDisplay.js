import React from 'react';

/**
 * Reusable error display component
 * Shows error messages with Bootstrap alert styling
 */

function ErrorDisplay({ error, type = "danger", onClose }) {
  // Don't show anything if no error
  if (!error) return null;

  return (
    <div className={`alert alert-${type} d-flex justify-content-between align-items-center`}>
      <span>{error}</span>
      {/* Close button if onClose function is provided */}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
}

export default ErrorDisplay;