import { transporter } from "../config/mailer.config.js";

export const sendTicketConfirmationEmail = async ({ to, userName, eventTitle, ticketCode }) => {
        
    const info = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: "Configuración de reserva de ticket",
        html: `
            <h1>Reserva confirmada</h1>
            <p>Hola ${userName}, tu inscripción al evento ${eventTitle} fue confirmada.</p>
            <p>Código de reserva: <strong>${ticketCode}</strong></p>
        `
    });
    console.log("Correo enviado:", info);
}

export const sendTicketCancellationEmail = async ({ to, userName, eventTitle, ticketCode }) => {
    const info = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: "Cancelación de reserva de ticket",
        html: `
            <h1>Inscripción cancelada</h1>
            <p>Hola ${userName}, tu inscripción al evento ${eventTitle} fue cancelada.</p>
            <p>Código de reserva: <strong>${ticketCode}</strong></p>
        `
    });
    console.log("Correo enviado:", info);
}