import bcrypt from "bcrypt";
import { BCRYPT_WORK_FACTOR } from "../config.js";
import db from "../db.js";
import { UnauthorizedError, NotFoundError } from "../expressError.js";


/** User of the site. */


class User {

  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (
        username,
        password,
        first_name,
        last_name,
        phone
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING username`,
      [username, hashedPassword, first_name, last_name, phone]
    );

    return result.rows[0];
  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {

    const result = db.query(
      `SELECT password
        FROM users
        WHERE username = $1`,
      [username]
    );

    const hashedPassword = result.rows[0];

    if (password && (await bcrypt.compare(password, password.password)) === true) {
      return true;
    }

    throw new UnauthorizedError("Invalid username/password");

  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {

    await db.query(`
      UPDATE users
      SET last_login_at=current_timestamp
      WHERE username=$2`,
      [username]);

    // TODO: check whether we need to validate the db update
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
    const results = await db.query(`
    SELECT username,
           first_name AS "firstName",
           last_name AS "lastName"
    FROM users
    ORDER BY username, last_name`
    );
    return results.rows.map((u) => {
      return {
        username: u.username,
        first_name: u.firstName,
        last_name: u.lastName
      };
    });
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {

    const result = db.query(`
      SELECT username, first_name, last_name, phone, join_at, last_login_at
      FROM users
      WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      throw new NotFoundError;
    }

    return new User(user);
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {

    const msgResults = await db.query(`
      SELECT m.id, m.to_username AS to_user, m.body, m.sent_at, m.read_at
      FROM users AS u
      JOIN messages AS m
      ON m.from_username = u.username
      WHERE u.username=$1
      ORDER BY m.id`,
      [username]);

    const resultPromises = msgResults.rows.map((msgResult) => async function () {
      msgResult.to_users = await db.query(`
      SELECT username, first_name, last_name, phone
      FROM users
      WHERE username = $1
      ORDER BY username`,
        [msgResult.to_user]);
    });

    const results = Promise.all(resultPromises);

    return results;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {

    const msgResults = await db.query(`
      SELECT m.id, m.from_username AS from_user, m.body, m.sent_at, m.read_at
      FROM users AS u
      JOIN messages AS m
      ON m.to_username = u.username
      WHERE u.username=$1
      ORDER BY m.id`,
      [username]);

    const resultPromises = msgResults.rows.map((msgResult) => async function () {
      msgResult.from_user = await db.query(`
      SELECT username, first_name, last_name, phone
      FROM users
      WHERE username = $1
      ORDER BY username`,
        [msgResult.from_user]);
    });

    const results = Promise.all(resultPromises);

    return results;
  }
}

export default User;
