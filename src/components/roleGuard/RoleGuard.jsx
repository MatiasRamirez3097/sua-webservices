import { useSelector } from "react-redux";

/**
 * @param {Array} allowedRoles - Lista de roles permitidos ej: ['admin', 'gestor']
 * @param {ReactNode} children - El componente a mostrar si tiene permiso
 */
const RoleGuard = ({ allowedRoles, children }) => {
    const { user } = useSelector((store) => store.usersReducer);

    // 1. Si no hay usuario, no mostramos nada
    if (!user || !user.role) return null;

    // 2. Si el rol del usuario está en la lista permitida, mostramos el contenido
    if (allowedRoles.includes(user.role)) {
        return children;
    }

    // 3. Si no tiene permiso, no renderizamos nada (invisible)
    return null;
};

export default RoleGuard;
