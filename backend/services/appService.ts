import { Database } from "../database/database";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { COUNTRIES } from "./countries";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/user";
import { UserVotes } from "../models/userVotes";
import { Vote } from "../models/vote";
import { loginInput, registerInput } from "../models/inputs";

export default class AppService {

  private static dockerConnection: mysql.ConnectionOptions = {
    host: 'localhost',
    database: 'post_app',
    user: 'admin',
    password: 'admin',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3398
  }

  private static mysqlConnection: mysql.ConnectionOptions = {
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }

  constructor() {}

  public static async registerValidation(res: Response, input: registerInput): Promise<boolean> {
    if (!input.name || !input.email || !input.password || !input.confirm || !input.country) { res.json({message: "Please fill all fields"}); return false };
    if (input.name.length < 4) { res.json({message: "Name must be at least 4 characters"}); return false };
    if (input.name.length > 16) { res.json({message: "Name can't be longer than 16 characters"}); return false };

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

  public static async loginValidation(res: Response, input: loginInput): Promise<false | User> {
    if (!input.email || !input.password) { res.json({message: "Please fill all fields"}); return false };
    const user: User[] = await Database.useMySql("SELECT * FROM users WHERE email = ?", [input.email]);

    if (!user[0]) { res.json({message: "User not found"}); return false };

    const isMatch = bcrypt.compareSync(input.password, user[0].password);
    if (!isMatch) { res.json({message: "Invalid password"}); return false };

    return user[0];
  }

  public static async postValidation(res: Response, input: any): Promise<boolean> {
    if (!input.title || !input.text) { res.json({message: "Please fill all the fields"}); return false };
    if (input.title.length > 40) { res.json({message: "Title too long"}); return false };
    if (input.text.length > 250) { res.json({message: "Text too long"}); return false };
    return true;
  }

  public static getUserVotesAndScore(req: Request, userVotes: UserVotes) {
    const post_id = req.params.id
    const vote: Vote = req.body.vote;

    let upvotes:string[] = [...userVotes.upvoted.split(",")];
    let downvotes:string[] = userVotes.downvoted.split(",");
    let score: number = 0;

    if(vote === "up") {
      if(!upvotes.includes(post_id)) { upvotes.push(post_id); score = 1 }
      else if(upvotes.includes(post_id)) { upvotes.splice(upvotes.indexOf(post_id), 1); score = -1 }
      if(downvotes.includes(post_id)) { downvotes.splice(downvotes.indexOf(post_id), 1); score += 1 }
    }
    
    
    if(vote === "down") {
      if(!downvotes.includes(post_id)) { downvotes.push(post_id); score = -1 }
      else if(downvotes.includes(post_id)) { downvotes.splice(downvotes.indexOf(post_id), 1); score = + 1 }
      if(upvotes.includes(post_id)) { upvotes.splice(upvotes.indexOf(post_id), 1); score -= 1 }
    }
    let upvoted = upvotes.join(",");
    let downvoted = downvotes.join(",");

    return { upvoted, downvoted, score };
  }



  public static getConnection(): mysql.ConnectionOptions | undefined {
    if(process.env.NODE_ENV === 'development') return AppService.dockerConnection;
    if(process.env.NODE_ENV === 'production') return AppService.mysqlConnection;
  }

  public static serverLog(): void {
    if(process.env.NODE_ENV === 'development') console.log('\x1b[32m%s\x1b[0m', ` ⇒ App listening on Port ${process.env.PORT || 3700}, env: ${process.env.NODE_ENV}`);
    if(process.env.NODE_ENV === 'production') console.log(`App listening on Port ${process.env.PORT || 3700}, env: ${process.env.NODE_ENV}`);
  }
}