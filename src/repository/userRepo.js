import db from "../db/connection.js";
import { NOT_DELETED } from "../utils/constants.js";

function findByEmail(email) {
    const query = `
        SELECT id, email, password, role_id, status, created_at
        FROM users
        WHERE email = ?
        AND ${NOT_DELETED}
    `;

    return db.prepare(query).get(email) || null;
}

function findById(userId) {
    const query = `
        SELECT id, role_id, status
        FROM users
        WHERE id = ?
        AND ${NOT_DELETED}
    `
    return db.prepare(query).get(userId) || null;
}

function createUser(email, password, roleId) {
    const query = `
        INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)
    `

    const result = db.prepare(query).run(
        email,
        password,
        roleId,
    );
    return result.lastInsertRowid;
}

function getAllUsers() {
    const query = `
        SELECT
            u.id,
            u.email,
            r.role_name as role,
            u.status
        FROM users u
        LEFT JOIN role r ON u.role_id = r.id
        WHERE u.deleted_at IS NULL
    `
    return db.prepare(query).all();
}

function getUserById(userId) {
    const query = `
        SELECT
            u.id,
            u.email,
            u.status,
            r.role_name as role,
            u.created_at
        FROM users u
        LEFT JOIN role r ON u.role_id = r.id
        WHERE u.id = ?
        AND ${NOT_DELETED}
    `;

    return db.prepare(query).get(userId) || null;
}

function updateUserById(userId, { role_id, status }) {
    const query = `
        UPDATE users
        SET role_id = COALESCE(?, role_id),
            status = COALESCE(?, status)
        WHERE id = ?
        AND deleted_at IS NULL
    `;

    return db.prepare(query).run(role_id, status, userId);
}

function deleteUserById(userId) {
    const query = `UPDATE users
        SET
            deleted_at = strftime('%s', 'now'),
            status = 'inactive'
        WHERE id = ?
        AND ${NOT_DELETED}
    `;

    const result = db.prepare(query).run(userId);

    return result.changes; // number of rows affected
}


export { createUser, deleteUserById, findByEmail, findById, getAllUsers, getUserById, updateUserById };



