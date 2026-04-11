import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Div, H2, Button } from "../../components";
import PlanillaIcon from "../../assets/icons/Planilla_icon.svg";
import OperarioIcon from "../../assets/icons/Operario_icon.svg";
import RelojIcon from "../../assets/icons/Reloj_icon.svg";
import CamionIcon from "../../assets/icons/Camion_icon.svg";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

const formatDate = (date) =>
    date.toLocaleDateString("es-AR", { day: "numeric", month: "numeric" });

const getDayDate = (weekStart, dayIndex) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + dayIndex);
    return d.toISOString().split("T")[0];
};

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const AREAS = [
    "Arbolado", "Espacios Verdes", "Control de Vectores",
    "Escuela de jardineria", "Vivero", "Taller", "Despacho",
    "Paisajismo", "Inspeccion", "Departamento Tecnico",
];

// ─── Datos mock ───────────────────────────────────────────────────────────────
const MOCK_PEDIDOS = [
    {
        id: "1", area: "Arbolado", fecha: "2026-04-07",
        horario: "08:00 - 12:00", vehiculo: "Toyota Hilux - ABC123",
        chofer: "Juan Pérez", estado: "confirmado",
        observaciones: "Traslado de materiales al vivero",
    },
    {
        id: "2", area: "Arbolado", fecha: "2026-04-09",
        horario: "09:00 - 14:00", vehiculo: null, chofer: null,
        estado: "pendiente", observaciones: "Poda de árboles zona norte",
    },
    {
        id: "3", area: "Espacios Verdes", fecha: "2026-04-08",
        horario: "07:00 - 11:00", vehiculo: "Ford Transit - XYZ789",
        chofer: "Carlos López", estado: "confirmado",
        observaciones: "Mantenimiento plazas",
    },
    {
        id: "4", area: "Vivero", fecha: "2026-04-10",
        horario: "10:00 - 13:00", vehiculo: null, chofer: null,
        estado: "rechazado", observaciones: "Sin vehículos disponibles",
    },
    {
        id: "5", area: "Despacho", fecha: "2026-04-11",
        horario: "08:00 - 16:00", vehiculo: "Renault Master - DEF456",
        chofer: "Roberto Silva", estado: "pendiente",
        observaciones: "Entrega de documentación",
    },
];

