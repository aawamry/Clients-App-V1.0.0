// components/Header.jsx
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-primary text-white py-3 mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <h3 className="m-0">Clients App</h3>
        <nav>
          <Link to="/" className="text-white me-3">Home</Link>
          <Link to="/clients" className="text-white me-3">Clients</Link>
          <Link to="/clients/add" className="text-white">Add</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
