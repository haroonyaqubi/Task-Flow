import React from 'react';

/**
 * Reusable loading spinner component
 * Can be used anywhere in the app where loading state is shown
 */

function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">{text}</p>
    </div>
  );
}

export default LoadingSpinner;


