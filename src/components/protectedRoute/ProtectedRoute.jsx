import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { can } from "../../utils/access";

/** Deja pasar si el usuario tiene alguno de los permisos indicados. */
const ProtectedRoute = ({ perms = [] }) => {
    const { user } = useSelector((store) => store.auth);

    if (!user || !Object.keys(user).length) return <Navigate to="/" replace />;
    if (perms.length && !can(user, ...perms)) return <Navigate to="/home" replace />;
    return <Outlet />;
};

export default ProtectedRoute;
