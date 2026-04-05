import cron from "node-cron";
import db from "../db/connection.js";

const THIRTY_DAYS = 30 * 24 * 60 * 60;

export function startCleanupJob() {
    cron.schedule("1 2 * * *", () => {
        console.log("[CRON] Running cleanup job...");

        const now = Math.floor(Date.now() / 1000);
        const cutoff = now - THIRTY_DAYS;

        const deleteUsers = db.prepare(`
            DELETE FROM users
            WHERE deleted_at IS NOT NULL
            AND deleted_at < ?
        `);

        const deleteRecords = db.prepare(`
            DELETE FROM records
            WHERE deleted_at IS NOT NULL
            AND deleted_at < ?
        `);

        deleteUsers.run(cutoff);
        deleteRecords.run(cutoff);

        console.log("[CRON] Cleanup completed");
    });
}