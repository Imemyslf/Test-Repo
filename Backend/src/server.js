import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();

app.use(cors());

const savePath = path.join(import.meta.dirname, "..", "assets");

const storageSpace = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, savePath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storageSpace });

app.post("/uploads", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      res.status(204).json({ message: "No Content. File is empty" });
    }
    res.status(200).json({ message: "File Accepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Ever" });
  }
});

app.listen(8000, () => {
  console.log(savePath);
  console.log("Server running at PORT 8000");
});
