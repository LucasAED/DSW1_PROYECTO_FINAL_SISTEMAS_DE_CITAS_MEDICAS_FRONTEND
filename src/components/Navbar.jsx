import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaUserMd, FaTable, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm" style={{ background: 'linear-gradient(90deg, #0062cc 0%, #0096ff 100%)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold text-uppercase" to="/">
          <FaHeartbeat className="me-2" size={28} />
          Clínica Salud 24/7
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-3">
            <li className="nav-item">
              <Link className="nav-link text-white d-flex align-items-center fw-bold" to="/">
                <FaUserMd className="me-1"/> Reservas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white d-flex align-items-center fw-bold" to="/admin">
                <FaTable className="me-1"/> Citas Agendadas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white d-flex align-items-center fw-bold" to="/doctors">
                <FaUserPlus className="me-1"/> Gestión Doctores
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;