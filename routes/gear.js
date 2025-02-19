import express from "express";
const router = express.Router(); 
import fs from "fs"; 

function readGear(){
    const gearData = fs.readFileSync("./data/gear.json");
    const parsedData = JSON.parse(gearData);
    return parsedData;
}

function writeGear(updatedData) {
    fs.writeFileSync("./data/gear.json", JSON.stringify(updatedData, null, 2));
}

router.get("/", (req, res) => {
    const gear = readGear();
    res.json(gear);
});

router.put("/gear_selected", (req, res) => {
    const { gear } = req.body;
    
    if (!["harness", "rope", "nylon-sling"].includes(gear)) {
        return res.status(400).json({ error: "Invalid gear selected" });
    }

    const data = readGear();
    data.gear = [gear]; 

    writeGear(data);
    res.status(200).json({ message: "Gear updated successfully", gear: data.gear });
});

router.put("/purchase_date", (req, res) => {
    const { purchase_date } = req.body;

    const isValidDate = !isNaN(Date.parse(purchase_date));
    if (!isValidDate) {
        return res.status(400).json({ error: "Invalid date format" });
    }

    const data = readGear();
    data.purchase_date = purchase_date;

    writeGear(data);
    res.status(200).json({ message: "Purchase date updated successfully", purchase_date: data.purchase_date });
});

router.put("/usage_frequency", (req, res) => {
    const { usage_frequency } = req.body;

    const validFrequencies = [
        "Unused and correctly stored", 
        "Used once or twice a year", 
        "Used once a month", 
        "Used several times a month", 
        "Used every week", 
        "Used almost daily"
    ];

    if (!validFrequencies.includes(usage_frequency)) {
        return res.status(400).json({ error: "Invalid usage frequency selected" });
    }

    const data = readGear();
    data.usage_frequency = usage_frequency;

    writeGear(data);
    res.status(200).json({ message: "Usage frequency updated successfully", usage_frequency: data.usage_frequency });
});

router.post("/expiry_date", (req, res) => {
    const { purchase_date, usage_frequency } = req.body;
    const frequencyMap = {
        "Unused and correctly stored": 10,
        "Used once or twice a year": 7,
        "Used once a month": 5,
        "Used several times a month": 3,
        "Used every week": 1,
        "Used almost daily": 0.5
    };

    const frequencyValue = frequencyMap[usage_frequency];
    if (!frequencyValue) {
        return res.status(400).json({ error: "Invalid usage frequency" });
    }

    const purchaseDate = new Date(purchase_date);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + frequencyValue);

    res.status(200).json({ expiry_date: expiryDate.toISOString().split("T")[0] });
});

router.post("/check_expiry", (req, res) => {
    const { expiry_date, gear } = req.body;

    const data = readGear();
    const expiryDate = new Date(expiry_date);
    const currentDate = new Date();
    const diffTime = expiryDate - currentDate;
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365); 
    
    if (diffYears <= 1) {
        const purchaseLink = data.purchase_link[0][gear];
        res.status(200).json({ message: "Expiry date is within one year", purchase_link: purchaseLink });
    } else {
        res.status(200).json({ message: "Expiry date is more than one year away" });
    }
});

export default router;