import React, { useState } from 'react';
import api from '../api/axiosConfig';
import Swal from 'sweetalert2';

const AppointmentModal = ({ doctor, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        patientName: '',
        patientDNI: '',
        appointmentDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                doctorId: doctor.id,
                appointmentDate: new Date(formData.appointmentDate).toISOString() 
            };
            
            await api.post('/Appointments', payload);
            
            Swal.fire({
                title: '¡Cita Confirmada!',
                text: `Has reservado con el Dr. ${doctor.fullName}`,
                icon: 'success',
                confirmButtonColor: '#007bff'
            });

            onSuccess(); 
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agendar la cita.',
                icon: 'error'
            });
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-lg border-0">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Nueva Cita: {doctor.fullName}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" placeholder="Nombre" required 
                                    onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
                                <label>Nombre del Paciente</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" placeholder="DNI" required 
                                    onChange={(e) => setFormData({...formData, patientDNI: e.target.value})} />
                                <label>DNI</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="datetime-local" className="form-control" required 
                                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} />
                                <label>Fecha y Hora</label>
                            </div>
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary fw-bold px-4">Confirmar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;