// ─── Badge de estado ──────────────────────────────────────────────────────────
const EstadoBadge = ({ estado }) => {
    const styles = {
        confirmado: "bg-green-900 text-green-300 border border-green-700",
        pendiente: "bg-yellow-900 text-yellow-300 border border-yellow-700",
        rechazado: "bg-red-900 text-red-300 border border-red-700",
    };
    const labels = {
        confirmado: "Confirmado",
        pendiente: "Pendiente",
        rechazado: "Rechazado",
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[estado]}`}>
            {labels[estado]}
        </span>
    );
};

// ─── Modal detalle ────────────────────────────────────────────────────────────
const ModalDetalle = ({ pedidos, area, fecha, onClose, userRole }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl p-6">

                <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-5">
                    <div>
                        <h2 className="text-lg font-semibold text-white">{area}</h2>
                        <p className="text-gray-400 text-sm mt-0.5">
                            {new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", {
                                weekday: "long", day: "numeric", month: "long",
                            })}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {pedidos.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-6">
                            No hay pedidos para este día.
                        </p>
                    ) : (
                        pedidos.map((pedido) => (
                            <div key={pedido.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-white font-medium text-sm">{pedido.horario}</span>
                                    <EstadoBadge estado={pedido.estado} />
                                </div>

                                {pedido.vehiculo && (
                                    <div className="flex gap-2 text-sm text-gray-300 mb-1">
                                        <span className="text-gray-500">Vehículo:</span>
                                        <span>{pedido.vehiculo}</span>
                                    </div>
                                )}

                                {pedido.chofer && (
                                    <div className="flex gap-2 text-sm text-gray-300 mb-1">
                                        <span className="text-gray-500">Chofer:</span>
                                        <span>{pedido.chofer}</span>
                                    </div>
                                )}

                                {pedido.observaciones && (
                                    <div className="mt-2 text-xs text-gray-400 bg-gray-700 rounded-lg px-3 py-2">
                                        {pedido.observaciones}
                                    </div>
                                )}

                                {/* Confirmar/Rechazar solo admin y manager */}
                                {(userRole === "admin" || userRole === "manager") &&
                                    pedido.estado === "pendiente" && (
                                        <div className="flex gap-2 mt-3">
                                            <button className="flex-1 bg-green-700 hover:bg-green-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-all">
                                                Confirmar
                                            </button>
                                            <button className="flex-1 bg-red-700 hover:bg-red-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-all">
                                                Rechazar
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        ))
                    )}
                </div>

                {/* Nuevo pedido solo para operator */}
                {userRole === "operator" && (
                    <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-xl transition-all text-sm">
                        + Nuevo pedido
                    </button>
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-3 border border-gray-600 text-gray-300 hover:bg-gray-700 py-2 rounded-xl transition-all text-sm"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

// ─── Celda del calendario ─────────────────────────────────────────────────────
const CeldaCalendario = ({ pedidos, onClick }) => {
    if (!pedidos.length) {
        return (
            <div
                onClick={onClick}
                className="h-16 rounded-lg border border-dashed border-gray-600 hover:border-indigo-500 hover:bg-gray-700/30 cursor-pointer transition-all flex items-center justify-center"
            >
                <span className="text-gray-600 text-xs">+</span>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="h-16 rounded-lg border border-gray-600 hover:border-indigo-500 cursor-pointer transition-all p-1.5 flex flex-col gap-1 overflow-hidden"
        >
            {pedidos.slice(0, 2).map((p) => (
                <div
                    key={p.id}
                    className={`text-xs px-1.5 py-0.5 rounded font-medium truncate
                        ${p.estado === "confirmado" ? "bg-green-900/60 text-green-300" : ""}
                        ${p.estado === "pendiente" ? "bg-yellow-900/60 text-yellow-300" : ""}
                        ${p.estado === "rechazado" ? "bg-red-900/60 text-red-300" : ""}
                    `}
                >
                    {p.horario}
                </div>
            ))}
            {pedidos.length > 2 && (
                <span className="text-xs text-gray-400">+{pedidos.length - 2} más</span>
            )}
        </div>
    );
};

// ─── Página principal ─────────────────────────────────────────────────────────
const Rodados = () => {
    const { user } = useSelector((store) => store.auth);
    const [weekStart, setWeekStart] = useState(getMonday(new Date()));
    const [openSection, setOpenSection] = useState(null);
    const [modalData, setModalData] = useState(null);

    const toggleSection = (section) =>
        setOpenSection(openSection === section ? null : section);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const previousWeek = () => {
        const prev = new Date(weekStart);
        prev.setDate(weekStart.getDate() - 7);
        setWeekStart(prev);
    };

    const nextWeek = () => {
        const next = new Date(weekStart);
        next.setDate(weekStart.getDate() + 7);
        setWeekStart(next);
    };

    // ✅ Operator ve solo su área, el resto ve todas
    const areas = (user.role === "operator" && user.area)
        ? AREAS.filter((a) => a === user.area)
        : AREAS;

    const getPedidosParaCelda = (area, dayIndex) => {
        const fecha = getDayDate(weekStart, dayIndex);
        return MOCK_PEDIDOS.filter((p) => p.area === area && p.fecha === fecha);
    };

    const handleCeldaClick = (area, dayIndex) => {
        const fecha = getDayDate(weekStart, dayIndex);
        const pedidos = getPedidosParaCelda(area, dayIndex);
        setModalData({ area, fecha, pedidos });
    };

    return (
        <>
            {/* ── BOTONERA ── */}
            <Div className="w-full max-w-4xl mx-auto border border-gray-700 p-6 bg-gray-800 rounded-xl mb-8">
                <div className="flex items-center justify-center gap-3 mb-6 border-b border-gray-700 pb-4">
                    <img src={CamionIcon} alt="Sistema de Rodados" className="w-8 h-8 opacity-90" />
                    <h2 className="text-white text-xl font-semibold tracking-widest uppercase">
                        Sistema de Rodados
                    </h2>
                </div>

                <div className="flex gap-4">
                    {/* PLANIFICACIÓN */}
                    <div className="flex-1">
                        <div
                            onClick={() => toggleSection("planificacion")}
                            className="cursor-pointer py-3 rounded-lg border border-indigo-500 bg-indigo-800 hover:bg-indigo-600 text-white transition-colors"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <img src={PlanillaIcon} alt="Planificación" className="w-10 h-10 opacity-90" />
                                <span className="text-sm font-medium tracking-wide">PLANIFICACIÓN</span>
                            </div>
                        </div>
                        {openSection === "planificacion" && (
                            <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg p-3 flex flex-col gap-2">
                                <Button text="Nueva solicitud" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                                <Button text="Solicitudes" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                                <Button text="Asignación" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                                <Button text="Choferes" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                                <Button text="Vehículos" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                            </div>
                        )}
                    </div>

                    {/* AGENTES */}
                    <div className="flex-1">
                        <div
                            onClick={() => toggleSection("agentes")}
                            className="cursor-pointer py-3 rounded-lg border border-indigo-500 bg-indigo-800 hover:bg-indigo-600 text-white transition-colors"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <img src={OperarioIcon} alt="Agentes" className="w-10 h-10 opacity-90" />
                                <span className="text-sm font-medium tracking-wide">AGENTES</span>
                            </div>
                        </div>
                        {openSection === "agentes" && (
                            <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg p-3 flex flex-col gap-2">
                                <Button text="Agregar Vehículos" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                                <Button text="Agregar Propietarios" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                                <Button text="Agregar Choferes" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                                <Button text="Registrar Provisorio" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                            </div>
                        )}
                    </div>

                    {/* HORAS */}
                    <div className="flex-1">
                        <div
                            onClick={() => toggleSection("horas")}
                            className="cursor-pointer py-3 rounded-lg border border-indigo-500 bg-indigo-800 hover:bg-indigo-600 text-white transition-colors"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <img src={RelojIcon} alt="Horas" className="w-10 h-10 opacity-90" />
                                <span className="text-sm font-medium tracking-wide">HORAS</span>
                            </div>
                        </div>
                        {openSection === "horas" && (
                            <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg p-3 flex flex-col gap-2">
                                <Button text="Horas de cupo" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                                <Button text="Horas adicionales" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                                <Button text="Definir adicionales" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                                <Button text="Hojas de ruta" className="bg-indigo-700 hover:bg-indigo-500 px-2 py-1.5 rounded-md text-white text-xs w-full" />
                            </div>
                        )}
                    </div>
                </div>
            </Div>

            {/* ── CALENDARIO ── */}
            <Div className="border border-gray-700 p-6 bg-gray-800 rounded-xl mb-8">

                <div className="border-b border-gray-700 pb-4 mb-6 relative">
                    <H2 className="text-2xl font-bold text-white tracking-widest uppercase text-center" label="Calendario Semanal" />
                    <p className="text-gray-400 text-sm text-center mt-1">
                        Semana del {formatDate(weekStart)} al {formatDate(weekEnd)}
                    </p>
                    <Button
                        text="← Anterior"
                        onClick={previousWeek}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-xl text-white text-sm"
                    />
                    <Button
                        text="Siguiente →"
                        onClick={nextWeek}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-xl text-white text-sm"
                    />
                </div>

                {/* Leyenda */}
                <div className="flex gap-4 mb-4 justify-end">
                    {[
                        { color: "bg-green-700", label: "Confirmado" },
                        { color: "bg-yellow-700", label: "Pendiente" },
                        { color: "bg-red-700", label: "Rechazado" },
                    ].map(({ color, label }) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <div className={`w-3 h-3 rounded-full ${color}`}></div>
                            <span className="text-xs text-gray-400">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-36 border-b border-gray-700">
                                    Área
                                </th>
                                {DAYS.map((day, i) => (
                                    <th key={day} className="px-2 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700 min-w-[100px]">
                                        <div>{day}</div>
                                        <div className="text-indigo-400 font-normal normal-case">
                                            {formatDate(new Date(weekStart.getTime() + i * 86400000))}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {areas.map((area, areaIndex) => (
                                <tr key={area} className={areaIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}>
                                    <td className="px-3 py-2 text-sm font-medium text-white border-r border-gray-700 whitespace-nowrap">
                                        {area}
                                    </td>
                                    {DAYS.map((_, dayIndex) => (
                                        <td key={dayIndex} className="px-2 py-2 border-x border-gray-700/50">
                                            <CeldaCalendario
                                                pedidos={getPedidosParaCelda(area, dayIndex)}
                                                onClick={() => handleCeldaClick(area, dayIndex)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Div>

            {/* Modal */}
            {modalData && (
                <ModalDetalle
                    pedidos={modalData.pedidos}
                    area={modalData.area}
                    fecha={modalData.fecha}
                    onClose={() => setModalData(null)}
                    userRole={user.role}
                />
            )}
        </>
    );
};

export default Rodados;