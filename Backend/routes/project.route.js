import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Project from "../models/project.model.js";
import  authUser  from "../middlewares/auth.middleware.js";


const router = express.Router();

// Configure Multer
const upload = multer({ dest: "uploads/" });

// Upload Excel file
router.post("/upload", upload.single("excel"), async (req, res) => {
  try {
    const { originalname, path } = req.file;

    // If you want, upload Excel to Cloudinary too — optional
    // const result = await cloudinary.uploader.upload(path, { resource_type: "raw" });
    // const fileUrl = result.secure_url;

    // Otherwise just store the local path or move to S3 later
    const project = new Project({
      userId: req.body.userId,
      fileName: originalname,
      fileUrl: "", // optional
      charts: [],
    });

    await project.save();

    // Clean up local file if uploaded to Cloudinary
    fs.unlinkSync(path);

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/projects", authUser, async (req, res) => {
    try {
      const { projectName, projectDescription, charts } = req.body;
  
      const newProject = new Project({
        userId: req.user._id,
        fileName: projectName,
        fileUrl: "", // optional
        charts: [],
      });
  
      // Upload each chart image to Cloudinary & push chart details
      for (const chart of charts) {
        const uploadResult = await cloudinary.uploader.upload(chart.imageBase64, {
          folder: "charts",
        });
  
        newProject.charts.push({
          name: chart.name,
          chartType: chart.chartType,
          xAxis: chart.xAxis,
          yAxis: chart.yAxis,
          imageUrl: uploadResult.secure_url,
        });
      }
  
      await newProject.save();
  
      res.json({ success: true, project: newProject });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  });
  

// Add chart to project
router.post("/add-chart/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { name, chartType, xAxis, yAxis, imageBase64 } = req.body;

  try {
    // Upload chart image to Cloudinary
    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: "charts",
    });

    const project = await Project.findById(projectId);
    project.charts.push({
      name,
      chartType,
      xAxis,
      yAxis,
      imageUrl: result.secure_url,
    });
    await project.save();

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
