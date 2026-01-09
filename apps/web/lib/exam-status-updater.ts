// apps/web/lib/exam-status-updater.ts

import { PrismaClient } from "@workspace/db";
import { EXAM_STATUS } from "@workspace/utils/constant";
import * as cron from "node-cron";

let statusUpdateJob: cron.ScheduledTask | null = null;

/**
 * Update exam statuses based on current time
 */
async function updateExamStatuses(db: PrismaClient) {
  try {
    const now = new Date();

    // Update Upcoming → Ongoing (exams that have started)
    const startedExams = await db.exam.updateMany({
      where: {
        status: EXAM_STATUS.Upcoming,
        startDate: {
          lte: now,
        },
      },
      data: {
        status: EXAM_STATUS.Ongoing,
      },
    });

    if (startedExams.count > 0) {
      console.log(`✅ [Cron] Updated ${startedExams.count} exam(s) to Ongoing`);
    }

    // Update Ongoing → Completed (exams that have ended)
    // const completedExams = await db.exam.updateMany({
    //   where: {
    //     status: EXAM_STATUS.Ongoing,
    //     endDate: {
    //       gte: now,
    //     },
    //   },
    //   data: {
    //     status: EXAM_STATUS.Completed,
    //   },
    // });

    // if (completedExams.count > 0) {
    //   console.log(
    //     `✅ [Cron] Updated ${completedExams.count} exam(s) to Completed`
    //   );
    // }

    // // Log if no updates (optional, for debugging)
    // if (startedExams.count === 0 && completedExams.count === 0) {
    //   console.log(
    //     `⏰ [Cron] Checked at ${now.toISOString()} - No status updates needed`
    //   );
    // }
  } catch (error) {
    console.error("❌ [Cron] Error updating exam statuses:", error);
  }
}

/**
 * Start the background job
 */
export function startExamStatusUpdater(db: PrismaClient) {
  if (statusUpdateJob) {
    console.log("⚠️ [Cron] Exam status updater already running");
    return;
  }

  // Run every minute: "* * * * *"
  // Cron format: minute hour day month day-of-week
  statusUpdateJob = cron.schedule("* * * * *", async () => {
    await updateExamStatuses(db);
  });

  // Run immediately on start
  updateExamStatuses(db);

  console.log("🚀 [Cron] Exam status updater started (runs every minute)");
}

/**
 * Stop the background job
 */
export function stopExamStatusUpdater() {
  if (statusUpdateJob) {
    statusUpdateJob.stop();
    statusUpdateJob = null;
    console.log("🛑 [Cron] Exam status updater stopped");
  }
}

/**
 * Manually trigger update (for testing)
 */
export async function manuallyUpdateExamStatuses(db: PrismaClient) {
  console.log("🔄 [Cron] Manually updating exam statuses...");
  await updateExamStatuses(db);
}
