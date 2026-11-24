// Roles, permisos y navegación del lado del front.
// La fuente de verdad es el backend (src/utils/roles.js): acá solo se usan los
// permisos efectivos que devuelve con el usuario, para mostrar u ocultar cosas.

export const PERM = {
    LOTES_VER: "lotes.ver",
    LOTES_CREAR: "lotes.crear",
    LOTES_GESTIONAR_PROPIOS: "lotes.gestionar_propios",
    LOTES_GESTIONAR_TODOS: "lotes.gestionar_todos",
    RODADOS_SOLICITAR: "rodados.solicitar",
    RODADOS_VER_AREA: "rodados.ver_area",
    RODADOS_VER_TODO: "rodados.ver_todo",
    RODADOS_ASIGNAR: "rodados.asignar",
    RODADOS_FLOTA: "rodados.flota",
    USUARIOS_ADMINISTRAR: "usuarios.administrar",
};

export const SUA_ROLES = [
    { value: "consulta", label: "Consulta", description: "Ve los lotes, sus resultados y descarga los errores." },
    { value: "operador", label: "Operador", description: "Además carga lotes y cancela o reprograma los suyos." },
    { value: "supervisor", label: "Supervisor", description: "Además gestiona y elimina los lotes de cualquiera." },
];

export const RODADOS_ROLES = [
    { value: "solicitante", label: "Solicitante", description: "Pide vehículos y ve las solicitudes de su área." },
    { value: "encargado", label: "Encargado de vehículos", description: "Ve todas las solicitudes, asigna vehículos y administra la flota." },
];

export const roleLabel = (roles, value) => roles.find((r) => r.value === value)?.label ?? null;

export const AREAS = [
    "Arbolado",
    "Espacios Verdes",
    "Control de Vectores",
    "Escuela de jardineria",
    "Vivero",
    "Taller",
    "Despacho",
    "Paisajismo",
    "Inspeccion",
    "Centralizacion",
    "Procesamiento de datos",
    "Departamento Tecnico",
    "Centro de Informatica",
    "Direccion administrativa",
    "Direccion General",
    "Subdireccion General",
];

/** ¿El usuario tiene alguno de estos permisos? */
export const can = (user, ...perms) => perms.some((p) => user?.permissions?.includes(p));

/** ¿Puede cancelar / reprogramar este lote? */
export const canManageBatch = (user, batch) =>
    can(user, PERM.LOTES_GESTIONAR_TODOS) ||
    (can(user, PERM.LOTES_GESTIONAR_PROPIOS) && String(batch?.user?._id ?? batch?.user) === user?.id);

export const NAV_ITEMS = [
    { to: "/home", label: "Inicio" },
    { to: "/gestionsua", label: "Gestión SUA", perms: [PERM.LOTES_CREAR] },
    { to: "/estadocargas", label: "Estado de cargas", perms: [PERM.LOTES_VER] },
    { to: "/rodados", label: "Rodados", perms: [PERM.RODADOS_SOLICITAR, PERM.RODADOS_VER_TODO] },
    { to: "/usuarios", label: "Usuarios", perms: [PERM.USUARIOS_ADMINISTRAR] },
];

export const canSee = (user, item) => !item.perms || can(user, ...item.perms);
