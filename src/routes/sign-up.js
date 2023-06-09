const { Layout } = require("../templates.js");
const { createUser } = require("../model/user.js");
const { createSession} = require("../model/session.js");
const bcrypt = require("bcryptjs");

function get(req, res) {
  const title = "Create an account";
  const content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      <form method="POST" class="Row">
        <div class="Stack" style="--gap: 0.25rem">
          <label for="email">email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="Stack" style="--gap: 0.25rem">
          <label for="password">password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button class="Button">Sign up</button>
      </form>
    </div>
  `;
  const body = Layout({ title, content });
  res.send(body);
}

function post(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Bad input");
  } else {
    // Get password hash
    bcrypt.hash(password, 12).then((passwordHash) => {
      // Create user in users and get id value returned
      const userId = createUser(email, passwordHash)["id"];

      // Create session in sessions
      const sessionId = createSession(userId);

      // Set signed cookie with session Id
      res.cookie("sid", sessionId, {
        signed: true,
        httpOnly: true,
        maxAge: 6000,
        sameSite: "lax",
      });
      res.redirect(`/confessions/${userId}`);
    });
    //res.send("to-do");
    /**
     * [1] Hash the password
     * [2] Create the user in the DB
     * [3] Create the session with the new user's ID
     * [4] Set a cookie with the session ID
     * [5] Redirect to the user's confession page (e.g. /confessions/3)
     */
  }
}

module.exports = { get, post };
