const {
  listConfessions,
  createConfession,
} = require("../model/confessions.js");
const { Layout } = require("../templates.js");
const { getSession } = require("../model/session.js");

function get(req, res) {
  /**
   * Currently any user can view any other user's private confessions!
   * We need to ensure only the logged in user can see their page.
   * [1] Get the session ID from the cookie
   * [2] Get the session from the DB
   * [3] Get the logged in user's ID from the session
   * [4] Get the page owner from the URL params
   * [5] If the logged in user is not the page owner send a 401 response
   */

  const session = req.session;
  console.log(`Session in confessions.js: ${session}`);
  if (!session) {
    res.status(401).send("You can't view other people's secrets!");
    return;
  }
  const current_user = session.user_id;
  const page_owner = Number(req.params.user_id);
  if (current_user !== page_owner) {
    res.status(401).send("You can't view other people's secrets!");
    return;
  }

  //   const sessionId = req.signedCookies.sid;
  //   if (sessionId) {
  //   const session = getSession(sessionId);
  //   const current_user = session.user_id;
  //   const page_owner = Number(req.params.user_id);
  //   if (current_user !== page_owner) {
  //     res.status(401).send("You can't view other people's secrets!");
  //   }
  // }
  // else {
  //   res.status(401).send("You can't view other people's secrets!");
  // }

  const confessions = listConfessions(req.params.user_id);
  const title = "Your secrets";
  const content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      <form method="POST" class="Stack" style="--gap: 0.5rem">
        <textarea name="content" aria-label="your confession" rows="4" cols="30" style="resize: vertical"></textarea>
        <button class="Button">Confess 🤫</button>
      </form>
      <ul class="Center Stack">
        ${confessions
          .map(
            (entry) => `
            <li>
              <h2>${entry.created_at}</h2>
              <p>${entry.content}</p>
            </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;
  const body = Layout({ title, content });
  res.send(body);
}

function post(req, res) {
  /**
   * Currently any user can POST to any other user's confessions (this is bad!)
   * We can't rely on the URL params. We can only trust the cookie.
   * [1] Get the session ID from the cookie
   * [2] Get the session from the DB
   * [3] Get the logged in user's ID from the session
   * [4] Use the user ID to create the confession in the DB
   * [5] Redirect back to the logged in user's confession page
   */
  let session = req.session;
  let current_user;

  if (session) {
    const sessionId = req.session.id;

    if (sessionId) {
      current_user = session.user_id;
    }
  } else {
    res.status(401).send("You can't post confessions if you're not logged in!");
    return;
  }
  createConfession(req.body.content, current_user);
  res.redirect(`/confessions/${current_user}`);
  return;
}

module.exports = { get, post };
