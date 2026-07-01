# Proyecto Plataforma de Eventos LAVA

Es una API que permite gestionar la funcionalidad de una plataforma de eventos sociales.

- Gestión de usuarios
- Gestión de categorías
- Gestión de eventos
- Gestión de inscripciones

Existen 3 tipos de roles de usuarios:

- Admin: El administrador tendrá permisos generales sobre el sistema.

Podrá gestionar usuarios, categorías, eventos e inscripciones.

- Organizer: El organizador será quien crea y administra eventos.

Según el evento, puede representar a una productora, institución u organización.

- User: El usuario común podrá consultar eventos e inscribirse o reservar tickets.

Puede representar a un asistente al evento.

## Tecnologías y librerías

El API utiliza las siguientes tecnologías:

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JavaScript
- npm
- dotenv
- bcrypt
- JWT
- Passport (permite a futuro incluir proveedores externos como gmail, github y otros)
- cookie-parser
- Nodemailer

## Requisitos previos

- Node.js 24 o superior.
- npm 11 o superior.
- Git.
- Una instancia de MongoDB.

## Instalación y configuración

Para instalar el proyecto se deben seguir los siguientes pasos:

1. Crear una carpeta donde se almacenará el proyecto. Por ejemplo:

```text
D:\plataforma-eventos
```

2. Abrir una terminal, ubicarse en la carpeta recien creada y ejecutar:

```bash
git clone https://github.com/javier-dianderas/backend-nodejs-2.git
```

3. Ingresar a la carpeta del proyecto:

```bash
cd backend-nodejs-2
```

3. Abrir el proyecto con Visual Studio Code:

```bash
code .
```

4. Copiar el archivo `.env.example` y renombrar el archivo copiado a `.env`.

5. Editar el archivo env. y configurar las variables de entorno:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb+srv://usuario:password@cluster...
JWT_SECRET=clave_super_secreta
```

Donde:

- PORT: Colocar el puerto donde se levanta el servicio.
- NODE_ENV: Colocar un valor que represente el ambiente con el que se va a trabajar. Puede tener algunos de los 3 valores: development|test|production.
- MONGO_URL: Colocar la cadena de conexión de la instancia de Mongodb.
- JWT_SECRET: Colocar la palabra secreta para firmar el JWT.

6. Instalar las dependencias del proyecto:

```bash
npm install
```

7. Iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```
