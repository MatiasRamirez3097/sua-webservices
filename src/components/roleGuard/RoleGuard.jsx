import { useSelector } from "react-redux";

const RoleGuard = ({ module, allowedRoles, children }) => {
    const { user } = useSelector((store) => store.auth);

    if (!user) return null;

    if (user.role === "admin") return children;

    //  Si se pasa un module, busca el permiso correspondiente
    if (module) {
        const perm = user.permissions?.find((p) => p.module === module);
        if (!perm) return null;

        // Si no se especifican roles permitidos, con tener el permiso alcanza
        if (!allowedRoles) return children;

        return allowedRoles.includes(perm.role) ? children : null;
    }

    return null;
};

export default RoleGuard;
