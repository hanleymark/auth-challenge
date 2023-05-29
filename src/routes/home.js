const { Layout } = require("../templates.js");
const { getSession, removeExpiredSessions} = require("../model/session.js");

function get(req, res) {
  /**
   * [1] Read session ID from cookie
   * [2] Get session from DB
   * [3] If the session exists render a log out form
   * [4] This should submit a request to `POST /log-out`
   * [5] Else render the sign up/log in links
   */

  removeExpiredSessions();
  //removeAllSessions();

  const sessionId = req.signedCookies.sid;
  console.log(`SessionId in home.js: ${sessionId}`);

  let title;
  let content;
  let body;

  const session = getSession(sessionId);

  console.log(`Session in home.js: ${session}`);

  if (session) {
    // There is currently a valid session so offer logout
    const logoutForm = /*html*/ `
      <form method="POST" action="/log-out">
        <button class="Button">Log out</button>
      </form>`;

    title = "Log out";
    content = /*html*/ `
      <div class="Cover">
        <h1>${title}</h1>
        ${logoutForm}
      </div>
      `;
  } else {

    title = "Confess your secrets!";
    content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      <nav><a href="/sign-up">Sign up</a> or <a href="/log-in">log in</a></nav>
    </div>
  `;
  }
    
  body = Layout({ title, content });
  res.send(body);
}

module.exports = { get };
