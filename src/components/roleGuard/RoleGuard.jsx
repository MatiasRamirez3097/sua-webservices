import { useSelector } from "react-redux";

const RoleGuard = ({ allowedRoles, requiredPermission, children }) => {
    const { user } = useSelector((store) => store.auth);

    if (!user || !user.role) return null;

    if (user.role === "admin") return children;

    if (requiredPermission) {
        return user.permissions?.includes(requiredPermission) ? children : null;
    }

    if (allowedRoles) {
        return allowedRoles.includes(user.role) ? children : null;
    }

    return null;
};

export default RoleGuard;
