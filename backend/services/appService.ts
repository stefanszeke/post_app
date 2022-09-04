import { Database } from "../database/database";
import { Response, Request } from "express";
import bcrypt from "bcrypt";

export default class AppService {

  private static dockerConnection: any = {
    host: 'localhost',
    database: 'post_app',
    user: 'admin',
    password: 'admin',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3398
  }

  constructor() {}

  public static async registerValidation(res: Response, input: any) {
    if (!input.name || !input.email || !input.password || !input.confirm) { res.status(400).send({message: "Please fill all fields"}); return false };
    if (input.name.length < 4) { res.status(400).send({message: "Name must be at least 4 characters"}); return false };

    const userName = await Database.useMySql(`SELECT name FROM users WHERE name = ?`, [input.name]);
    if (userName[0])  {res.status(400).send({message: "User already exists"}); return false };

    const userMail = await Database.useMySql("SELECT * FROM users WHERE email = ?", [input.email]);
    if (userMail[0]) { res.status(400).send({message: "Email already exists"}); return false };

    if(input.password.length < 4) { res.status(400).send({message: "Password must be at least 4 characters"}); return false };
    if (input.password !== input.confirm) { res.status(400).send({message: "Passwords do not match"}); return false };

    return true;
  }

  public static async loginValidation(res: Response, input: any) {
    if (!input.email || !input.password) { res.status(400).send({message: "Please fill all fields"}); return false };
    const user = await Database.useMySql("SELECT * FROM users WHERE email = ?", [input.email]);

    if (!user[0]) { res.status(400).send({message: "User not found"}); return false };

    const isMatch = bcrypt.compareSync(input.password, user[0].password);
    if (!isMatch) { res.status(400).send({message: "Invalid password"}); return false };

    return user[0];
  }

  public static getConnection() {
    if(process.env.NODE_ENV === 'development') return AppService.dockerConnection;
  }
}