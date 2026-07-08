export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user) {
            return res.status(401).json({
                status: "error",
                message: "No autenticado"
            });
        }
        console.log("allowedRoles",allowedRoles);
        console.log("req.user.role",req.user.role);
        if(!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: "error",
                message: "No tienes permisos para realizar esta acción"
            });
        }
        next();
    }
}