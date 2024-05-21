import express from "express";
import { BadRequestError, NotFoundError } from "../expressError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const SECRET_KEY = process.env.SECRET_KEY;
const router = new express.Router();

/** POST /login: {username, password} => {token} */

// take username
// query for user record; if false, error; if true, generate token
// return

router.post("/login",
  async function (req, res) {
    if (req.body === undefined) {
      throw new BadRequestError("No request body.");
    }

    const { username, password } = req.body;

    const is_auth = await User.authenticate(username, password);

    if (is_auth === false) {
      throw new NotFoundError("Username or password invalid");
    }

    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  }
);


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

export default router;
