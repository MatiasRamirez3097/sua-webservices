import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, updateUser, createUser, deleteUser } from "../../redux/slices/auth/userSlice";
import { Input, Select, Table, PasswordFormModal, PasswordInput, PasswordRequirements } from "../../components";
import { Button, CountUp, Dialog, Field, Notice, Page } from "../../components/ui/ui";
import { isPasswordValid } from "../../utils/passwordPolicy";
import { sweetAlert } from "../../components/alerts/SweetAlert";
import { AREAS, RODADOS_ROLES, SUA_ROLES, roleLabel } from "../../utils/access";

const EMPTY_FORM = {
    name: "",
    surname: "",
    email: "",
    password: "",
    area: "",
    isAdmin: false,
    suaRole: "",
    rodadosRole: "",
};

const errorText = (payload, fallback) => (typeof payload === "string" ? payload : fallback);

const roleOptions = (roles) => [{ value: "", text: "Sin acceso" }, ...roles.map((r) => ({ value: r.value, text: r.label }))];

/** Selector del rol en un sistema, con la descripción de lo que permite. */
const RoleField = ({ id, label, roles, value, onChange }) => (
    <div className="grid gap-x-4 gap-y-1.5 px-3 py-3 sm:grid-cols-[8rem_1fr] sm:items-center">
        <label htmlFor={id} className="text-sm font-medium text-ink">
            {label}
        </label>
        <Select id={id} value={value} onChange={onChange} options={roleOptions(roles)} />
        <p className="text-xs text-muted sm:col-start-2">
            {roles.find((r) => r.value === value)?.description ?? "No ve este sistema."}
        </p>
    </div>
);

/** Resumen de accesos para la tabla (null = sin acceso). */
const accessSummary = (u) => {
    if (u.isAdmin) return "Acceso total";
    const parts = [
        u.suaRole && `SUA: ${roleLabel(SUA_ROLES, u.suaRole)}`,
        u.rodadosRole && `Rodados: ${roleLabel(RODADOS_ROLES, u.rodadosRole)}`,
    ].filter(Boolean);
    return parts.length ? parts.join(" · ") : null;
};

