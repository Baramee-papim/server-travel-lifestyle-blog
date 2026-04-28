import express from "express";
import "dotenv/config";
import cors from "cors";
import articleRoute from "./routes/article.route.mjs";
import adminArticleRoute from "./routes/adminArticle.route.mjs";
import authRoute from "./routes/auth.route.mjs";
import categoryRoute from "./routes/category.route.mjs";
import uploadRoute from "./routes/upload.route.mjs";
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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json("Welcome to Blog Server");
  });


app.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" });
});

app.use("/api/article", articleRoute);
app.use("/api/admin/article", adminArticleRoute);
app.use("/api/category", categoryRoute);
app.use("/api/auth", authRoute);
app.use("/api/upload", uploadRoute);
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});