import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useSelector((store) => store.usersReducer);

    // Si no está logueado, al login
    if (!user || !Object.keys(user).length) {
        return <Navigate to="/" replace />;
    }

    // Si tiene el rol correcto, dejamos pasar (Outlet renderiza la hija)
    if (allowedRoles.includes(user.role)) {
        return <Outlet />;
    }

    // Si no tiene permiso, lo mandamos al inicio o a una página 403
    return <Navigate to="/" replace />; // O a una pagina de "Sin Permisos"
};

export default ProtectedRoute;