const UserFormDialog = ({ initial, editingId, onClose, onSaved }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState(initial);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const editMode = !!editingId;
    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.name.trim() || !form.surname.trim() || !form.email.trim())
            return setError("Nombre, apellido y email son obligatorios.");
        if (!editMode && !isPasswordValid(form.password))
            return setError("La contraseña no cumple los requisitos.");
        if (!form.isAdmin && form.rodadosRole === "solicitante" && !form.area)
            return setError("Para ser solicitante de Rodados el usuario tiene que tener un área.");

        setSaving(true);
        const data = {
            name: form.name.trim(),
            surname: form.surname.trim(),
            email: form.email.trim(),
            area: form.area || null,
            isAdmin: form.isAdmin,
            suaRole: form.isAdmin ? null : form.suaRole || null,
            rodadosRole: form.isAdmin ? null : form.rodadosRole || null,
        };
        const res = await dispatch(
            editMode ? updateUser({ id: editingId, data }) : createUser({ ...data, password: form.password }),
        );
        setSaving(false);
        if (res.meta.requestStatus !== "fulfilled")
            return setError(errorText(res.payload, "No se pudo guardar el usuario."));
        onSaved(editMode ? "Usuario actualizado" : "Usuario creado");
    };

    return (
        <Dialog
            as="form"
            onSubmit={handleSubmit}
            width="max-w-xl"
            title={editMode ? "Editar usuario" : "Nuevo usuario"}
            onClose={onClose}
            busy={saving}
            footer={
                <>
                    <Button onClick={onClose} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" loading={saving}>
                        {editMode ? "Guardar cambios" : "Crear usuario"}
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nombre" htmlFor="u-name" required>
                        <Input id="u-name" value={form.name} onChange={set("name")} autoComplete="off" />
                    </Field>
                    <Field label="Apellido" htmlFor="u-surname" required>
                        <Input id="u-surname" value={form.surname} onChange={set("surname")} autoComplete="off" />
                    </Field>
                </div>

                <Field label="Email" htmlFor="u-email" required hint="Es el usuario con el que ingresa.">
                    <Input
                        id="u-email"
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="nombre@rosario.gob.ar"
                        autoComplete="off"
                    />
                </Field>

                {!editMode && (
                    <div className="space-y-2">
                        <PasswordInput
                            label="Contraseña inicial"
                            value={form.password}
                            autoComplete="new-password"
                            onChange={set("password")}
                        />
                        <PasswordRequirements password={form.password} />
                    </div>
                )}

                <Field
                    label="Área"
                    htmlFor="u-area"
                    hint="Los solicitantes de Rodados solo ven las solicitudes de su área."
                >
                    <Select
                        id="u-area"
                        value={form.area}
                        onChange={set("area")}
                        options={[{ value: "", text: "Sin área" }, ...AREAS.map((a) => ({ value: a, text: a }))]}
                    />
                </Field>

                <fieldset>
                    <legend className="mb-1.5 text-sm font-medium text-ink">Accesos</legend>
                    <div className="divide-y divide-line rounded-md border border-line">
                        <label className="flex cursor-pointer items-start gap-3 px-3 py-3">
                            <input
                                type="checkbox"
                                checked={form.isAdmin}
                                onChange={(e) => setForm((f) => ({ ...f, isAdmin: e.target.checked }))}
                                className="mt-0.5 h-4 w-4 accent-accent"
                            />
                            <span>
                                <span className="block text-sm font-medium text-ink">Administrador</span>
                                <span className="block text-xs text-muted">
                                    Acceso total a todos los sistemas, incluida esta pantalla.
                                </span>
                            </span>
                        </label>
                        {!form.isAdmin && (
                            <>
                                <RoleField
                                    id="u-sua"
                                    label="Gestión SUA"
                                    roles={SUA_ROLES}
                                    value={form.suaRole}
                                    onChange={set("suaRole")}
                                />
                                <RoleField
                                    id="u-rodados"
                                    label="Rodados"
                                    roles={RODADOS_ROLES}
                                    value={form.rodadosRole}
                                    onChange={set("rodadosRole")}
                                />
                            </>
                        )}
                    </div>
                </fieldset>

                {error && <Notice>{error}</Notice>}
            </div>
        </Dialog>
    );
};

