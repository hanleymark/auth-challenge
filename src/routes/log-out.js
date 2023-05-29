const { removeSession } = require("../model/session.js");

function post(req, res) {
  /**
   * [1] Get the session ID from the cookie
   * [2] Remove that session from the DB
   * [3] Remove the session cookie
   * [4] Redirect back home
   */
  console.log("log-out post handler");

  const sessionId = req.session.id;

  console.log(`SessionId in log-out.js: ${sessionId}`);

  console.log(`Removing session ${sessionId}`);
  removeSession(sessionId);
  res.clearCookie("sid");
  res.redirect("/");
  //res.status(500).send("");
}
module.exports = { post };
