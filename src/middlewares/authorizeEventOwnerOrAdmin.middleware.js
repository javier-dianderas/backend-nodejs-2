export const authorizeEventOwnerOrAdmin = async (req, res, next) => {
    const { eventId } = req.params;

    const event = await EventModel.findById(eventId);

    if(!event) {
        return res.status(404).json({
            status: "error",
            message: "Evento no encontrado"
        });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = event.organizer.toString() === req.user._id.toString();
    
    if(!isAdmin && !isOwner) {
        res.status(403).json({
            status: "error",
            message: "No tienes permisos para modificar este evento"
        });
    };

    req.event = event;

    next();
}