import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const userDataFilePath = path.join("../data/user.json");

function readUserData() {
    if (fs.existsSync(userDataFilePath)) {
        const userData = fs.readFileSync(userDataFilePath);
        return JSON.parse(userData);
    }
    return [];
}

function writeUserData(data) {
    fs.writeFileSync(userDataFilePath, JSON.stringify(data, null, 2));
}

router.get("/mygear", (req, res) => {
  try {
    const userData = readUserData();  
    res.status(200).json(userData);   
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/save-gear", (req, res) => {
  try {
    const userData = readUserData();
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching saved gear data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/save-gear", (req, res) => {
  try {
      const { gear, purchase_date, usage_frequency, expiry_date, purchase_link } = req.body;

      if (!gear || !purchase_date || !usage_frequency || !expiry_date) {
          return res.status(400).json({ error: "Missing required data" });
      }

      const newEntry = {
          gear,
          purchase_date,
          usage_frequency,
          expiry_date,
          purchase_link,
      };

      const currentUserData = readUserData();

      currentUserData.push(newEntry);

      writeUserData(currentUserData);

      res.status(200).json({ message: "Data saved successfully", newEntry });
  } catch (error) {
      console.error("Error saving gear data:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

