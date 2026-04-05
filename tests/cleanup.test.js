import db from "../src/db/connection.js";

function cleanupSoftDeleted(now) {
    const THIRTY_DAYS = 30 * 24 * 60 * 60;
    const cutoff = now - THIRTY_DAYS;

    db.prepare(`
        DELETE FROM users
        WHERE deleted_at IS NOT NULL
        AND deleted_at < ?
    `).run(cutoff);

    db.prepare(`
        DELETE FROM records
        WHERE deleted_at IS NOT NULL
        AND deleted_at < ?
    `).run(cutoff);
}


test("cleanup should remove old soft deleted users", () => {
    const now = Math.floor(Date.now() / 1000);
    const oldTimestamp = now - (31 * 24 * 60 * 60);

    const userId = db.prepare(`
        INSERT INTO users (email, password, deleted_at)
        VALUES ('old@test.com', 'pass', ?)
    `).run(oldTimestamp).lastInsertRowid;

    cleanupSoftDeleted(now);

    const user = db.prepare(`
        SELECT * FROM users WHERE id = ?
    `).get(userId);

    expect(user).toBeUndefined();
});

test("cleanup should NOT remove recent soft deleted users", () => {
    const now = Math.floor(Date.now() / 1000);
    const recent = now - (5 * 24 * 60 * 60);

    const userId = db.prepare(`
        INSERT INTO users (email, password, deleted_at)
        VALUES ('recent@test.com', 'pass', ?)
    `).run(recent).lastInsertRowid;

    cleanupSoftDeleted(now);

    const user = db.prepare(`
        SELECT * FROM users WHERE id = ?
    `).get(userId);

    expect(user).toBeDefined();
});