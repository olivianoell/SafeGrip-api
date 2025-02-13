import express from "express";
const app = express();
const PORT = 8080;
import cors from "cors";

app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("SafeGrip");
});

const users = [];
const gearItems = [];

app.listen(PORT, () => {
    console.log("Server is running on " + PORT);
});

