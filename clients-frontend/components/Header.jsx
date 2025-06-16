// components/Header.jsx
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-primary text-white py-3 mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <h3 className="m-0">Clients App</h3>
        <nav>
          <Link to="/" className="btn btn-outline-light text-white me-2">Home</Link>
          <Link to="/clients" className="btn btn-outline-light text-white me-2">Clients</Link>
          <Link to="clients/analytics" className="btn btn-outline-light text-white">Analytics</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
