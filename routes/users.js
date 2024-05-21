import { Router } from "express";
import User from "../models/user.js";
import { ensureLoggedIn, ensureCorrectUser } from "../middleware/auth.js";

const router = new Router();


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name}, ...]}
 *
 **/

router.get("/",
  async function (req, res) {

    const results = await User.all();

    return res.json({ users: results });
  }
);


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username",
  async function (req, res) {

    const username = req.params.username;
    console.log("getting username for /username route", username);

    const results = await User.get(username);

    return res.json({ users: results });
  }
);



/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/to",
  async function (req, res) {

    const username = req.params.username;
    console.log("getting username for /username/to route", username);

    const results = await User.messagesTo(username);

    return res.json({ messages: results });
  }
);


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/from",
  async function (req, res) {

    const username = req.params.username;
    console.log("getting username for /username/from route", username);

    const results = await User.messagesTo(username);

    return res.json({ messages: results });
  }
);

export default router;