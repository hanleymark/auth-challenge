const db = require("../database/db.js");
const crypto = require("node:crypto");

const insert_session = db.prepare(/*sql*/
  `
  INSERT INTO sessions (id, user_id, expires_at)
  VALUES (
    $id,
    $user_id,
    DATE('now', '+7 days')
  )`);

function createSession(userId) {
  const sessionId = crypto.randomBytes(18).toString("base64");
  console.log(`Inserting sessionId: ${sessionId} for user: ${userId}`);
  insert_session.run({
    id: sessionId,
    user_id: userId
  });
  return sessionId;
}

const select_session = db.prepare(`
  SELECT id, user_id, expires_at
  FROM sessions WHERE id = ?
`);

function getSession(sid) {
  const session = select_session.get(sid);
  console.log(session);
  return session;
}

const delete_session = db.prepare(`
  DELETE FROM sessions WHERE id = ?
`);

function removeSession(sid) {
  console.log(`Removing session: ${sid}`);
  return delete_session.run(sid);
}

const delete_expired_sessions = db.prepare(`
  DELETE FROM sessions WHERE expires_at < DATE('now')
`);

function removeExpiredSessions() {
  return delete_expired_sessions.run();
}

const delete_all_sessions = db.prepare(`
  DELETE FROM sessions
`);

function removeAllSessions() {
  return delete_all_sessions.run();
}

module.exports = { createSession, getSession, removeSession, removeExpiredSessions, removeAllSessions };
