import mongoose from 'mongoose';

// Define Chart Schema
const chartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Chart name is required"],
  },
  chartType: {
    type: String,
    enum: ["line", "bar", "pie"],
    required: [true, "Chart type is required"],
  },
  xAxis: {
    type: String,
    required: [true, "xAxis field is required"],
  },
  yAxis: {
    type: String,
    required: [true, "yAxis field is required"],
  },
  imageUrl: {
    type: String, // optional URL to cloud image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define Project Schema
const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // should match the model name exactly (case-sensitive)
    required: true,
  },
  fileName: {
    type: String,
    required: [true, "File name is required"],
  },
  fileUrl: {
    type: String, // optional Excel file URL
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  charts: [chartSchema], // Embed chart schema
});

// Create and export Project model
const projectModel = mongoose.model("Project", projectSchema);

export default projectModel;
