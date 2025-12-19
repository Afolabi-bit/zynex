// app/api/test/run-lighthouse/route.ts
import { NextResponse } from "next/server";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

export async function POST(request: Request) {
  let chrome: chromeLauncher.LaunchedChrome | null = null;

  try {
    // ============================================
    // STEP 1: Parse and validate request body
    // ============================================
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("❌ LIGHTHOUSE ERROR - JSON Parse Failed:", parseError);
      return NextResponse.json(
        {
          error: "INVALID REQUEST BODY",
          message: "Failed to parse JSON request body",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
          step: "request_parsing",
        },
        { status: 400 }
      );
    }

    const { url, device, network } = body;

    // ============================================
    // STEP 2: Validate required parameters
    // ============================================
    if (!url || typeof url !== "string" || url.trim() === "") {
      console.error("❌ LIGHTHOUSE ERROR - Missing or Invalid URL:", {
        url,
        receivedBody: body,
      });
      return NextResponse.json(
        {
          error: "MISSING URL PARAMETER",
          message:
            "The 'url' parameter is required and must be a non-empty string",
          received: { url, type: typeof url },
          step: "input_validation",
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      console.error("❌ LIGHTHOUSE ERROR - Invalid URL Format:", {
        url,
        error: urlError,
      });
      return NextResponse.json(
        {
          error: "INVALID URL FORMAT",
          message: `The provided URL is not valid: "${url}"`,
          details:
            urlError instanceof Error ? urlError.message : "URL parsing failed",
          step: "url_validation",
        },
        { status: 400 }
      );
    }

    if (!device || !["mobile", "desktop"].includes(device.toLowerCase())) {
      console.error("❌ LIGHTHOUSE ERROR - Invalid Device Type:", {
        device,
        receivedBody: body,
        allowedValues: ["mobile", "desktop"],
      });
      return NextResponse.json(
        {
          error: "INVALID DEVICE PARAMETER",
          message:
            "The 'device' parameter must be either 'mobile' or 'desktop'",
          received: { device, type: typeof device },
          allowedValues: ["mobile", "desktop"],
          step: "input_validation",
        },
        { status: 400 }
      );
    }

    const normalizedDevice = device.toLowerCase() as "mobile" | "desktop";

    console.log("✅ Input validation passed:", {
      url,
      device: normalizedDevice,
      network,
    });

    // ============================================
    // STEP 3: Launch Chrome browser
    // ============================================
    console.log("🚀 Attempting to launch Chrome...");
    try {
      chrome = await chromeLauncher.launch({
        chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
      });
      console.log("✅ Chrome launched successfully on port:", chrome.port);
    } catch (chromeError) {
      console.error("❌ LIGHTHOUSE ERROR - Chrome Launch Failed:", chromeError);
      return NextResponse.json(
        {
          error: "CHROME LAUNCH FAILED",
          message: "Failed to launch Chrome browser for Lighthouse testing",
          details:
            chromeError instanceof Error
              ? chromeError.message
              : "Unknown Chrome error",
          possibleCauses: [
            "Chrome/Chromium is not installed on the server",
            "Insufficient system permissions to launch Chrome",
            "Missing required system dependencies",
            "Port conflict preventing Chrome from starting",
          ],
          step: "chrome_launch",
        },
        { status: 500 }
      );
    }

    // ============================================
    // STEP 4: Configure Lighthouse options
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
    // STEP 5: Run Lighthouse audit
    // ============================================
    console.log(`🔍 Running Lighthouse audit on: ${url}`);
    let runnerResult;
    try {
      runnerResult = await lighthouse(url, options);
    } catch (lighthouseError) {
      console.error(
        "❌ LIGHTHOUSE ERROR - Audit Execution Failed:",
        lighthouseError
      );
      try {
        await chrome.kill();
      } catch (killError) {
        console.error(
          "⚠️ Failed to kill Chrome after Lighthouse error:",
          killError
        );
      }
      return NextResponse.json(
        {
          error: "LIGHTHOUSE AUDIT FAILED",
          message: `Lighthouse failed to complete the audit for URL: ${url}`,
          details:
            lighthouseError instanceof Error
              ? lighthouseError.message
              : "Unknown Lighthouse error",
          url,
          device: normalizedDevice,
          possibleCauses: [
            "Target website is unreachable or returned an error",
            "Website took too long to load (timeout)",
            "Website blocked headless browsers",
            "Network connectivity issues",
            "Invalid SSL certificate on target site",
          ],
          step: "lighthouse_execution",
        },
        { status: 500 }
      );
    }

    // ============================================
    // STEP 6: Close Chrome browser
    // ============================================
    try {
      await chrome.kill();
      console.log("✅ Chrome closed successfully");
    } catch (killError) {
      console.error("⚠️ Warning - Failed to close Chrome cleanly:", killError);
      // Continue anyway since we have results
    }

    // ============================================
    // STEP 7: Validate Lighthouse results
    // ============================================
    if (!runnerResult) {
      console.error("❌ LIGHTHOUSE ERROR - No Results Returned:", {
        url,
        device: normalizedDevice,
      });
      return NextResponse.json(
        {
          error: "NO LIGHTHOUSE RESULTS",
          message: "Lighthouse completed but returned no results",
          url,
          device: normalizedDevice,
          step: "result_validation",
        },
        { status: 500 }
      );
    }

    const { lhr } = runnerResult;

    if (!lhr) {
      console.error(
        "❌ LIGHTHOUSE ERROR - Missing LHR (Lighthouse Report):",
        runnerResult
      );
      return NextResponse.json(
        {
          error: "MISSING LIGHTHOUSE REPORT",
          message:
            "Lighthouse results are missing the LHR (Lighthouse HTML Report) data",
          step: "result_validation",
        },
        { status: 500 }
      );
    }

    // ============================================
    // STEP 8: Extract and validate metrics
    // ============================================
    console.log("📊 Extracting performance metrics...");

    // Validate performance category exists
    if (!lhr.categories?.performance) {
      console.error(
        "❌ LIGHTHOUSE ERROR - Missing Performance Category:",
        lhr.categories
      );
      return NextResponse.json(
        {
          error: "MISSING PERFORMANCE CATEGORY",
          message: "Lighthouse report is missing the performance category",
          availableCategories: Object.keys(lhr.categories || {}),
          step: "metric_extraction",
        },
        { status: 500 }
      );
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
      console.error("❌ LIGHTHOUSE ERROR - Missing Required Audits:", {
        missing: missingAudits,
        available: Object.keys(lhr.audits || {}),
      });
      return NextResponse.json(
        {
          error: "MISSING REQUIRED AUDITS",
          message: "Lighthouse report is missing required performance audits",
          missingAudits,
          availableAudits: Object.keys(lhr.audits || {}).slice(0, 20), // First 20 for brevity
          step: "metric_extraction",
        },
        { status: 500 }
      );
    }

    // Extract metrics with additional validation
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
      url,
      device: normalizedDevice,
      performanceScore: results.performanceScore,
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    // ============================================
    // CATCH-ALL ERROR HANDLER
    // ============================================
    console.error("❌ LIGHTHOUSE ERROR - Unexpected Error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Attempt to close Chrome if it's still running
    if (chrome) {
      try {
        await chrome.kill();
        console.log("✅ Chrome closed after error");
      } catch (killError) {
        console.error("⚠️ Failed to close Chrome after error:", killError);
      }
    }

    return NextResponse.json(
      {
        error: "UNEXPECTED LIGHTHOUSE ERROR",
        message: "An unexpected error occurred while running Lighthouse",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        step: "unknown",
      },
      { status: 500 }
    );
  }
}

// Increase timeout for Vercel (if deploying there)
export const maxDuration = 60; // 60 seconds
