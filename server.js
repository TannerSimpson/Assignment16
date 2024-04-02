const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const PORT = process.env.PORT || 3001;
const craftsFilePath = path.join(__dirname, "public", "json", "crafts.json");
const craftsImagesPath = path.join(__dirname, "public", "images");

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, craftsImagesPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Routes
app.get("/", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "index.html"));
  } catch (error) {
    console.error("Error serving index.html:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/crafts", async (req, res) => {
  try {
    const craftsData = await fs.readFile(craftsFilePath, "utf-8");
    res.send(craftsData);
  } catch (error) {
    console.error("Error fetching crafts:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route for adding new crafts
app.post("/api/crafts", upload.single("image"), async (req, res) => {
  try {
    const { name, description, supplies } = req.body;
    const image = req.file ? req.file.filename : ""; // Save filename if image uploaded

    // Validate craft data
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      supplies: Joi.array().items(Joi.string()).required(),
    });
    const { error } = schema.validate({ name, description, supplies });
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Read existing crafts data from file
    let craftsData = await fs.readFile(craftsFilePath, "utf-8");
    craftsData = JSON.parse(craftsData);

    // Add new craft to data
    const newCraft = { name, image, description, supplies };
    craftsData.push(newCraft);

    // Write updated crafts data back to file
    await fs.writeFile(craftsFilePath, JSON.stringify(craftsData, null, 2));

    res.send("Craft added successfully");
  } catch (error) {
    console.error("Error adding craft:", error);
    res.status(500).send("Internal Server Error");
  }
});