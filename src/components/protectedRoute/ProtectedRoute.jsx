import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, requiredPermission }) => {
    const { user } = useSelector((store) => store.auth);

    // Sin usuario, al login
    if (!user || !Object.keys(user).length) {
        return <Navigate to="/" replace />;
    }

    // Admin siempre pasa todo ✅
    if (user.role === "admin") {
        return <Outlet />;
    }

    // Si requiere un permiso específico, lo verificamos
    if (requiredPermission) {
        if (user.permissions?.includes(requiredPermission)) {
            return <Outlet />;
        }
        return <Navigate to="/home" replace />;
    }

    // Si requiere un rol específico, lo verificamos
    if (allowedRoles) {
        if (allowedRoles.includes(user.role)) {
            return <Outlet />;
        }
        return <Navigate to="/home" replace />;
    }

    return <Navigate to="/home" replace />;
};

export default ProtectedRoute;
