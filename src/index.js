import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import axios from "axios";
import mysql from "mysql2/promise";

const app = express();
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "aula_js",
});

connection.ping().then(() => console.log("Conectado ao banco de dados"));

//middlewares
app.use(bodyParser.json());

// Requisições GET e POST
// GET -> pegar informação
// POST -> inserir, enviar informação

// json -> Content-Type: application/json
// query parameters -> ?
app.get("/", (request, response) => {
  const parametros = request.query; // {nome: Pedro}

  //console.log(request)

  response.json({
    nome: parametros.nome,
    banana: true,
  });
});

app.post("/jwt", (req, res) => {
  const token = req.body.token;
  jwt.verify(token, "aula", (erro, decodificado) => {
    if (erro) {
      res.status(401).send();
    } else {
      res.json(decodificado);
    }
  });
});

app.post("/dados", (req, res) => {
  const body = req.body;

  if (!body.nome || !body.idade) {
    return res.status(400).json({ erro: "Faltam dados" });
  }

  connection
    .query(`insert into usuario (nome, idade) values (?, ?)`, [
      req.body.nome,
      req.body.idade,
    ])
    .then((rows) => res.json(rows));
});

app.get("/cliente", (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ erro: "Faltam dados" });
  }

  connection
    .query(`select * from usuario where id = ?`, [req.query.id])
    .then((rows) => res.json(rows));
});

app.get("/discord", (req, res) => {
  const URL_BASE = "https://discord.com/api";
  console.log(req.query.code);

  const params = new URLSearchParams();
  params.append("client_id", "1085514062525374495");
  params.append("client_secret", "");
  params.append("grant_type", "authorization_code");
  params.append("code", req.query.code);
  params.append("redirect_uri");
  axios.post(URL_BASE + "/oauth2/token");

  res.send();
});

app.listen(3000, () => {
  console.log("servidor online");
});
