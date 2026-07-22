# Proyecto Plataforma de Eventos LAVA

API REST desarrollada con Node.js y Express para gestionar una plataforma de eventos sociales.

La aplicación permite administrar:

- Gestión de usuarios
- Gestión de categorías
- Gestión de eventos
- Gestión de inscripciones

## Contenido

- Descripción
- Roles y permisos
- Tecnologías y librerías
- Requisitos previos
- Instalación y configuración
- Modelo de eventos
- Endpoints de eventos
- Filtros y paginación
- Reglas de negocio
- Arquitectura
- Códigos de respuesta

---

# Roles y permisos

Existen 3 tipos de roles de usuarios:

## Admin

El administrador tiene control total sobre la plataforma.

Puede gestionar:

- Usuarios
- Categorías
- Eventos
- Inscripciones

## Organizer

Es el usuario encargado de crear y administrar eventos.

Puede representar a una productora, institución u organización.

## User

Es el usuario final de la plataforma.

Puede consultar eventos e inscribirse o reservar entradas.

### Permisos por rol

| Acción                             | User | Organizer | Admin |
| ---------------------------------- | :--: | :-------: | :---: |
| Consultar eventos publicados       |  ✅  |    ✅     |  ✅   |
| Crear eventos                      |  ❌  |    ✅     |  ✅   |
| Modificar/cancelar eventos propios |  ❌  |    ✅     |  ✅   |
| Modificar cualquier evento         |  ❌  |    ❌     |  ✅   |
| Ver todos los usuarios             |  ❌  |    ❌     |  ✅   |

---

## Tecnologías y librerías

El proyecto utiliza las siguientes tecnologías:

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JavaScript (ES Modules)
- npm
- dotenv
- bcrypt
- JSON Web Token (JWT)
- Passport
- cookie-parser
- Nodemailer

## Requisitos previos

- Node.js 24 o superior
- npm 11 o superior
- Git
- Una instancia de MongoDB Atlas o MongoDB local

# Instalación y configuración

## 1. Clonar el repositorio

```bash
git clone https://github.com/javier-dianderas/backend-nodejs-2.git
```

## 2. Ingresar al proyecto

```bash
cd backend-nodejs-2
```

## 3. Abrir el proyecto

```bash
code .
```

## 4. Crear el archivo de configuración

Copiar el archivo:

```
.env.example
```

y renombrarlo como

```
.env
```

## 5. Configurar las variables de entorno

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb+srv://usuario:password@cluster...
JWT_SECRET=clave_super_secreta
```

### Variables

| Variable   | Descripción                                                   |
| ---------- | ------------------------------------------------------------- |
| PORT       | Puerto donde se ejecutará la aplicación.                      |
| NODE_ENV   | Ambiente de ejecución (`development`, `test` o `production`). |
| MONGO_URL  | Cadena de conexión de MongoDB.                                |
| JWT_SECRET | Clave utilizada para firmar los JWT.                          |

## 6. Instalar dependencias

```bash
npm install
```

## 7. Ejecutar la aplicación

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

---

# Modelo de eventos

Cada evento contiene la siguiente información:

| Campo       | Tipo     | Descripción                               |
| ----------- | -------- | ----------------------------------------- |
| title       | String   | Título del evento.                        |
| description | String   | Descripción del evento.                   |
| category    | ObjectId | Referencia a la categoría.                |
| start_date  | Date     | Fecha y hora de inicio.                   |
| end_date    | Date     | Fecha y hora de fin.                      |
| location    | String   | Lugar del evento.                         |
| capacity    | Number   | Capacidad máxima de asistentes.           |
| price       | Number   | Precio de la entrada.                     |
| status      | String   | Estado del evento.                        |
| organizer   | ObjectId | Referencia al usuario creador del evento. |

### Estados permitidos

- draft
- published
- cancelled
- finished

---

# Endpoints de eventos

| Método | Endpoint                 | Acceso                     |
| ------ | ------------------------ | -------------------------- |
| POST   | `/api/events`            | Organizer, Admin           |
| GET    | `/api/events`            | Público                    |
| GET    | `/api/events/:id`        | Público                    |
| PUT    | `/api/events/:id`        | Organizer (propio) o Admin |
| PATCH  | `/api/events/:id/status` | Organizer (propio) o Admin |

---

# Filtros disponibles

El endpoint

```
GET /api/events
```

permite utilizar los siguientes parámetros:

| Parámetro | Descripción                                  |
| --------- | -------------------------------------------- |
| status    | Filtra por estado del evento.                |
| category  | Filtra por categoría.                        |
| location  | Filtra por ubicación (búsqueda parcial).     |
| fromDate  | Fecha inicial del rango de búsqueda.         |
| toDate    | Fecha final del rango de búsqueda.           |
| search    | Busca texto en título y descripción.         |
| page      | Número de página.                            |
| limit     | Cantidad de registros por página.            |
| sort      | Campo utilizado para ordenar los resultados. |

## Ejemplo

```http
GET /api/events?status=published&category=workshop&page=2&limit=5
```

También es posible combinar varios filtros:

```http
GET /api/events?location=Arequipa&search=tecnologia&sort=date
```

### Respuesta

```json
{
  "status": "success",
  "payload": [],
  "pagination": {
    "total": 100,
    "page": 2,
    "limit": 5,
    "totalPages": 20
  }
}
```

---

# Reglas de negocio

La lógica de negocio se implementa en la capa **Services**.

Las principales reglas son:

- El organizador del evento se obtiene automáticamente desde el usuario autenticado.
- El campo **organizer** no puede enviarse desde el body de la petición.
- Solo los usuarios con rol **Organizer** o **Admin** pueden crear eventos.
- Un organizador únicamente puede modificar los eventos que él mismo creó.
- Un administrador puede modificar cualquier evento.
- Los eventos cancelados no pueden modificarse.
- Los eventos no se eliminan físicamente de la base de datos.
- Cancelar un evento implica cambiar su estado a **cancelled**.
- No se permite crear eventos con fechas pasadas.
- No se permite publicar eventos cancelados o finalizados.
- La capacidad del evento debe ser mayor que cero.
- El precio del evento debe ser mayor o igual a cero.

---

# Arquitectura

El proyecto sigue una arquitectura por capas para separar responsabilidades.

```
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
DAO
    │
    ▼
MongoDB
```

### Controllers

Reciben la petición HTTP y construyen la respuesta.

### Services

Implementan la lógica de negocio y las validaciones.

### Repositories

Abstraen el acceso a los datos.

### DAO

Realizan las operaciones contra MongoDB utilizando Mongoose.

---

# Códigos de respuesta

| Código | Descripción                        |
| ------ | ---------------------------------- |
| 200    | Operación realizada correctamente. |
| 201    | Recurso creado correctamente.      |
| 400    | Error de validación.               |
| 401    | Usuario no autenticado.            |
| 403    | Usuario sin permisos.              |
| 404    | Recurso no encontrado.             |
| 500    | Error interno del servidor.        |

# Estructura del proyecto

src/
├── config/
├── controllers/
├── dao/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
└── app.js
