import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
    res.json({
        message: "Smart Door Access API"
    });
});

export default app;