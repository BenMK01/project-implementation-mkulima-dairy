import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">404 — Page Not Found</h1>
      <p className="mb-6 text-muted-foreground">We couldn't find the page you were looking for.</p>
      <Link to="/">
        <button className="px-4 py-2 bg-primary text-white rounded">Go home</button>
      </Link>
    </div>
  );
};

export default NotFound;