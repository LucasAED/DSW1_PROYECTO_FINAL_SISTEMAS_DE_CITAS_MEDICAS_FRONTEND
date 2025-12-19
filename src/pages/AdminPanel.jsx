import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Swal from 'sweetalert2';
import { FaSearch, FaTrash, FaEdit, FaCheck, FaBan, FaCalendarAlt, FaUserMd, FaClipboardList, FaCheckDouble, FaTimesCircle } from 'react-icons/fa';

const AdminPanel = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('');
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/Appointments');
            const data = response.data || [];
            const sortedData = data.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
            setAppointments(sortedData);

            setStats({
                total: data.length,
                pending: data.filter(a => a.status === 'Programada').length,
                completed: data.filter(a => a.status === 'Atendida').length
            });

        } catch (error) {
            console.error("Error:", error);
        }
    };

    const formatDateForTable = (dateString) => {
        if (!dateString) return "-";
        let utcDateString = dateString;
        if (!dateString.endsWith('Z')) utcDateString += 'Z';
        const d = new Date(utcDateString);
        return d.toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const getDateForInput = (dateString) => {
        if (!dateString) return "";
        let utcDateString = dateString;
        if (!dateString.endsWith('Z')) utcDateString += 'Z';
        const d = new Date(utcDateString);
        const offsetMs = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/Appointments/${id}/status`, `"${newStatus}"`, { headers: { 'Content-Type': 'application/json' } });
            fetchData();
            Swal.fire({ title: 'Estado Actualizado', icon: 'success', timer: 1000, showConfirmButton: false });
        } catch (error) { Swal.fire('Error', 'No se pudo actualizar', 'error'); }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Eliminar Registro?', text: "Esta acción es irreversible.", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await api.delete(`/Appointments/${id}`);
                setAppointments(appointments.filter(app => app.id !== id));
                Swal.fire('Eliminado', '', 'success');
            }
        });
    };

    const handleEdit = (app) => {
        const localDateForInput = getDateForInput(app.appointmentDate);
        Swal.fire({
            title: `<h4 class="fw-bold text-primary">Reprogramar Cita</h4>`,
            html: `
                <div class="text-start bg-light p-3 rounded border">
                    <p class="mb-1 small text-uppercase text-muted fw-bold">Paciente</p>
                    <p class="fw-bold mb-3 fs-5">${app.patientName}</p>
                    <p class="mb-1 small text-uppercase text-muted fw-bold">Doctor</p>
                    <p class="mb-0"><i class="fas fa-user-md me-1"></i> ${app.doctor?.fullName || 'No asignado'}</p>
                </div>
                <div class="mt-3 text-start">
                    <label class="form-label fw-bold">Nueva Fecha y Hora (24h):</label>
                    <input type="datetime-local" id="newDate" class="form-control form-control-lg border-primary" value="${localDateForInput}">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar Cambios',
            confirmButtonColor: '#0d6efd',
            preConfirm: () => {
                const val = document.getElementById('newDate').value;
                if (!val) Swal.showValidationMessage('Selecciona una fecha');
                return val;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const payload = new Date(result.value).toISOString();
                    await api.put(`/Appointments/${app.id}`, `"${payload}"`, { headers: { 'Content-Type': 'application/json' } });
                    fetchData();
                    Swal.fire('Éxito', 'Cita reprogramada correctamente', 'success');
                } catch(error) {
                    Swal.fire('Conflicto', error.response?.data || 'Error al reprogramar', 'error');
                }
            }
        });
    };

    const getStatusBadge = (status) => {
        const s = (status || 'Programada').toLowerCase();
        if (s.includes('atendida')) return <span className="badge rounded-pill bg-success px-3"><FaCheckDouble className="me-1"/>Atendida</span>;
        if (s.includes('cancelada')) return <span className="badge rounded-pill bg-danger px-3"><FaTimesCircle className="me-1"/>Cancelada</span>;
        return <span className="badge rounded-pill bg-primary px-3"><FaCalendarAlt className="me-1"/>Programada</span>;
    };

    const filteredApps = appointments.filter(app => 
        (app.patientName && app.patientName.toLowerCase().includes(filter.toLowerCase())) ||
        (app.patientDNI && app.patientDNI.includes(filter))
    );

    return (
        <div className="container mt-4 fade-in pb-5">
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-primary text-white h-100 rounded-4">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-white-50 text-uppercase mb-1">Total Citas</h6>
                                <h2 className="mb-0 fw-bold">{stats.total}</h2>
                            </div>
                            <FaClipboardList size={40} className="text-white-50"/>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-white h-100 rounded-4 border-start border-5 border-success">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted text-uppercase mb-1">Completadas</h6>
                                <h2 className="mb-0 fw-bold text-success">{stats.completed}</h2>
                            </div>
                            <FaCheckDouble size={40} className="text-success opacity-50"/>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-white h-100 rounded-4 border-start border-5 border-primary">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted text-uppercase mb-1">Pendientes</h6>
                                <h2 className="mb-0 fw-bold text-primary">{stats.pending}</h2>
                            </div>
                            <FaCalendarAlt size={40} className="text-primary opacity-50"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom-0">
                    <h5 className="fw-bold text-dark mb-0 ms-2">📃 Historial de Citas</h5>
                    <div className="input-group w-25 shadow-sm">
                        <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted"/></span>
                        <input type="text" className="form-control border-start-0 ps-0" placeholder="Buscar..." onChange={(e) => setFilter(e.target.value)}/>
                    </div>
                </div>
                
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-secondary small text-uppercase fw-bold">
                            <tr>
                                <th className="ps-4 py-3">Paciente</th>
                                <th>Doctor Asignado</th>
                                <th>Fecha (24h)</th>
                                <th>Estado</th>
                                <th className="text-end pe-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApps.length > 0 ? filteredApps.map((app) => (
                                <tr key={app.id}>
                                    <td className="ps-4 py-3">
                                        <div className="fw-bold text-dark">{app.patientName}</div>
                                        <div className="small text-muted bg-light border px-2 rounded d-inline-block">{app.patientDNI}</div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-2">
                                                <FaUserMd />
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{app.doctor?.fullName || 'No Asignado'}</div>
                                                <small className="text-muted">{app.doctor?.specialty}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="fw-bold text-dark">
                                        {formatDateForTable(app.appointmentDate)}
                                    </td>
                                    <td>{getStatusBadge(app.status)}</td>
                                    <td className="text-end pe-4">
                                        <div className="btn-group shadow-sm" role="group">
                                            {(!app.status || app.status === 'Programada') && (
                                                <>
                                                    <button className="btn btn-outline-success btn-sm" onClick={() => handleStatusChange(app.id, 'Atendida')} title="Atender">
                                                        <FaCheck />
                                                    </button>
                                                    <button className="btn btn-outline-warning btn-sm" onClick={() => handleEdit(app)} title="Reprogramar">
                                                        <FaEdit />
                                                    </button>
                                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleStatusChange(app.id, 'Cancelada')} title="Cancelar">
                                                        <FaBan />
                                                    </button>
                                                </>
                                            )}
                                            {(app.status === 'Atendida' || app.status === 'Cancelada') && (
                                                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDelete(app.id)} title="Borrar Historial">
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">No se encontraron registros.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;