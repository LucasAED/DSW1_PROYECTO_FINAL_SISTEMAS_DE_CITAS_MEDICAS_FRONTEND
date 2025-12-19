import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Swal from 'sweetalert2';
import { FaPlus, FaTrash, FaUserMd, FaEdit, FaTimes, FaClock, FaEnvelope, FaIdCard, FaCircle } from 'react-icons/fa';

const DoctorsManager = () => {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({ 
        id: 0, fullName: '', specialty: '', cmp: '', email: '', isAvailable: true,
        shiftStart: '08:00', shiftEnd: '17:00'
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => { loadDoctors(); }, []);

    const loadDoctors = async () => {
        try {
            const res = await api.get('/Doctors');
            setDoctors(res.data);
        } catch (error) { console.error(error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/Doctors/${formData.id}`, formData);
                Swal.fire('Actualizado', 'Doctor modificado correctamente', 'success');
                setIsEditing(false);
            } else {
                await api.post('/Doctors', formData);
                Swal.fire('Registrado', 'Nuevo doctor agregado al staff', 'success');
            }
            setFormData({ id: 0, fullName: '', specialty: '', cmp: '', email: '', isAvailable: true, shiftStart: '08:00', shiftEnd: '17:00' });
            loadDoctors();
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar', 'error');
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({ 
            title: '¿Dar de baja?', text: "Se eliminará del sistema.", icon: 'warning', 
            showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Sí, eliminar' 
        }).then(async (res) => {
            if (res.isConfirmed) {
                await api.delete(`/Doctors/${id}`); 
                loadDoctors();
                Swal.fire('Eliminado', '', 'success');
            }
        });
    };

    const handleEditClick = (doc) => {
        setFormData(doc);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({ id: 0, fullName: '', specialty: '', cmp: '', email: '', isAvailable: true, shiftStart: '08:00', shiftEnd: '17:00' });
    };

    return (
        <div className="container mt-4 fade-in pb-5">
            <h2 className="fw-bold text-dark mb-4 border-start border-5 border-primary ps-3">Administración de Personal Médico</h2>

            <div className="row">
                <div className="col-lg-4 mb-4">
                    <div className={`card shadow-lg border-0 rounded-4 sticky-top ${isEditing ? 'border-top border-5 border-warning' : 'border-top border-5 border-primary'}`} style={{top: '20px', zIndex: 10}}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4 d-flex justify-content-between align-items-center">
                                {isEditing ? <span><FaEdit className="me-2 text-warning"/>Editar Perfil</span> : <span><FaPlus className="me-2 text-primary"/>Nuevo Ingreso</span>}
                                {isEditing && <button className="btn btn-sm btn-light text-muted rounded-circle" onClick={handleCancelEdit}><FaTimes/></button>}
                            </h5>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="small fw-bold text-muted">Nombre Completo</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><FaUserMd/></span>
                                        <input className="form-control border-start-0 ps-0" placeholder="Ej. Dr. Gregory House" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="small fw-bold text-muted">Especialidad</label>
                                    <input className="form-control" placeholder="Ej. Cardiología" required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="small fw-bold text-muted">CMP</label>
                                        <input className="form-control" placeholder="00000" required value={formData.cmp} onChange={e => setFormData({...formData, cmp: e.target.value})} />
                                    </div>
                                    <div className="col-6">
                                        <label className="small fw-bold text-muted">Correo</label>
                                        <input className="form-control" placeholder="@med.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                    </div>
                                </div>

                                <div className="bg-light p-3 rounded mb-3 border">
                                    <label className="small fw-bold text-primary mb-2 d-block"><FaClock className="me-1"/>Horario de Turno</label>
                                    <div className="d-flex gap-2 align-items-center">
                                        <input type="time" className="form-control text-center fw-bold" value={formData.shiftStart} onChange={e => setFormData({...formData, shiftStart: e.target.value})} />
                                        <span className="text-muted">-</span>
                                        <input type="time" className="form-control text-center fw-bold" value={formData.shiftEnd} onChange={e => setFormData({...formData, shiftEnd: e.target.value})} />
                                    </div>
                                </div>

                                <div className="form-check form-switch mb-4">
                                    <input className="form-check-input" type="checkbox" id="av" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} />
                                    <label className="form-check-label fw-bold" htmlFor="av">
                                        {formData.isAvailable ? <span className="text-success">Estado: Activo</span> : <span className="text-danger">Estado: Inactivo</span>}
                                    </label>
                                </div>

                                <button type="submit" className={`btn w-100 fw-bold py-2 rounded-pill shadow-sm ${isEditing ? 'btn-warning text-dark' : 'btn-primary'}`}>
                                    {isEditing ? 'Guardar Cambios' : 'Registrar Doctor'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="row">
                        {doctors.map(doc => (
                            <div className="col-md-6 mb-4" key={doc.id}>
                                <div className={`card shadow-sm border-0 h-100 rounded-4 overflow-hidden position-relative ${!doc.isAvailable ? 'bg-light' : 'bg-white'}`}>
                                    <div className={`position-absolute top-0 start-0 w-100 h-100 border-start border-5 ${doc.isAvailable ? 'border-success' : 'border-secondary'}`} style={{pointerEvents: 'none'}}></div>
                                    
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center">
                                                <div className={`rounded-circle d-flex align-items-center justify-content-center text-white me-3 shadow-sm ${doc.isAvailable ? 'bg-primary' : 'bg-secondary'}`} style={{width: '50px', height: '50px', fontSize: '1.2rem'}}>
                                                    <FaUserMd />
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-0 text-dark">{doc.fullName}</h6>
                                                    <small className="text-primary fw-bold">{doc.specialty}</small>
                                                </div>
                                            </div>
                                            {doc.isAvailable ? 
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2"><FaCircle size={8} className="me-1"/>Activo</span> : 
                                                <span className="badge bg-secondary rounded-pill px-2">Inactivo</span>
                                            }
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center bg-light rounded p-2 mb-3 border">
                                            <small className="text-muted"><FaIdCard className="me-1"/>{doc.cmp}</small>
                                            <small className="text-dark fw-bold"><FaClock className="me-1 text-primary"/>{doc.shiftStart} - {doc.shiftEnd}</small>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button className="btn btn-outline-warning btn-sm flex-grow-1" onClick={() => handleEditClick(doc)}>
                                                <FaEdit className="me-1"/> Editar
                                            </button>
                                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(doc.id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {doctors.length === 0 && (
                            <div className="col-12 text-center py-5 text-muted">
                                <div className="fs-1 mb-3">👨‍⚕️</div>
                                <h4>No hay personal registrado</h4>
                                <p>Utiliza el formulario de la izquierda para agregar doctores.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorsManager;