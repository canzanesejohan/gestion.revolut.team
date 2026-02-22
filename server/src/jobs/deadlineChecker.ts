import cron from "node-cron";
import { checkDeadlines } from "../services/deadline.service.js";
import { detectBottlenecks } from "../services/workload.service.js";

export function startDeadlineChecker(io?: any) {
  // Check deadlines every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    console.log("⏰ Verificando deadlines...");
    const result = await checkDeadlines(io);
    console.log(`   → ${result.markedDelayed} retrasadas, ${result.warned24h} alertas 24h, ${result.warned48h} alertas 48h`);
  });

  // Detect bottlenecks every hour
  cron.schedule("0 * * * *", async () => {
    console.log("🔍 Detectando cuellos de botella...");
    const result = await detectBottlenecks(io);
    console.log(`   → ${result.alerts.length} alertas, ${result.longBlocked} bloqueos prolongados`);
  });

  console.log("✅ Cron jobs de deadline y bottleneck iniciados");
}
