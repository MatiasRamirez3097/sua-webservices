import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CountUp, Page, Status } from "../../components/ui/ui";
import { rise } from "../../components/ui/styles";
import { PERM, can, canSee } from "../../utils/access";
import { getBatches } from "../../redux/slices/sua/batchSlice.js";
import { TYPE_LABELS, batchStatus, formatDateTime } from "../../utils/batchFormat";

// Íconos de línea (trazo 1.75, estilo Lucide)
const ICONS = {
    gestionsua: (
        <>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5M12 18v-6M9 15l3-3 3 3" />
        </>
    ),
    estadocargas: <path d="M3 12h4l3-8 4 16 3-8h4" />,
    rodados: (
        <>
            <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
            <circle cx="7" cy="17.5" r="1.8" />
            <circle cx="17" cy="17.5" r="1.8" />
        </>
    ),
    usuarios: (
        <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14a6 6 0 0 1 3 6" />
        </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

const Icon = ({ name, size = 20 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {ICONS[name]}
    </svg>
);

const MODULES = [
    {
        to: "/gestionsua",
        perms: [PERM.LOTES_CREAR],
        icon: "gestionsua",
        title: "Gestión SUA",
        text: "Agendar resoluciones o derivaciones masivas desde un CSV.",
    },
    {
        to: "/estadocargas",
        perms: [PERM.LOTES_VER],
        icon: "estadocargas",
        title: "Estado de cargas",
        text: "Seguir los lotes, ver resultados y descargar errores.",
    },
    {
        to: "/rodados",
        perms: [PERM.RODADOS_SOLICITAR, PERM.RODADOS_VER_TODO],
        icon: "rodados",
        title: "Rodados",
        text: "Vehículos, conductores y propietarios.",
    },
    {
        to: "/usuarios",
        perms: [PERM.USUARIOS_ADMINISTRAR],
        icon: "usuarios",
        title: "Usuarios",
        text: "Altas, permisos y blanqueo de contraseñas.",
    },
];

// ─── Indicadores del encabezado ───────────────────────────────────────────────
const StatTile = ({ label, value, dot, i, to, children }) => (
    <Link
        to={to}
        {...rise(
            i,
            "group block rounded-lg border border-white/10 bg-white/[0.04] px-5 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.08]",
        )}
    >
        <span className="flex items-center gap-2 text-sm text-night-muted">
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {label}
        </span>
        <span className="mt-1 block text-2xl font-semibold text-white">{children ?? <CountUp value={value} />}</span>
    </Link>
);

const HeroStats = ({ list }) => {
    const pending = list.filter((b) => b.status === "PENDING");
    const next = [...pending].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile i={1} to="/estadocargas" label="Pendientes" value={pending.length} dot="bg-[#f5b85c]" />
            <StatTile
                i={2}
                to="/estadocargas"
                label="En proceso"
                value={list.filter((b) => b.status === "PROCESSING").length}
                dot="bg-accent-bright"
            />
            <StatTile
                i={3}
                to="/estadocargas"
                label="Con errores"
                value={list.filter((b) => b.status === "COMPLETED" && b.errorsCount > 0).length}
                dot="bg-[#ff8f84]"
            />
            <StatTile i={4} to="/estadocargas" label="Próxima ejecución" dot="bg-[#7fd6a8]">
                <span className="text-base font-medium tabular">
                    {next ? formatDateTime(next.scheduledAt) : <span className="text-night-muted">Nada agendado</span>}
                </span>
            </StatTile>
        </div>
    );
};

// ─── Últimos lotes ────────────────────────────────────────────────────────────
const BAR_COLOR = { ok: "bg-ok", warn: "bg-warn", danger: "bg-danger", accent: "bg-accent", neutral: "bg-line-strong" };

const RecentBatches = ({ list }) => {
    const recent = list.slice(0, 6);
    return (
        <section {...rise(2, "rounded-lg border border-line bg-surface")}>
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <h2 className="text-sm font-semibold text-ink">Últimos lotes</h2>
                <Link to="/estadocargas" className="group inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Ver todos
                    <span className="transition-transform group-hover:translate-x-0.5">
                        <Icon name="arrow" size={14} />
                    </span>
                </Link>
            </div>
            {recent.length === 0 ? (
                <p className="px-5 py-8 text-sm text-muted">Todavía no hay lotes cargados.</p>
            ) : (
                <ul className="divide-y divide-line">
                    {recent.map((b, i) => {
                        const s = batchStatus(b);
                        const pct = b.totalRecords ? Math.round(((b.processed ?? 0) / b.totalRecords) * 100) : 0;
                        const processing = b.status === "PROCESSING";
                        const idle = b.status === "PENDING" || b.status === "CANCELED";
                        return (
                            <li key={b._id} {...rise(i + 3, "px-5 py-4 transition-colors hover:bg-accent-soft/40")}>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                    <span className="w-32 whitespace-nowrap tabular text-muted">
                                        {formatDateTime(b.scheduledAt) ?? "—"}
                                    </span>
                                    <span className="font-medium text-ink">{TYPE_LABELS[b.processType] ?? b.processType}</span>
                                    <span className="tabular text-muted">
                                        {b.totalRecords} {b.totalRecords === 1 ? "solicitud" : "solicitudes"}
                                    </span>
                                    <span className="ml-auto">
                                        <Status tone={processing ? "accent" : s.tone} live={processing || b.status === "PENDING"}>
                                            {processing ? `Procesando ${pct}%` : s.label}
                                        </Status>
                                    </span>
                                </div>
                                <div className="mt-2 h-1 overflow-hidden rounded-full bg-subtle">
                                    <div
                                        className={`h-full rounded-full transition-[width] duration-700 ease-out ${BAR_COLOR[processing ? "accent" : s.tone]} ${processing ? "bar-shimmer" : ""}`}
                                        style={{ width: `${idle ? 0 : pct}%` }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};

const today = () => {
    const t = new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
    return t.charAt(0).toUpperCase() + t.slice(1);
};

const SectionTitle = ({ i, children }) => (
    <h2 {...rise(i, "mb-4 text-xs font-medium uppercase tracking-[0.1em] text-muted")}>{children}</h2>
);

const Home = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { list } = useSelector((s) => s.batches);
    const modules = MODULES.filter((m) => canSee(user, m));
    const showBatches = can(user, PERM.LOTES_VER);

    useEffect(() => {
        if (!showBatches) return;
        dispatch(getBatches());
        const id = setInterval(() => dispatch(getBatches()), 30000);
        return () => clearInterval(id);
    }, [dispatch, showBatches]);

    return (
        <Page
            title={`${user?.name ?? ""} ${user?.surname ?? ""}`.trim() || "Inicio"}
            description={today()}
            hero={showBatches ? <HeroStats list={list} /> : null}
        >
            {modules.length === 0 ? (
                <p className="rounded-lg border border-line bg-surface px-4 py-6 text-sm text-muted">
                    Tu usuario todavía no tiene módulos asignados. Pedile acceso a un administrador.
                </p>
            ) : (
                <div className={showBatches ? "grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" : ""}>
                    <section>
                        <SectionTitle i={0}>Accesos</SectionTitle>
                        <ul className={showBatches ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
                            {modules.map((m, i) => (
                                <li key={m.to} {...rise(i + 1)}>
                                    <Link
                                        to={m.to}
                                        className="card-lift group flex items-center gap-4 rounded-lg border border-line bg-surface px-5 py-4 hover:border-accent-line"
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                                            <Icon name={m.icon} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-ink">{m.title}</span>
                                            <span className="mt-0.5 block text-sm leading-snug text-muted">{m.text}</span>
                                        </span>
                                        <span className="text-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent">
                                            <Icon name="arrow" size={16} />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {showBatches && (
                        <div>
                            <SectionTitle i={1}>Actividad</SectionTitle>
                            <RecentBatches list={list} />
                        </div>
                    )}
                </div>
            )}
        </Page>
    );
};

export default Home;
