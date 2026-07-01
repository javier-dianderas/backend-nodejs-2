import { UserModel } from "../models/user.model.js";
import { createHash } from "../utils/hash.js";

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if(!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Todos los campos son obligatorios"
            });
        }
        
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            return res.status(400).json({
                status: "error",
                message: "El formato del email no es válido"
            });
        }
        
        if (email.length < 8) {
            return res.status(400).json({
                status: "error",
                message: "El email al menos debe tener 8 caracteres"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await UserModel.findOne({ email: normalizedEmail });
        if(userExists) {
            return res.status(409).json({
                status: "error",
                message: "Ya existe un usuario registrado con ese email"
            });
        }

        const hashedPassword = await createHash(password);

        const newUser = await UserModel.create({
            first_name,
            last_name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "user"
        });

        res.status(201).json({
            status: "success",
            message: "Usuario registrado correctamente",
            payload: {
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
}