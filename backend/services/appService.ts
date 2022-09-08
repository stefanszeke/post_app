import { Database } from "../database/database";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { COUNTRIES } from "./countries";

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
    if (!input.name || !input.email || !input.password || !input.confirm || !input.country) { res.json({message: "Please fill all fields"}); return false };
    if (input.name.length < 4) { res.json({message: "Name must be at least 4 characters"}); return false };

    const userName = await Database.useMySql(`SELECT name FROM users WHERE name = ?`, [input.name]);
    if (userName[0])  {res.json({message: "User already exists"}); return false };

    let emailRegex: RegExp = /[\w\.\-\%\!]+@\w+\.\w{2,}/;
    if (!emailRegex.test(input.email)) { res.json({message: "Invalid email"}); return false };

    const userMail = await Database.useMySql("SELECT * FROM users WHERE email = ?", [input.email]);
    if (userMail[0]) { res.json({message: "Email already exists"}); return false };

    if(input.password.length < 4) { res.json({message: "Password must be at least 4 characters"}); return false };
    if (input.password !== input.confirm) { res.json({message: "Passwords do not match"}); return false };

    if(!COUNTRIES.map(country => country.name).includes(input.country)) { res.json({message: "Country not found"}); return false };

    return true;
  }

  public static async loginValidation(res: Response, input: any) {
    if (!input.email || !input.password) { res.json({message: "Please fill all fields"}); return false };
    const user = await Database.useMySql("SELECT * FROM users WHERE email = ?", [input.email]);

    if (!user[0]) { res.json({message: "User not found"}); return false };

    const isMatch = bcrypt.compareSync(input.password, user[0].password);
    if (!isMatch) { res.json({message: "Invalid password"}); return false };

    return user[0];
  }

  public static getConnection() {
    if(process.env.NODE_ENV === 'development') return AppService.dockerConnection;
  }
}