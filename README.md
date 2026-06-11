# WeList

Aplicación de listas colaborativas en tiempo real. Crea, comparte y organiza listas con quien quieras.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)

## Demo

[https://we-list-eosin.vercel.app](https://we-list-eosin.vercel.app)

## Características

- Listas colaborativas en tiempo real con Socket.IO
- Invitaciones por email (Resend)
- Roles de usuario: Propietario, Editor, Lector
- CRUD completo de listas y elementos
- Marcar elementos como completados
- Interfaz moderna, responsive y mobile-first
- Autenticación JWT con bcrypt

## Tecnologías

### Frontend
- React 18 + Vite
- React Router DOM
- React Query (TanStack Query)
- Axios
- Socket.IO Client
- Tailwind CSS v3
- React Hot Toast

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon)
- Socket.IO
- JWT + bcrypt
- Zod (validación)
- Resend (emails)

## Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL (Neon o local)

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/welist-app.git
cd welist-app
```

### 2. Instalar dependencias

```bash
npm run install:all
```

### 3. Configurar variables de entorno

Copia los archivos de ejemplo y rellena tus datos:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**Backend** (`server/.env`):

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL (Neon) |
| `JWT_SECRET` | Secreto para JWT (mínimo 32 caracteres) |
| `RESEND_API_KEY` | API key de [Resend](https://resend.com) |
| `CLIENT_URL` | URL del frontend (`http://localhost:5173` en desarrollo) |
| `PORT` | Puerto del backend (`3001`) |

**Frontend** (`client/.env`):

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base de la API (`http://localhost:3001/api`) |
| `VITE_SOCKET_URL` | URL del servidor Socket.IO (`http://localhost:3001`) |

### 4. Ejecutar migraciones

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### 5. Iniciar desarrollo

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Despliegue

### Frontend (Vercel)
1. Conectar repositorio a Vercel
2. Configurar Variables de Entorno:
   - `VITE_API_URL`: URL del backend en Render
   - `VITE_SOCKET_URL`: URL del backend en Render
3. Desplegar automáticamente

### Backend (Render)
1. Conectar repositorio a Render
2. Configurar Variables de Entorno:
   - `DATABASE_URL`: URL de Neon
   - `JWT_SECRET`: Secreto seguro
   - `RESEND_API_KEY`: API key de Resend
   - `CLIENT_URL`: URL de Vercel
3. Render ejecutará automáticamente `npm install` y `npm start`

### Base de datos (Neon)
1. Crear cuenta en [Neon](https://neon.tech)
2. Crear base de datos
3. Copiar URL de conexión
4. Ejecutar migraciones en producción:
```bash
npx prisma migrate deploy
```

## Estructura del proyecto

```
welist-app/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Páginas/rutas
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # Llamadas HTTP
│   │   └── context/     # React Context
│   └── vercel.json      # Configuración Vercel
│
├── server/              # Backend Node.js
│   ├── prisma/          # Schema y migraciones
│   ├── src/
│   │   ├── config/      # Configuración
│   │   ├── middleware/   # Middlewares
│   │   ├── modules/     # Módulos (auth, lists, items, invitations)
│   │   └── utils/       # Utilidades
│   └── Procfile         # Configuración Render
│
└── README.md
```

## API Endpoints

### Auth
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/registro` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/perfil` | Obtener perfil | Sí |

### Listas
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/listas` | Obtener listas | Sí |
| POST | `/api/listas` | Crear lista | Sí |
| GET | `/api/listas/:id` | Obtener lista por ID | Sí |
| PUT | `/api/listas/:id` | Editar lista | Sí |
| DELETE | `/api/listas/:id` | Eliminar lista | Sí |

### Elementos
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/listas/:listaId/elementos` | Obtener elementos | Sí |
| POST | `/api/listas/:listaId/elementos` | Crear elemento | Sí |
| PUT | `/api/listas/:listaId/elementos/:id` | Editar elemento | Sí |
| PATCH | `/api/listas/:listaId/elementos/:id/completar` | Toggle completado | Sí |
| DELETE | `/api/listas/:listaId/elementos/:id` | Eliminar elemento | Sí |

### Invitaciones
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/listas/:listaId/invitar` | Enviar invitación | Sí |
| GET | `/api/invitaciones/:token` | Verificar invitación | No |
| POST | `/api/invitaciones/:token/aceptar` | Aceptar invitación | No |

## Licencia

MIT
