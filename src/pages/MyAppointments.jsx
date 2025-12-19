import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { FaCalendarCheck, FaUser, FaClock } from 'react-icons/fa';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get('/Appointments');
                setAppointments(response.data);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <div className="container mt-5 fade-in">
            <h2 className="mb-4 text-primary fw-bold border-bottom pb-2">📂 Historial de Citas</h2>
            
            {appointments.length === 0 ? (
                <div className="alert alert-info">No tienes citas registradas aún.</div>
            ) : (
                <div className="row">
                    {appointments.map((app) => (
                        <div key={app.id} className="col-md-6 mb-3">
                            <div className="card border-start border-4 border-primary shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="card-title fw-bold text-dark">{app.doctor?.fullName || "Doctor"}</h5>
                                            <h6 className="card-subtitle mb-2 text-muted">{app.doctor?.specialty}</h6>
                                        </div>
                                        <span className="badge bg-info text-dark">Scheduled</span>
                                    </div>
                                    <hr />
                                    <p className="mb-1"><FaUser className="me-2 text-secondary"/> Paciente: <strong>{app.patientName}</strong></p>
                                    <p className="mb-0"><FaClock className="me-2 text-secondary"/> Fecha: {new Date(app.appointmentDate).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAppointments;