# API My Book - Backend Node.js

API REST para gestión de libros digitales con Azure Cosmos DB y Azure Blob Storage.

## Características

- CRUD de usuarios
- CRUD de libros con filtros avanzados
- Upload de archivos a Azure Blob Storage
- Base de datos Azure Cosmos DB (MongoDB API)
- Gestión de libros públicos y privados
- Sistema de ocultación de libros por usuario

## Instalación

```bash
npm install
```

## Configuración

Archivo `.env`:

```env
MONGODB_URI=tu_conexion_cosmos_db
PORT=3000
AZURE_STORAGE_CONNECTION_STRING=tu_conexion_string
AZURE_STORAGE_CONTAINER_IMAGENES=imagenes
AZURE_STORAGE_CONTAINER_PDFS=pdfs
```

## Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Inicializar datos
node scripts/inicializarDatosConDrive.js
```

## URLs

- **Local**: http://localhost:3000/api
- **Producción**: https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api

---

## Endpoints API

### USUARIOS

#### Registro
```http
POST /api/usuarios/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "birthday": "1990-01-01",
  "photo": "https://...",
  "rol": "usuario"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "birthday": "1990-01-01T00:00:00.000Z",
    "photo": "https://...",
    "rol": "usuario"
  }
}
```

#### Login
```http
POST /api/usuarios/login
Content-Type: application/json

{
  "email": "admin@mybook.com",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": "admin-001",
    "nombre": "Administrador",
    "email": "admin@mybook.com",
    "rol": "admin"
  }
}
```

#### Obtener Perfil
```http
GET /api/usuarios/{id}
```

#### Actualizar Perfil
```http
PUT /api/usuarios/{id}
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",
  "birthday": "1990-01-01",
  "photo": "https://..."
}
```

#### Eliminar Cuenta
```http
DELETE /api/usuarios/{id}
```

#### Obtener Todos los Usuarios (Admin)
```http
GET /api/usuarios
```

---

### LIBROS

#### Obtener Libros Públicos
```http
GET /api/libros?usuarioId={id}
```

**Query Params:**
- `usuarioId` (opcional): Filtra libros no eliminados por ese usuario

#### Obtener Libro por ID
```http
GET /api/libros/{id}?usuarioId={id}
```

#### Buscar por Título
```http
GET /api/libros/buscar/titulo/{titulo}?usuarioId={id}
```

#### Obtener Libros por Usuario
```http
GET /api/libros/usuario/{usuarioId}
```

#### Crear Libro
```http
POST /api/libros
Content-Type: application/json

{
  "titulo": "El Quijote",
  "autor": "Miguel de Cervantes",
  "descripcion": "Novela clásica española",
  "photo": "https://...",
  "rutaPdf": "https://...",
  "usuarioId": "admin-001"
}
```

#### Actualizar Libro
```http
PUT /api/libros/{id}
Content-Type: application/json

{
  "titulo": "Nuevo Título",
  "autor": "Nuevo Autor",
  "usuarioId": "admin-001"
}
```

#### Eliminar Libro
```http
DELETE /api/libros/{id}
Content-Type: application/json

{
  "usuarioId": "admin-001"
}
```

**Nota:** Si el usuario es dueño del libro, se elimina permanentemente. Si no, se oculta de su biblioteca.

#### Restaurar Libro
```http
PATCH /api/libros/{id}/restaurar
Content-Type: application/json

{
  "usuarioId": "admin-001"
}
```

#### Obtener Todos los Libros (Admin)
```http
GET /api/libros/admin/todos
```

---

### ARCHIVOS (Azure Blob Storage)

#### Subir Archivos
```http
POST /api/archivos/subir
Content-Type: multipart/form-data

Form Data:
- imagen: (file) - Requerido
- pdf: (file) - Opcional
- titulo: "Mi Libro"
- autor: "Autor"
- descripcion: "Descripción"
- usuarioId: "admin-001"
```

**Respuesta:** Devuelve el libro creado con URLs de Azure

#### Eliminar Archivo
```http
DELETE /api/archivos/eliminar
Content-Type: application/json

{
  "url": "https://mybookstoragecristy.blob.core.windows.net/...",
  "tipo": "imagen"
}
```

---

## Estructura del Proyecto

```
API- My Book/
├── server.js              # Entrada principal
├── controllers.js         # Todos los controllers
├── routes.js             # Todas las rutas
├── middlewares.js        # Middlewares
├── models/
│   ├── Usuario.js
│   └── Libro.js
├── data/
│   └── database.js
├── scripts/
│   └── inicializarDatosConDrive.js
└── .env
```

## Base de Datos

### Modelo Usuario
```javascript
{
  id: String (UUID),
  nombre: String,
  email: String (único),
  password: String (hasheado),
  birthday: Date,
  photo: String (URL),
  rol: String (usuario|admin)
}
```

### Modelo Libro
```javascript
{
  id: String (UUID),
  titulo: String,
  autor: String,
  descripcion: String,
  photo: String (URL Azure),
  rutaPdf: String (URL Azure),
  usuarioId: String,
  esPublico: Boolean,
  usuariosQueLoEliminaron: [String]
}
```

## Autenticación

Envía `usuarioId` en:
  - Body para POST/PUT/DELETE
  - Params para GET `/usuarios/{id}`
  - Query params para filtros `?usuarioId=xxx`

## Despliegue en Azure

1. Crear App Service en Azure
2. Configurar variables de entorno en Azure Portal
3. Desplegar con VS Code Azure Extension

**Variables de entorno requeridas en Azure:**
- `MONGODB_URI`
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_STORAGE_CONTAINER_IMAGENES`
- `AZURE_STORAGE_CONTAINER_PDFS`
- `PORT`

## Datos Iniciales

Al ejecutar `node scripts/inicializarDatosConDrive.js`:

- 1 Usuario Admin: `admin@mybook.com` / `admin123`
- 5 Libros de Lisa Kleypas con enlaces de Google Drive

## Tecnologías

- Node.js + Express 5.x
- Azure Cosmos DB (MongoDB API)
- Azure Blob Storage
- Multer (upload de archivos)
- bcryptjs (hash de contraseñas)
- UUID (identificadores únicos)

---

**Versión:** 2.0.0



