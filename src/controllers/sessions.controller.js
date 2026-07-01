import { UserModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
    
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
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email y contraseña son obligatorios"
        });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: normalizedEmail });
    if(!user) {
        return res.status(401).json({
            status: "error",
            message: "Credenciales inválidas"
        });
    }

    const validPassword = await isValidPassword(password, user.password)
    if(!validPassword) {
        return res.status(401).json({
            status: "error",
            message: "Credenciales inválidas"
        });
    }

    const tokenUser = {
        id: user._id,
        email: user.email,
        role: user.role
    };

    const token = generateToken(tokenUser);

    res.cookie("currentUser", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({
        status: "success",
        message: "Login correcto"
    });
}

export const getCurrentUser = async (req, res) => {
    res.status(200).json({
        status: "success",
        payload: req.user
    });
}

export const logout = async (req, res) => {
    res.clearCookie("currentUser");

    res.status(200).json({
        status: "success",
        message: "Logout correcto"
    });
}