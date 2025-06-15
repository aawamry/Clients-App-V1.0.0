// components/Footer.jsx
function Footer() {
  return (
    <footer className="bg-light text-center py-3 mt-auto">
      <div className="container">
        <small className="text-muted">© {new Date().getFullYear()} Clients App. All rights reserved.</small>
      </div>
    </footer>
  );
}

export default Footer;
