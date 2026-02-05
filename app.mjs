import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.get("/test", (req, res) => {
    return res.status(200).json({ "data": {
        "name": "John Doe",
        "age": 20
    } });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});