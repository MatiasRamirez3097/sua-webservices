import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Dialog, Notice, Page, Status } from "../../components/ui/ui";
import { rise } from "../../components/ui/styles";
import { PERM, can } from "../../utils/access";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date, n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
};

const isoDay = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
};

const shortDate = (date) => date.toLocaleDateString("es-AR", { day: "numeric", month: "numeric" });

const Arrow = ({ dir }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
        <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
);

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const AREAS = [
    "Arbolado",
    "Espacios Verdes",
    "Control de Vectores",
    "Escuela de jardineria",
    "Vivero",
    "Taller",
    "Despacho",
    "Paisajismo",
    "Inspeccion",
    "Departamento Tecnico",
];

// Menú del módulo (todavía sin pantallas)
const MENU = [
    { title: "Planificación", items: ["Nueva solicitud", "Solicitudes", "Asignación", "Choferes", "Vehículos"] },
    { title: "Agentes", items: ["Vehículos", "Propietarios", "Choferes", "Registro provisorio"] },
    { title: "Horas", items: ["Horas de cupo", "Horas adicionales", "Definir adicionales", "Hojas de ruta"] },
];

// ─── Datos de ejemplo (el módulo todavía no está conectado al backend) ───────
const MOCK_PEDIDOS = [
    { id: "1", area: "Arbolado", fecha: "2026-04-07", horario: "08:00 - 12:00", vehiculo: "Toyota Hilux - ABC123", chofer: "Juan Pérez", estado: "confirmado", observaciones: "Traslado de materiales al vivero" },
    { id: "2", area: "Arbolado", fecha: "2026-04-09", horario: "09:00 - 14:00", vehiculo: null, chofer: null, estado: "pendiente", observaciones: "Poda de árboles zona norte" },
    { id: "3", area: "Espacios Verdes", fecha: "2026-04-08", horario: "07:00 - 11:00", vehiculo: "Ford Transit - XYZ789", chofer: "Carlos López", estado: "confirmado", observaciones: "Mantenimiento plazas" },
    { id: "4", area: "Vivero", fecha: "2026-04-10", horario: "10:00 - 13:00", vehiculo: null, chofer: null, estado: "rechazado", observaciones: "Sin vehículos disponibles" },
    { id: "5", area: "Despacho", fecha: "2026-04-11", horario: "08:00 - 16:00", vehiculo: "Renault Master - DEF456", chofer: "Roberto Silva", estado: "pendiente", observaciones: "Entrega de documentación" },
];

const ESTADOS = {
    confirmado: { label: "Confirmado", tone: "ok" },
    pendiente: { label: "Pendiente", tone: "warn" },
    rechazado: { label: "Rechazado", tone: "danger" },
};

