import express from "express";
import quizRoutes from "./routes/quizRoutes.js";
import theoryRoutes from "./routes/theoryRoutes.js";
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/theory", theoryRoutes);

app.get("/", (req, res) => {
  res.send("<i>Hello World! My first server </i>");
});

// هنا بنربط الـ routes
app.use("/api/quiz", quizRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});