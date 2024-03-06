const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3000;
const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 204,
  methods: "GET, POST, DELETE",
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/usuarios", (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const perPage = parseInt(req.query.perPage) || 10;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const start = page * perPage;
    const end = start + perPage;

    const result = jsonData.usuarios.slice(start, end);

    res.status(200).json({
      usuarios: result,
      total: jsonData.usuarios.length,
      page,
      perPage,
      totalPages: Math.ceil(jsonData.usuarios.length / perPage),
    });
  });
});

app.post("/usuarios", (req, res) => {
  const { nombre, apellido, edad, ciudad, ocupacion } = req.body;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    const jsonData = JSON.parse(data);

    const maxId = jsonData.usuarios.reduce(
      (max, usuario) => Math.max(max, usuario.id),
      0
    );

    const nuevoUsuario = {
      id: maxId + 1,
      nombre,
      apellido,
      edad,
      ciudad,
      ocupacion,
    };

    jsonData.usuarios.push(nuevoUsuario);

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(201).json(nuevoUsuario);
    });
  });
});
app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    let jsonData = JSON.parse(data);
    const usuarioIndex = jsonData.usuarios.findIndex(usuario => usuario.id === id);

    if (usuarioIndex === -1) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    jsonData.usuarios.splice(usuarioIndex, 1);

    // Ajustar las ID de los usuarios restantes
    jsonData.usuarios = jsonData.usuarios.map((usuario, index) => {
      return { ...usuario, id: index + 1 };
    });

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
      res.status(200).json({ message: "Usuario eliminado con éxito" });
    });
  });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
