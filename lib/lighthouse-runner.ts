// This ensures the file is never bundled for client-side
import "server-only";

// Dynamic import to prevent bundling issues
export async function runLighthouseAudit(params: {
  url: string;
  device: "mobile" | "desktop";
  network?: string;
}) {
  // Dynamically import lighthouse only when function is called
  const lighthouse = (await import("lighthouse")).default;
  const chromeLauncher = await import("chrome-launcher");

  let chrome: Awaited<ReturnType<typeof chromeLauncher.launch>> | null = null;

  try {
    // ============================================
    // STEP 1: Validate parameters
    // ============================================
    if (
      !params.url ||
      typeof params.url !== "string" ||
      params.url.trim() === ""
    ) {
      throw new Error(
        "The 'url' parameter is required and must be a non-empty string"
      );
    }

    // Validate URL format
    try {
      new URL(params.url);
    } catch (urlError) {
      throw new Error(`The provided URL is not valid: "${params.url}"`);
    }

    if (
      !params.device ||
      !["mobile", "desktop"].includes(params.device.toLowerCase())
    ) {
      throw new Error(
        "The 'device' parameter must be either 'mobile' or 'desktop'"
      );
    }

    const normalizedDevice = params.device.toLowerCase() as
      | "mobile"
      | "desktop";

    console.log("✅ Input validation passed:", {
      url: params.url,
      device: normalizedDevice,
      network: params.network,
    });

    // ============================================
    // STEP 2: Launch Chrome browser
    // ============================================
    console.log("🚀 Attempting to launch Chrome...");
    try {
      chrome = await chromeLauncher.launch({
        chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
      });
      console.log("✅ Chrome launched successfully on port:", chrome.port);
    } catch (chromeError) {
      console.error("❌ LIGHTHOUSE ERROR - Chrome Launch Failed:", chromeError);
      throw new Error(
        `Failed to launch Chrome browser: ${
          chromeError instanceof Error
            ? chromeError.message
            : "Unknown Chrome error"
        }`
      );
    }

    // ============================================
    // STEP 3: Configure Lighthouse options
    // ============================================
    const options = {
      logLevel: "info" as const,
      output: "json" as const,
      onlyCategories: ["performance"],
      port: chrome.port,
      formFactor: normalizedDevice,
    };

    console.log("⚙️ Lighthouse configuration:", options);

    // ============================================
    // STEP 4: Run Lighthouse audit
    // ============================================
    console.log(`🔍 Running Lighthouse audit on: ${params.url}`);
    let runnerResult;
    try {
      runnerResult = await lighthouse(params.url, options);
    } catch (lighthouseError) {
      console.error(
        "❌ LIGHTHOUSE ERROR - Audit Execution Failed:",
        lighthouseError
      );
      throw new Error(
        `Lighthouse failed to complete the audit: ${
          lighthouseError instanceof Error
            ? lighthouseError.message
            : "Unknown error"
        }`
      );
    }

    // ============================================
    // STEP 5: Validate Lighthouse results
    // ============================================
    if (!runnerResult) {
      throw new Error("Lighthouse completed but returned no results");
    }

    const { lhr } = runnerResult;

    if (!lhr) {
      throw new Error(
        "Lighthouse results are missing the LHR (Lighthouse HTML Report) data"
      );
    }

    // Validate performance category exists
    if (!lhr.categories?.performance) {
      throw new Error("Lighthouse report is missing the performance category");
    }

    // Validate required audits exist
    const requiredAudits = [
      "first-contentful-paint",
      "largest-contentful-paint",
      "total-blocking-time",
      "cumulative-layout-shift",
    ];

    const missingAudits = requiredAudits.filter(
      (audit) => !lhr.audits?.[audit]
    );

    if (missingAudits.length > 0) {
      throw new Error(
        `Lighthouse report is missing required audits: ${missingAudits.join(
          ", "
        )}`
      );
    }

    // ============================================
    // STEP 6: Extract and return metrics
    // ============================================
    console.log("📊 Extracting performance metrics...");

    const results = {
      performanceScore: Math.round(
        (lhr.categories.performance.score ?? 0) * 100
      ),
      fcp: lhr.audits["first-contentful-paint"].numericValue ?? null,
      lcp: lhr.audits["largest-contentful-paint"].numericValue ?? null,
      tbt: lhr.audits["total-blocking-time"].numericValue ?? null,
      cls: lhr.audits["cumulative-layout-shift"].numericValue ?? null,
      fullReport: JSON.stringify(lhr),
    };

    console.log("✅ Lighthouse audit completed successfully:", {
      url: params.url,
      device: normalizedDevice,
      performanceScore: results.performanceScore,
    });

    return results;
  } catch (error) {
    console.error("❌ LIGHTHOUSE ERROR - Unexpected Error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw error;
  } finally {
    // ============================================
    // CLEANUP: Close Chrome browser
    // ============================================
    if (chrome) {
      try {
        await chrome.kill();
        console.log("✅ Chrome closed successfully");
      } catch (killError) {
        console.error(
          "⚠️ Warning - Failed to close Chrome cleanly:",
          killError
        );
      }
    }
  }
}
