import { Database } from "../database/database";
import { Response, Request } from "express";
import bcrypt from "bcrypt";

export default class AppService {
  constructor() {}


  public static async registerValidation(res: Response, input: any) {
    if (!input.name || !input.email || !input.password || !input.confirm) { res.status(400).send({message: "Please fill all fields"}); return false };

    const userName = await Database.useMySql(`SELECT name FROM users WHERE name = ?`, [input.name]);
    if (userName[0])  {res.status(400).send({message: "User already exists"}); return false };

    const userMail = await Database.useMySql("SELECT * FROM users WHERE email = ?", [input.email]);
    if (userMail[0]) { res.status(400).send({message: "Email already exists"}); return false };
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
}