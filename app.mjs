import express from "express";
import "dotenv/config";
import cors from "cors";
import postsRouter from "./routes/posts.mjs";

const app = express();
const port = process.env.PORT || 4000;

// CORS middleware should be before other middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://travel-lifestyle-blog.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" });
});

// Routes
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});