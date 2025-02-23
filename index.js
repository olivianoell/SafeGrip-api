import express from "express";
const app = express();
const PORT = 8080;
import cors from "cors";
import gearRoute from "./routes/gear.js";
import userRoute from "./routes/user.js";

app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("SafeGrip");
});

app.use("/gear", gearRoute);
app.use("/user", userRoute);

app.listen(PORT, () => {
    console.log("Server is running on " + PORT);
});

