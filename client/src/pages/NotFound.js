import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="error-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div>
        <Link to="/" className="btn mr-2">
          🏠 Back to Home
        </Link>
        <Link to="/dashboard" className="btn btn-outline">
          📊 Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
