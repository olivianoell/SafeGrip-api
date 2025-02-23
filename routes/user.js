import express from "express";
import fs from "fs";
const router = express.Router();

function readUser() {
  try {
    const userData = fs.readFileSync("./data/user.json", "utf8");
    console.log("User data read successfully");
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error reading user data:", error);
    return { gearData: [] };
  }
}

function writeUser(updatedData) {
  try {
    fs.writeFileSync("./data/user.json", JSON.stringify(updatedData, null, 2));
    console.log("User data written successfully");
  } catch (error) {
    console.error("Error writing user data:", error);
  }
}

router.get("/UserGear", (req, res) => {
  try {
    const currentUserData = readUser();
    res.status(200).json(currentUserData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/submit", (req, res) => {
  const newData = req.body;

  console.log("Received data:", newData);

  if (!newData.gear || !newData.purchase_date || !newData.usage_frequency || !newData.expiry_date) {
    console.error("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const currentUserData = readUser();

    if (!currentUserData.gearData) {
      console.log("Initializing gearData array");
      currentUserData.gearData = [];
    }

    console.log("Adding new gear data to gearData array");
    currentUserData.gearData.push(newData);

    writeUser(currentUserData);

    console.log("Data saved successfully");
    res.status(200).json({ message: "Data saved successfully", newData });
  } catch (error) {
    console.error("Error saving gear data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteGear", (req, res) => {
  const gearToDelete = req.body;  

  try {
    const currentUserData = readUser();
    const gearIndex = currentUserData.gearData.findIndex(
      gear =>
        gear.gear === gearToDelete.gear &&
        gear.purchase_date === gearToDelete.purchase_date &&
        gear.usage_frequency === gearToDelete.usage_frequency && 
        gear.expiry_date === gearToDelete.expiry_date
    );

    if (gearIndex === -1) {
      return res.status(404).json({ error: "Gear not found" });
    }

    currentUserData.gearData.splice(gearIndex, 1);
    writeUser(currentUserData);

    console.log(`Gear with details ${JSON.stringify(gearToDelete)} deleted successfully`);
    res.status(200).json({ message: "Gear deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting gear:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

