import React from 'react';
import { FaUserMd, FaStethoscope, FaIdCard } from 'react-icons/fa';

const DoctorCard = ({ doctor, onSelect }) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100 hover-scale overflow-hidden">
                <div className={`card-header text-white text-center py-3 ${doctor.isAvailable ? 'bg-primary' : 'bg-secondary'}`}>
                    <FaUserMd size={40} />
                </div>
                <div className="card-body text-center">
                    <h5 className="card-title fw-bold mb-1">{doctor.fullName}</h5>
                    <p className="text-primary mb-2 d-flex justify-content-center align-items-center">
                        <FaStethoscope className="me-1"/> {doctor.specialty}
                    </p>
                    <small className="text-muted d-block mb-3">
                        <FaIdCard className="me-1"/> {doctor.cmp}
                    </small>

                    <div className="mb-3">
                        {doctor.isAvailable ? (
                            <span className="badge bg-success px-3 py-2 rounded-pill">🟢 Agenda Abierta</span>
                        ) : (
                            <span className="badge bg-danger px-3 py-2 rounded-pill">🔴 No Disponible</span>
                        )}
                    </div>

                    <button 
                        className={`btn w-100 fw-bold py-2 ${doctor.isAvailable ? 'btn-outline-primary' : 'btn-secondary disabled'}`} 
                        disabled={!doctor.isAvailable}
                        onClick={() => onSelect(doctor)}
                    >
                        {doctor.isAvailable ? 'Reservar Cita' : 'Ocupado'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;