const ModalDetalle = ({ pedidos, area, fecha, onClose, canAssign, canRequest }) => (
    <Dialog
        title={area}
        description={new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
        })}
        onClose={onClose}
        footer={
            <>
                {canRequest && (
                    <Button variant="primary" disabled title="Próximamente">
                        Nuevo pedido
                    </Button>
                )}
                <Button onClick={onClose}>Cerrar</Button>
            </>
        }
    >
        {pedidos.length === 0 ? (
            <p className="py-4 text-sm text-muted">No hay pedidos para este día.</p>
        ) : (
            <ul className="divide-y divide-line">
                {pedidos.map((p) => (
                    <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-ink tabular">{p.horario}</span>
                            <Status tone={ESTADOS[p.estado].tone}>{ESTADOS[p.estado].label}</Status>
                        </div>
                        <dl className="mt-1.5 grid grid-cols-[5rem_1fr] gap-y-0.5 text-sm">
                            {p.vehiculo && (
                                <>
                                    <dt className="text-muted">Vehículo</dt>
                                    <dd className="text-ink">{p.vehiculo}</dd>
                                </>
                            )}
                            {p.chofer && (
                                <>
                                    <dt className="text-muted">Chofer</dt>
                                    <dd className="text-ink">{p.chofer}</dd>
                                </>
                            )}
                        </dl>
                        {p.observaciones && <p className="mt-1.5 text-sm text-muted">{p.observaciones}</p>}
                        {canAssign && p.estado === "pendiente" && (
                            <div className="mt-2 flex gap-2">
                                <Button size="sm" disabled title="Próximamente">
                                    Confirmar
                                </Button>
                                <Button size="sm" variant="danger" disabled title="Próximamente">
                                    Rechazar
                                </Button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        )}
    </Dialog>
);

const Celda = ({ pedidos, onClick, label }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="flex h-14 w-full flex-col items-start gap-0.5 rounded-sm p-1 text-left hover:bg-accent-soft focus-visible:bg-accent-soft"
    >
        {pedidos.slice(0, 2).map((p) => (
            <span
                key={p.id}
                className={`w-full truncate border-l-2 pl-1.5 text-xs tabular text-ink ${
                    { confirmado: "border-ok", pendiente: "border-warn", rechazado: "border-danger" }[p.estado]
                }`}
            >
                {p.horario}
            </span>
        ))}
        {pedidos.length > 2 && <span className="text-xs text-muted">+{pedidos.length - 2} más</span>}
    </button>
);

const Rodados = () => {
    const { user } = useSelector((store) => store.auth);
    const [weekStart, setWeekStart] = useState(getMonday(new Date()));
    const [modalData, setModalData] = useState(null);

    const weekEnd = addDays(weekStart, 6);
    const pedidosDe = (area, dayIndex) => {
        const fecha = isoDay(addDays(weekStart, dayIndex));
        return MOCK_PEDIDOS.filter((p) => p.area === area && p.fecha === fecha);
    };

    // Encargados de vehículos (y admins) ven todas las áreas; el resto, la suya
    const verTodas = can(user, PERM.RODADOS_VER_TODO);
    const areas = verTodas ? AREAS : AREAS.filter((a) => a === user.area);
    const isCurrentWeek = isoDay(weekStart) === isoDay(getMonday(new Date()));

    return (
        <Page
            title="Rodados"
            description="Pedidos de vehículos por área."
            hero={
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="on-dark" onClick={() => setWeekStart(addDays(weekStart, -7))} aria-label="Semana anterior">
                            <Arrow dir="left" />
                        </Button>
                        <Button size="sm" variant="on-dark" onClick={() => setWeekStart(getMonday(new Date()))} disabled={isCurrentWeek}>
                            Hoy
                        </Button>
                        <Button size="sm" variant="on-dark" onClick={() => setWeekStart(addDays(weekStart, 7))} aria-label="Semana siguiente">
                            <Arrow dir="right" />
                        </Button>
                        <span className="ml-2 text-sm font-medium text-white">
                            Semana del {shortDate(weekStart)} al {shortDate(weekEnd)}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-night-muted">
                        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#7fd6a8]" />Confirmado</span>
                        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#f5b85c]" />Pendiente</span>
                        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#ff8f84]" />Rechazado</span>
                    </div>
                </div>
            }
        >

            <Notice tone="warn" className="mb-6">
                Módulo en desarrollo: el calendario muestra datos de ejemplo y las acciones todavía no están disponibles.
            </Notice>

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
                {MENU.map((group, i) => (
                    <div key={group.title} {...rise(i, "rounded-lg border border-line bg-surface px-4 py-3")}>
                        <h2 className="mb-1.5 flex items-center justify-between text-sm font-semibold text-ink">
                            {group.title}
                            <span className="rounded-full bg-subtle px-2 py-px text-xs font-normal text-muted">Próximamente</span>
                        </h2>
                        <ul className="space-y-0.5">
                            {group.items.map((item) => (
                                <li key={item}>
                                    <span className="text-sm text-faint" title="Próximamente">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <section {...rise(3, "overflow-hidden rounded-lg border border-line bg-surface")}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-subtle">
                                <th scope="col" className="w-44 border-b border-line px-3 py-2 text-left text-sm font-medium text-muted">
                                    Área
                                </th>
                                {DAYS.map((day, i) => {
                                    const d = addDays(weekStart, i);
                                    const today = isoDay(d) === isoDay(new Date());
                                    return (
                                        <th
                                            key={day}
                                            scope="col"
                                            className={`min-w-[96px] border-b border-l border-line px-2 py-2 text-left text-sm font-medium ${today ? "text-accent" : "text-muted"}`}
                                        >
                                            {day} <span className="font-normal tabular">{shortDate(d)}</span>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {areas.map((area) => (
                                <tr key={area} className="border-b border-line last:border-b-0">
                                    <th scope="row" className="px-3 py-1 text-left font-normal whitespace-nowrap text-ink">
                                        {area}
                                    </th>
                                    {DAYS.map((day, dayIndex) => (
                                        <td key={day} className="border-l border-line p-0.5 align-top">
                                            <Celda
                                                pedidos={pedidosDe(area, dayIndex)}
                                                label={`${area}, ${day} ${shortDate(addDays(weekStart, dayIndex))}`}
                                                onClick={() =>
                                                    setModalData({
                                                        area,
                                                        fecha: isoDay(addDays(weekStart, dayIndex)),
                                                        pedidos: pedidosDe(area, dayIndex),
                                                    })
                                                }
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {modalData && (
                <ModalDetalle
                    {...modalData}
                    onClose={() => setModalData(null)}
                    canAssign={can(user, PERM.RODADOS_ASIGNAR)}
                    canRequest={can(user, PERM.RODADOS_SOLICITAR)}
                />
            )}
        </Page>
    );
};

export default Rodados;
