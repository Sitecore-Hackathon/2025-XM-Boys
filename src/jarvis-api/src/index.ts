import express, { Request, Response } from "express";
import templateRoutes from "./routes/templates";
import itemRoutes from "./routes/items";
import aiRoutes from "./routes/ai";
import cloneRoutes from "./routes/clone";
import { config } from "dotenv";
import cors from "cors";

config({ path: [".env.local", ".env"] });
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/api/templates", templateRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/clone", cloneRoutes);

app.get("/api/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript Express!");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