const Usuarios = () => {
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.users);
    const me = useSelector((state) => state.auth.user);
    const [query, setQuery] = useState("");
    const [editor, setEditor] = useState(null); // { initial, editingId } | null
    const [resetTarget, setResetTarget] = useState(null);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return list;
        return list.filter((u) => `${u.name} ${u.surname} ${u.email}`.toLowerCase().includes(q));
    }, [list, query]);

    const openEdit = (user) =>
        setEditor({
            editingId: user._id,
            initial: {
                ...EMPTY_FORM,
                name: user.name,
                surname: user.surname,
                email: user.email,
                area: user.area || "",
                isAdmin: !!user.isAdmin,
                suaRole: user.suaRole || "",
                rodadosRole: user.rodadosRole || "",
            },
        });

    const handleDelete = async (user) => {
        const { isConfirmed } = await sweetAlert.fire({
            type: "warning",
            title: `¿Eliminar a ${user.name} ${user.surname}?`,
            message: "No va a poder ingresar más. Sus lotes siguen visibles en Estado de cargas.",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Volver",
            danger: true,
        });
        if (!isConfirmed) return;
        const res = await dispatch(deleteUser(user._id));
        if (res.meta.requestStatus === "fulfilled") {
            sweetAlert.fire({ type: "success", title: "Usuario eliminado" });
            dispatch(getUsers());
        } else {
            sweetAlert.fire({
                type: "error",
                title: "No se pudo eliminar",
                message: errorText(res.payload, "Intentá nuevamente."),
            });
        }
    };

    const handleResetPassword = async ({ password }) => {
        const res = await dispatch(updateUser({ id: resetTarget._id, data: { password } }));
        if (res.meta.requestStatus !== "fulfilled")
            throw new Error(errorText(res.payload, "No se pudo blanquear la contraseña."));
        const name = `${resetTarget.name} ${resetTarget.surname}`;
        setResetTarget(null);
        sweetAlert.fire({
            type: "success",
            title: "Contraseña blanqueada",
            message: `Se cerraron las sesiones abiertas de ${name}.`,
        });
    };

    return (
        <Page
            title="Usuarios"
            description="Accesos y roles por sistema."
            actions={
                <Button variant="primary" onClick={() => setEditor({ initial: EMPTY_FORM, editingId: null })}>
                    Nuevo usuario
                </Button>
            }
            hero={
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                    <div className="relative w-full max-w-sm">
                        <svg
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-night-muted"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="M20 20l-3.5-3.5" />
                        </svg>
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar por nombre o email"
                            aria-label="Buscar usuarios"
                            className="h-9 w-full rounded-md border border-white/15 bg-white/[0.06] pl-9 pr-3 text-sm text-white placeholder:text-night-muted transition-colors focus:border-accent-bright focus:bg-white/10 focus:outline-none"
                        />
                    </div>
                    <dl className="flex gap-8 text-sm">
                        {[
                            ["Usuarios", list.length],
                            ["Administradores", list.filter((u) => u.isAdmin).length],
                            ["Sin acceso", list.filter((u) => !accessSummary(u)).length],
                        ].map(([label, n]) => (
                            <div key={label} className="flex items-baseline gap-2">
                                <dd className="text-lg font-semibold text-white">
                                    <CountUp value={n} />
                                </dd>
                                <dt className="text-night-muted">{label}</dt>
                            </div>
                        ))}
                    </dl>
                </div>
            }
        >
            <Table
                data={filtered}
                empty={query ? "Ningún usuario coincide con la búsqueda." : "No hay usuarios."}
                columns={[
                    {
                        header: "Nombre",
                        render: (u) => (
                            <span className="font-medium">
                                {u.name} {u.surname}
                                {u.email === me?.email && <span className="ml-1.5 font-normal text-faint">(vos)</span>}
                            </span>
                        ),
                    },
                    { header: "Email", render: (u) => <span className="text-muted">{u.email}</span> },
                    { header: "Área", render: (u) => u.area ?? <span className="text-faint">—</span> },
                    {
                        header: "Accesos",
                        className: "whitespace-normal min-w-56",
                        render: (u) => {
                            const text = accessSummary(u);
                            if (!text) return <span className="text-faint">Sin acceso</span>;
                            return (
                                <span className={u.isAdmin ? "font-medium text-accent" : "text-sm text-muted"}>
                                    {text}
                                </span>
                            );
                        },
                    },
                    {
                        header: <span className="sr-only">Acciones</span>,
                        key: "actions",
                        render: (u) => (
                            <div className="flex justify-end gap-3 text-sm font-medium">
                                <button type="button" className="text-accent hover:underline" onClick={() => openEdit(u)}>
                                    Editar
                                </button>
                                <button type="button" className="text-accent hover:underline" onClick={() => setResetTarget(u)}>
                                    Blanquear
                                </button>
                                {u.email !== me?.email && (
                                    <button type="button" className="text-danger hover:underline" onClick={() => handleDelete(u)}>
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        ),
                    },
                ]}
            />

            {editor && (
                <UserFormDialog
                    initial={editor.initial}
                    editingId={editor.editingId}
                    onClose={() => setEditor(null)}
                    onSaved={(title) => {
                        setEditor(null);
                        dispatch(getUsers());
                        sweetAlert.fire({ type: "success", title });
                    }}
                />
            )}

            {resetTarget && (
                <PasswordFormModal
                    title="Blanquear contraseña"
                    subtitle={`${resetTarget.name} ${resetTarget.surname} · ${resetTarget.email}`}
                    allowGenerate
                    submitText="Blanquear"
                    onSubmit={handleResetPassword}
                    onClose={() => setResetTarget(null)}
                />
            )}
        </Page>
    );
};

export default Usuarios;
