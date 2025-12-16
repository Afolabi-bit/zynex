// app/api/test/run-lighthouse/route.ts
import { NextResponse } from "next/server";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, device, network } = body;

    // Validate input
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!device || !["mobile", "desktop"].includes(device)) {
      return NextResponse.json(
        { error: "Valid device type required (mobile or desktop)" },
        { status: 400 }
      );
    }

    // Launch Chrome
    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
    });

    // Configure Lighthouse
    const options = {
      logLevel: "info" as const,
      output: "json" as const,
      onlyCategories: ["performance"],
      port: chrome.port,
      formFactor: device as "mobile" | "desktop",
    };

    // Run Lighthouse
    const runnerResult = await lighthouse(url, options);

    // Close Chrome
    await chrome.kill();

    // Check if runnerResult exists
    if (!runnerResult) {
      return NextResponse.json(
        { error: "Lighthouse failed to return results" },
        { status: 500 }
      );
    }

    // Extract metrics
    const { lhr } = runnerResult;

    const results = {
      performanceScore: Math.round(
        (lhr.categories.performance.score ?? 0) * 100
      ),
      fcp: lhr.audits["first-contentful-paint"].numericValue,
      lcp: lhr.audits["largest-contentful-paint"].numericValue,
      tbt: lhr.audits["total-blocking-time"].numericValue,
      cls: lhr.audits["cumulative-layout-shift"].numericValue,
      fullReport: JSON.stringify(lhr),
    };

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Lighthouse error:", error);
    return NextResponse.json(
      {
        error: "Failed to run Lighthouse",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Increase timeout for Vercel (if deploying there)
export const maxDuration = 60; // 60 seconds
