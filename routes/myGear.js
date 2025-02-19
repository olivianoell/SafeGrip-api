import express from "express";
const router = express.Router();
import fs from "fs";

function readUserData() {
    try {
        const userData = fs.readFileSync("./data/user.json");
        return JSON.parse(userData);
    } catch (err) {
        return []; 
    }
}

function writeUserData(updatedData) {
    fs.writeFileSync("./data/user.json", JSON.stringify(updatedData, null, 2)); 
}

router.post("/myGear", (req, res) => {
    const { gear, purchase_date, usage_frequency } = req.body;

    const frequencyMap = {
        "Unused and correctly stored": 10,
        "Used once or twice a year": 7,
        "Used once a month": 5,
        "Used several times a month": 3,
        "Used every week": 1,
        "Used almost daily": 0.5
    };

    if (!["harness", "rope", "nylon-sling"].includes(gear)) {
        return res.status(400).json({ error: "Invalid gear selected" });
    }

    const isValidDate = !isNaN(Date.parse(purchase_date));
    if (!isValidDate) {
        return res.status(400).json({ error: "Invalid date format" });
    }

    if (!frequencyMap[usage_frequency]) {
        return res.status(400).json({ error: "Invalid usage frequency selected" });
    }

    const purchaseDate = new Date(purchase_date);
    const frequencyValue = frequencyMap[usage_frequency];
    const expiryDate = new Date(purchaseDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + frequencyValue);
    
    const expiryDateFormatted = expiryDate.toISOString().split("T")[0];

    const gearData = JSON.parse(fs.readFileSync("./data/gear.json"));
    const purchaseLink = gearData.purchase_link[0][gear];

    const myGearData = {
        gear,
        purchase_date,
        usage_frequency,
        expiry_date: expiryDateFormatted,
        purchase_link: expiryDate <= new Date() ? purchaseLink : null 
    };

    const existingUserData = readUserData();
    existingUserData.push(myGearData); 
    writeUserData(existingUserData);

    res.status(200).json({
        message: "Gear data stored successfully",
        myGearData
    });
});

router.get("/myGear", (req, res) => {
    const userData = readUserData();
    res.status(200).json(userData);
});

export default router;
