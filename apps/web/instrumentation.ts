// apps/web/instrumentation.ts

export async function register() {
  // Only run in Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("🔧 [Server] Initializing server instrumentation...");

    // Import dynamically to avoid edge runtime issues
    const { prisma } = await import("@workspace/db");
    const { startExamStatusUpdater } =
      await import("@/lib/exam-status-updater");

    // Start the cron job
    startExamStatusUpdater(prisma);

    console.log("✅ [Server] Server initialized successfully");
  }
}
