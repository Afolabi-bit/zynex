import { inngest } from "@/lib/inngest";
import { runLighthouseAudit as lighthouseRunner } from "@/lib/lighthouse-runner";
import prisma from "@/lib/db";

export const runLighthouseAudit = inngest.createFunction(
  { id: "lighthouse-runner" },
  { event: "test/run-audit" },
  async ({ event, step }) => {
    const { testId, url, device, network } = event.data;

    // Step 1: Run the audit (captured in step to handle retries/timeouts better)
    const results = await step.run("run-lighthouse-audit", async () => {
      return await lighthouseRunner({
        url,
        device,
        network,
      });
    });

    // Step 2: Save results to database
    await step.run("save-results-to-db", async () => {
      await prisma.test.update({
        where: { id: testId },
        data: {
          status: "completed",
          performanceScore: results.performanceScore,
          fcp: results.fcp,
          lcp: results.lcp,
          tbt: results.tbt,
          cls: results.cls,
          fullReport: JSON.parse(results.fullReport || "{}"),
        },
      });
    });

    return { success: true, testId };
  }
);
