import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ module, allowedRoles, adminOnly }) => {
    const { user } = useSelector((store) => store.auth);

    if (!user || !Object.keys(user).length) {
        return <Navigate to="/" replace />;
    }

    // admin pasa todo
    if (user.role === "admin") return <Outlet />;

    // Solo admin puede acceder (ej: /usuarios)
    if (adminOnly) return <Navigate to="/home" replace />;

    // Verificar por módulo
    if (module) {
        const perm = user.permissions?.find((p) => p.module === module);
        if (!perm) return <Navigate to="/home" replace />;

        if (allowedRoles && !allowedRoles.includes(perm.role)) {
            return <Navigate to="/home" replace />;
        }

        return <Outlet />;
    }

    return <Navigate to="/home" replace />;
};

export default ProtectedRoute;
