# Servidor Express JS con Base de Datos basada en JSON
Este repositorio contiene un servidor Express JS simple que utiliza una base de datos basada en JSON para el almacenamiento de datos. El servidor está diseñado para manejar solicitudes de API RESTful e interactuar con un archivo JSON para realizar operaciones CRUD.

## Instrucciones de Configuración
Sigue estos pasos para configurar y ejecutar el servidor:
1. ### Clona el repositorio:
```bash
git clone https://github.com/pablo-sanchez83/angular-final-servidor
```
2. ### Instala las Dependencias:
```bash
cd angular-final-servidor
npm install
```
2. ### Inicia el Servidor:
```bash
node server.js
```
## Detalles del Servidor
- Express JS: El servidor está construido utilizando Express JS, un marco web rápido, sin opiniones y minimalista para Node.js.
- Base de Datos JSON: Los datos se almacenan en un archivo JSON (data.json) y se manipulan utilizando operaciones estándar de E/S de archivos.
- Endpoints de API RESTful: El servidor proporciona endpoints para realizar operaciones CRUD en los datos almacenados en el archivo JSON.
## Endpoints Disponibles
- GET /usuarios: Obtener todos los datos de la base de datos.
- POST /usuarios/data: Agregar nuevos datos a la base de datos.
- DELETE /usuarios/:id: Eliminar datos con un ID específico.
## Datos de Ejemplo
El archivo JSON (db.json) contiene datos de ejemplo para fines de demostración. Puedes modificar este archivo directamente o utilizar los endpoints proporcionados para interactuar con los datos.
