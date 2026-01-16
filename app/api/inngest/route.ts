import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { runLighthouseAudit } from "@/app/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [runLighthouseAudit],
});
