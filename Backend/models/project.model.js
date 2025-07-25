const mongoose = require("mongoose");

const chartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chartType: { type: String, enum: ["line", "bar", "pie"], required: true },
  xAxis: { type: String, required: true },
  yAxis: { type: String, required: true },
  imageUrl: { type: String }, // Cloudinary PNG URL
  createdAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String }, // Excel file URL if you store it (e.g. Cloudinary, S3)
  uploadedAt: { type: Date, default: Date.now },
  charts: [chartSchema],
});


const projectModel = mongoose.model("Project", projectSchema);

module.exports = projectModel;
