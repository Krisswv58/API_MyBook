# API My Book

## URL de la API en Producción

```
https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api
```

---

## Endpoints

### USUARIOS

#### 1. Registro de Usuario

**POST** `https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api/usuarios/registro`

**Request:**
```json
{
  "nombre": "Viviana Campos",
  "email": "viviana@example.com",
  "password": "password123",
  "birthday": "1990-01-01",
  "photo": "https://ejemplo.com/foto.jpg",
  "rol": "usuario"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "uuid-generado",
    "nombre": "Viviana Campos",
    "email": "viviana@example.com",
    "birthday": "1990-01-01T00:00:00.000Z",
    "photo": "https://ejemplo.com/foto.jpg",
    "rol": "usuario"
  }
}
```

---

#### 2. Login

**POST** `https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api/usuarios/login`

**Request:**
```json
{
  "email": "admin@mybook.com",
  "password": "admin123"
}
```

**Response:**
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

---

#### 3. Obtener Perfil de Usuario

**GET** `https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api/usuarios/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombre": "Viviana Campos",
    "email": "viviana123@gmail.com",
    "birthday": "1990-01-01T00:00:00.000Z",
    "photo": "https://ejemplo.com/foto.jpg",
    "rol": "usuario"
  }
}
```

---

#### 4. Actualizar Perfil

**PUT** `https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api/usuarios/{id}`

**Request:**
```json
{
  "nombre": "Viviana Campos",
  "email": "viviana123@gmail.com",
  "birthday": "1990-01-01",
  "photo": "https://ejemplo.com/nueva-foto.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": "uuid",
    "nombre": "Viviana Campos",
    "email": "viviana123@gmail.com",
    "birthday": "1990-01-01T00:00:00.000Z",
    "photo": "https://ejemplo.com/nueva-foto.jpg",
    "rol": "usuario"
  }
}
```

---

#### 5. Eliminar Cuenta

**DELETE** `https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api/usuarios/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

---

#### 6. Obtener Todos los Usuarios

**GET** `https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api/usuarios`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "nombre": "Viviana Campos",
      "email": "viviana@example.com",
      "birthday": "1990-01-01T00:00:00.000Z",
      "photo": "https://ejemplo.com/foto.jpg",
      "rol": "usuario"
    },
    {
      "id": "admin-001",
      "nombre": "Administrador",
      "email": "admin@mybook.com",
      "birthday": null,
      "photo": null,
      "rol": "admin"
    }
  ]
}
```

---

### LIBROS

#### 7. Obtener Libros

**GET** `https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api/libros?usuarioId={id}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "libroId": "uuid",
      "titulo": "El Quijote",
      "autor": "Miguel de Cervantes",
      "genero": "Clásico",
      "descripcion": "Novela clásica española",
      "añoPublicacion": 1605,
      "editorial": "Editorial",
      "idioma": "Español",
      "numeroPaginas": 500,
      "imagenUrl": "https://...",
      "pdfUrl": "https://...",
      "usuarioId": "admin-001"
    }
  ]
}
```

---

#### 11. Registrar Libro

**POST** `https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api/libros`

**Request:**
```json
{
  "usuarioId": "admin-001",
  "titulo": "El Quijote",
  "autor": "Miguel de Cervantes",
  "genero": "Clásico",
  "descripcion": "Novela clásica española",
  "añoPublicacion": 1605,
  "editorial": "Editorial",
  "idioma": "Español",
  "numeroPaginas": 500,
  "imagenUrl": "https://...",
  "pdfUrl": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Libro creado exitosamente",
  "data": {
    "libroId": "uuid-generado",
    "titulo": "El Quijote",
    "autor": "Miguel de Cervantes",
    "usuarioId": "admin-001"
  }
}
```

---

#### 13. Eliminar Libro

**DELETE** `https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api/libros/{id}`

**Request:**
```json
{
  "usuarioId": "admin-001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Libro eliminado exitosamente"
}
```

---


---

#### 15. Obtener Todos los Libros

**GET** `https://mybook-api-cristywilson-h2csd6hngtccbygu.eastus-01.azurewebsites.net/api/libros/admin/todos`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "libroId": "uuid",
      "titulo": "Libro 1",
      "autor": "Autor 1",
      "eliminado": false
    }
  ]
}
```




