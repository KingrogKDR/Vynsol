import dotenv from "dotenv";
import app from "./app.js";
import { initDB, seedDB } from "./db/db.js";
import { startCleanupJob } from "./jobs/cleanup.job.js";

dotenv.config()

initDB();
seedDB();

startCleanupJob();

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});

export default app;

