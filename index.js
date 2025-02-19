import express from "express";
const app = express();
const PORT = 8080;
import cors from "cors";
import gearRoute from "./routes/gear.js";
import myGearRoute from "./routes/myGear.js";

app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("SafeGrip");
});

const gearItems = [];

app.use("/gear", gearRoute);
app.use("/myGear", myGearRoute);

app.listen(PORT, () => {
    console.log("Server is running on " + PORT);
});

