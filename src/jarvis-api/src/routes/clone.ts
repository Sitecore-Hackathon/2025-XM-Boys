import { Router, Request, Response } from "express";
import { cloneRendering } from "../services/item";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    let body = req.body;
    const response = await cloneRendering(body);
    res.json({ success: true, response });
});

export default router;
