import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Swal from 'sweetalert2';
import { FaUserMd, FaSearch, FaCheckCircle, FaTimesCircle, FaClock, FaMoon, FaCalendarAlt, FaStethoscope, FaHospital } from 'react-icons/fa';

const Home = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]); 
    const [filter, setFilter] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const [patientName, setPatientName] = useState('');
    const [patientDNI, setPatientDNI] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');

    useEffect(() => {
        loadData();
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const docs = await api.get('/Doctors');
            const apps = await api.get('/Appointments'); 
            setDoctors(docs.data);
            setAppointments(apps.data);
        } catch (error) { console.error(error); }
    };

    const getDoctorStatus = (doc) => {
        if (!doc.isAvailable) return { status: 'Baja', color: 'danger', text: 'No Disponible', icon: <FaTimesCircle/> };

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        const [startH, startM] = doc.shiftStart.split(':').map(Number);
        const [endH, endM] = doc.shiftEnd.split(':').map(Number);
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        let isWorkingNow = false;
        if (startTotal <= endTotal) {
            isWorkingNow = currentMinutes >= startTotal && currentMinutes < endTotal;
        } else {
            isWorkingNow = currentMinutes >= startTotal || currentMinutes < endTotal;
        }

        if (!isWorkingNow) return { status: 'Out', color: 'secondary', text: 'Fuera de Turno', icon: <FaMoon/> };

        const busyNow = appointments.find(app => 
            app.doctorId === doc.id && 
            app.status !== 'Cancelada' &&
            Math.abs((new Date(app.appointmentDate) - now) / 60000) < 20 
        );

        if (busyNow) return { status: 'Busy', color: 'warning', text: 'Ocupado Ahora', icon: <FaClock/> };

        return { status: 'Ok', color: 'success', text: 'Atendiendo', icon: <FaCheckCircle/> };
    };

    const handleConfirmReserve = async () => {
        if (!patientName || !patientDNI || !appointmentDate) {
            Swal.fire('Campos incompletos', 'Por favor llena todos los datos.', 'warning'); return;
        }
        try {
            const payload = {
                patientName, patientDNI, doctorId: selectedDoctor.id,
                appointmentDate: new Date(appointmentDate).toISOString()
            };
            await api.post('/Appointments', payload);
            
            Swal.fire({
                title: '¡Cita Reservada!',
                text: `Tu cita con el Dr. ${selectedDoctor.fullName.split(' ')[1]} ha sido agendada.`,
                icon: 'success',
                confirmButtonColor: '#0d6efd'
            });
            setSelectedDoctor(null);
            setPatientName(''); setPatientDNI(''); setAppointmentDate('');
            loadData(); 
        } catch (error) {
            Swal.fire('No disponible', error.response?.data || 'Error al reservar', 'error');
        }
    };

    const filteredDoctors = doctors.filter(d => 
        d.fullName.toLowerCase().includes(filter.toLowerCase()) || 
        d.specialty.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="container mt-4 fade-in pb-5">
            <div className="mb-5 p-5 rounded-4 shadow-lg position-relative overflow-hidden" 
                 style={{background: 'linear-gradient(135deg, #0d6efd 0%, #0043a8 100%)'}}>
                
                <div className="position-absolute top-0 start-0 translate-middle rounded-circle bg-white opacity-10" style={{width: '300px', height: '300px'}}></div>
                <div className="position-absolute bottom-0 end-0 translate-middle rounded-circle bg-white opacity-10" style={{width: '200px', height: '200px'}}></div>
                
                <div className="position-relative z-1 text-center">
                    <h1 className="display-4 fw-bold text-white mb-3">Clínica Salud 24/7</h1>
                    <p className="lead text-white opacity-75 mb-4 mx-auto" style={{maxWidth: '650px'}}>
                        Conectamos tu bienestar con los mejores especialistas. Reserva tu cita médica en segundos.
                    </p>

                    <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
                        <span className="badge bg-white bg-opacity-25 border border-light border-opacity-25 rounded-pill px-3 py-2 fw-normal d-flex align-items-center text-white">
                            <FaCheckCircle className="me-2"/>Staff Certificado
                        </span>
                        <span className="badge bg-white bg-opacity-25 border border-light border-opacity-25 rounded-pill px-3 py-2 fw-normal d-flex align-items-center text-white">
                            <FaClock className="me-2"/>Atención Rápida
                        </span>
                        <span className="badge bg-white bg-opacity-25 border border-light border-opacity-25 rounded-pill px-3 py-2 fw-normal d-flex align-items-center text-white">
                            <FaHospital className="me-2"/>Tecnología Moderna
                        </span>
                    </div>

                    <div className="d-flex justify-content-center">
                        <div className="input-group w-50 shadow-lg">
                            <span className="input-group-text bg-white border-0 ps-4 text-primary"><FaSearch/></span>
                            <input 
                                type="text" 
                                className="form-control border-0 py-3 ps-2 text-dark fw-bold" 
                                placeholder="¿Qué especialidad buscas hoy?" 
                                onChange={e => setFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="mt-4 text-white opacity-50 small">
                        <FaClock className="me-1"/> Hora Actual: {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
            </div>

            <h5 className="fw-bold text-dark mb-4 border-start border-5 border-primary ps-3">Especialistas Disponibles</h5>
            
            <div className="row">
                {filteredDoctors.map((doc) => {
                    const status = getDoctorStatus(doc);
                    return (
                        <div className="col-md-4 mb-4" key={doc.id}>
                            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden doctor-card">
                                <div className={`w-100 bg-${status.color}`} style={{height: '6px'}}></div>
                                
                                <div className="card-body text-center p-4">
                                    <div className="mb-3 position-relative d-inline-block">
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto text-white bg-gradient shadow-sm bg-${status.color === 'secondary' ? 'secondary' : 'primary'}`} 
                                             style={{width: '90px', height: '90px', fontSize: '2.5rem'}}>
                                            <FaUserMd />
                                        </div>
                                        <span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill border border-white bg-${status.color} shadow-sm`}>
                                            {status.icon} {status.text}
                                        </span>
                                    </div>

                                    <h5 className="fw-bold text-dark mb-1">{doc.fullName}</h5>
                                    <p className="text-primary fw-medium mb-3 d-flex align-items-center justify-content-center gap-1">
                                        <FaStethoscope className="small"/> {doc.specialty}
                                    </p>
                                    
                                    <div className="bg-light rounded p-2 mb-4 border d-inline-block w-100">
                                        <small className="text-muted text-uppercase fw-bold d-block mb-1" style={{fontSize: '0.7rem'}}>Horario de Atención</small>
                                        <div className="fw-bold text-dark">
                                            <FaClock className="me-1 text-muted"/> 
                                            {doc.shiftStart} - {doc.shiftEnd}
                                        </div>
                                    </div>

                                    {status.status === 'Baja' ? (
                                        <button disabled className="btn btn-light text-muted w-100 rounded-pill fw-bold border">
                                            No Disponible
                                        </button>
                                    ) : (
                                        <button className={`btn w-100 fw-bold rounded-pill py-2 btn-outline-${status.color === 'secondary' ? 'primary' : 'primary'}`} 
                                                onClick={() => setSelectedDoctor(doc)}>
                                            {status.status === 'Out' ? 'Agendar Futuro' : 'Reservar Cita'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {filteredDoctors.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <div className="text-muted fs-1 mb-3"><FaSearch/></div>
                        <h4 className="text-muted">No encontramos doctores con ese nombre</h4>
                        <p className="text-muted">Intenta buscar por otra especialidad.</p>
                    </div>
                )}
            </div>

            {selectedDoctor && (
                <div className="modal-backdrop-custom d-flex align-items-center justify-content-center" style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, backdropFilter: 'blur(5px)'
                }}>
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden fade-in-up" style={{width: '500px', maxWidth: '90%'}}>
                        <div className="card-header bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0 fw-bold">Nueva Cita</h5>
                                <small className="opacity-75">Con: {selectedDoctor.fullName}</small>
                            </div>
                            <button className="btn btn-sm btn-light text-primary rounded-circle shadow-sm" onClick={() => setSelectedDoctor(null)}>
                                <FaTimesCircle size={18}/>
                            </button>
                        </div>
                        
                        <div className="card-body p-4 bg-white">
                            <div className="mb-3">
                                <label className="form-label small text-uppercase text-muted fw-bold">Nombre del Paciente</label>
                                <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="Nombre completo" 
                                    value={patientName} onChange={e => setPatientName(e.target.value)} autoFocus/>
                            </div>
                            <div className="mb-4">
                                <label className="form-label small text-uppercase text-muted fw-bold">DNI / Documento</label>
                                <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="Número de documento" 
                                    value={patientDNI} onChange={e => setPatientDNI(e.target.value)} />
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label small text-uppercase text-muted fw-bold">Fecha y Hora</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaCalendarAlt className="text-primary"/></span>
                                    <input 
                                        type="datetime-local" 
                                        className="form-control form-control-lg bg-light border-0 fw-bold text-dark" 
                                        value={appointmentDate} 
                                        onChange={e => setAppointmentDate(e.target.value)} 
                                    />
                                </div>
                                
                                {appointmentDate && (
                                    <div className="mt-2 p-2 bg-primary bg-opacity-10 border border-primary-subtle rounded text-center">
                                        <small className="text-primary fw-bold">Resumen de Reserva:</small>
                                        <div className="text-dark fs-5 fw-bold">
                                            {new Date(appointmentDate).toLocaleString('es-PE', {
                                                weekday: 'long', day: 'numeric', month: 'long',
                                                hour: '2-digit', minute: '2-digit', hour12: false
                                            })} hrs
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="d-grid gap-2">
                                <button className="btn btn-primary btn-lg fw-bold rounded-pill shadow-sm" onClick={handleConfirmReserve}>
                                    Confirmar Reserva
                                </button>
                                <button className="btn btn-light text-muted fw-bold rounded-pill" onClick={() => setSelectedDoctor(null)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;