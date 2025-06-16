// pages/HomePage.jsx
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Welcome to the Clients Management App</h1>
      <p className="lead mb-4">Manage clients efficiently and with ease.</p>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/clients" className="btn btn-primary">📋 View Clients</Link>
        <Link to="/clients/analytics" className="btn btn-success">➕ Analytics Page</Link>
      </div>
    </div>
  );
}

export default HomePage;
