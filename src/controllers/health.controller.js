export const getHealthCheck = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: "Error al iniciar el Servicio API REST"
        });
    }
}