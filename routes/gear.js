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

router.get("/:gear", (req, res) => {
    const { gear } = req.params;
    const allGearData = readGear();
    
    const gearData = allGearData.find(g => g.gear === gear);

    if (!gearData) {
        return res.status(404).json({ error: "Gear not found" });
    }

    res.json(gearData);
});

router.get("/:gear/purchase_date", (req, res) => {
    const { gear } = req.params;
    const allGearData = readGear();

    const gearData = allGearData.find(g => g.gear === gear);

    if (!gearData) {
        return res.status(404).json({ error: "Gear not found" });
    }

    res.json({ purchase_date: gearData.purchase_date });
});

router.get("/:gear/usage_frequency", (req, res) => {
    const { gear } = req.params;
    const allGearData = readGear();

    const gearData = allGearData.find(g => g.gear === gear);

    if (!gearData) {
        return res.status(404).json({ error: "Gear not found" });
    }

    res.json({ usage_frequency: gearData.usage_frequency });
});

router.get("/:gear/purchase_link", (req, res) => {
    const { gear } = req.params;
    const allGearData = readGear();

    const gearData = allGearData.find(g => g.gear === gear);

    if (!gearData) {
        return res.status(404).json({ error: "Gear not found" });
    }

    res.json({ purchase_link: gearData.purchase_link });
});

router.get("/:gear/expiry_date", (req, res) => {
    const { gear } = req.params;
    const allGearData = readGear();

    const gearData = allGearData.find(g => g.gear === gear);

    if (!gearData) {
        return res.status(404).json({ error: "Gear not found" });
    }

    const { purchase_date, usage_frequency } = gearData;

    if (!purchase_date || !usage_frequency) {
        return res.status(400).json({ error: "Missing required fields (purchase_date or usage_frequency)" });
    }

    const frequencyMap = {
        "Unused and correctly stored": 10,
        "Used once or twice a year": 7,
        "Used once a month": 5,
        "Used several times a month": 3,
        "Used every week": 1
    };

    let frequencyValue = null;
    for (const key in usage_frequency) {
        if (usage_frequency.hasOwnProperty(key)) {
            frequencyValue = frequencyMap[key];
            break; 
        }
    }

    if (frequencyValue === null) {
        return res.status(400).json({ error: "Invalid usage frequency" });
    }

    const purchaseDate = new Date(purchase_date);
    if (isNaN(purchaseDate)) {
        return res.status(400).json({ error: "Invalid purchase date" });
    }

    purchaseDate.setFullYear(purchaseDate.getFullYear() + frequencyValue);

    const expiryDate = purchaseDate.toISOString().split("T")[0];

    res.json({ expiry_date: expiryDate });
});

router.post("/:gear/expiry_date", (req, res) => {
    const { gear } = req.params;
    const { purchase_date, usage_frequency } = req.body;

    if (!purchase_date || !usage_frequency) {
        return res.status(400).json({ error: "Missing purchase_date or usage_frequency" });
    }

    const allGearData = readGear();
    const gearData = allGearData.find(g => g.gear === gear);

    if (!gearData) {
        return res.status(404).json({ error: "Gear not found" });
    }

    const frequencyMap = {
        "Unused and correctly stored": 10,
        "Used once or twice a year": 7,
        "Used once a month": 5,
        "Used several times a month": 3,
        "Used every week": 1,
        "Used almost daily": 0.5
    };

    let frequencyValue = frequencyMap[usage_frequency];
    if (frequencyValue === undefined) {
        return res.status(400).json({ error: "Invalid usage frequency" });
    }

    const purchaseDate = new Date(purchase_date);
    if (isNaN(purchaseDate)) {
        return res.status(400).json({ error: "Invalid purchase date format" });
    }

    purchaseDate.setFullYear(purchaseDate.getFullYear() + frequencyValue);

    const expiryDate = purchaseDate.toISOString().split("T")[0]; 

    res.status(200).json({ expiry_date: expiryDate });
});

router.post("/:gear/purchase_link", (req, res) => {
    const { gear } = req.params;
    const { purchase_link } = req.body;

    if (!purchase_link || !isValidUrl(purchase_link)) {
        return res.status(400).json({ error: "Invalid or missing purchase_link" });
    }

    const allGearData = readGear();
    const gearData = allGearData.find(g => g.gear === gear);

    if (!gearData) {
        return res.status(404).json({ error: "Gear not found" });
    }

    gearData.purchase_link = purchase_link;

    writeGear(allGearData);

    res.status(200).json({ message: "Purchase link updated successfully", purchase_link: gearData.purchase_link });
});

export default router;
