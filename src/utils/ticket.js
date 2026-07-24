export const generateTicketCode = () => {
    const randomCode = Math.random().toString(36).substring(2,8).toUpperCase();
    return `TCK-${randomCode}`;
}