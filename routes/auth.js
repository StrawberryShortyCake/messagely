import express from "express";

import { BadRequestError, NotFoundError } from "../expressError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { SECRET_KEY } from "../config.js";

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

router.post("/register",
  async function (req, res) {
    if (!req.body) {
      throw new BadRequestError();
    };

    const user = await User.register(
      req.body.username,
      req.body.password,
      req.body.first_name,
      req.body.last_name,
      req.body.phone
    );

    await User.authenticate(req.body.username, req.body.password);

    const token = jwt.sign({
      username: user.username,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone
    },
      SECRET_KEY);

    return res.json({ token });
  }
);

export default router;
