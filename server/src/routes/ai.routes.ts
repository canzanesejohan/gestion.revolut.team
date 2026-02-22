import { Router } from "express";
import type { Response } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import type { AuthRequest } from "../types/index.js";
import { chatWithAI, generateProjectPlan, generateAIInsights, suggestAssignment } from "../services/ai.service.js";

const router = Router();

router.use(authenticate);

// Chat with AI assistant
router.post("/chat", async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }
    const response = await chatWithAI(message, history || []);
    res.json({ response });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI service error";
    if (message.includes("ANTHROPIC_API_KEY")) {
      res.status(503).json({ error: "Claude AI no esta configurado. Agrega ANTHROPIC_API_KEY en la configuracion." });
      return;
    }
    res.status(500).json({ error: message });
  }
});

// Generate project plan
router.post("/generate-plan", async (req: AuthRequest, res: Response) => {
  try {
    const { description } = req.body;
    if (!description) {
      res.status(400).json({ error: "Description is required" });
      return;
    }
    const plan = await generateProjectPlan(description);
    res.json(plan);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI service error";
    res.status(500).json({ error: message });
  }
});

// Get AI insights
router.get("/insights", async (_req: AuthRequest, res: Response) => {
  try {
    const insights = await generateAIInsights();
    res.json({ insights });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI service error";
    res.status(500).json({ error: message });
  }
});

// Suggest assignment
router.post("/suggest-assignment", async (req: AuthRequest, res: Response) => {
  try {
    const { title, type } = req.body;
    const suggestion = await suggestAssignment(title || "", type || "FEATURE");
    res.json({ suggestion });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI service error";
    res.status(500).json({ error: message });
  }
});

export default router;
