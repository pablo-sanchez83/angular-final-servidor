// Importación de los módulos necesarios
const express = require("express");
const fs = require("fs");
const cors = require("cors");

// Creación de la aplicación Express
const app = express();

// Puerto en el que se ejecutará el servidor
const port = 3000;

// Opciones de CORS
const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 204,
  methods: "GET, POST, DELETE",
};

// Uso de middleware para habilitar CORS con las opciones especificadas
app.use(cors(corsOptions));

// Uso de middleware para parsear el cuerpo de las solicitudes HTTP a JSON
app.use(express.json());

// Ruta GET para obtener usuarios
app.get("/usuarios", (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const perPage = parseInt(req.query.perPage) || 10;

  // Lectura del archivo db.json
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Parseo de los datos a JSON
    const jsonData = JSON.parse(data);

    // Cálculo de los índices de inicio y fin para la paginación
    const start = page * perPage;
    const end = start + perPage;

    // Extracción de los usuarios correspondientes a la página actual
    const result = jsonData.usuarios.slice(start, end);

    // Envío de la respuesta
    res.status(200).json({
      usuarios: result,
      total: jsonData.usuarios.length,
      page,
      perPage,
      totalPages: Math.ceil(jsonData.usuarios.length / perPage),
    });
  });
});

// Ruta POST para crear un usuario
app.post("/usuarios", (req, res) => {
  const { nombre, apellido, edad, ciudad, ocupacion } = req.body;

  // Lectura del archivo db.json
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    const jsonData = JSON.parse(data);

    // Cálculo del ID máximo entre los usuarios existentes
    const maxId = jsonData.usuarios.reduce(
      (max, usuario) => Math.max(max, usuario.id),
      0
    );

    // Creación del nuevo usuario
    const nuevoUsuario = {
      id: maxId + 1,
      nombre,
      apellido,
      edad,
      ciudad,
      ocupacion,
    };

    // Adición del nuevo usuario a la lista de usuarios
    jsonData.usuarios.push(nuevoUsuario);

    // Escritura de los nuevos datos en el archivo db.json
    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      // Envío de la respuesta con el nuevo usuario
      res.status(201).json(nuevoUsuario);
    });
  });
});

// Ruta DELETE para eliminar un usuario
app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Lectura del archivo db.json
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    let jsonData = JSON.parse(data);
    const usuarioIndex = jsonData.usuarios.findIndex(usuario => usuario.id === id);

    // Verificación de que el usuario existe
    if (usuarioIndex === -1) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    // Eliminación del usuario de la lista de usuarios
    jsonData.usuarios.splice(usuarioIndex, 1);

    // Ajuste de las ID de los usuarios restantes
    jsonData.usuarios = jsonData.usuarios.map((usuario, index) => {
      return { ...usuario, id: index + 1 };
    });

    // Escritura de los nuevos datos en el archivo db.json
    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
      // Envío de la respuesta indicando que el usuario fue eliminado con éxito
      res.status(200).json({ message: "Usuario eliminado con éxito" });
    });
  });
});

// Inicio del servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
