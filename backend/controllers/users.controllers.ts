import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Database } from "../database/database";
import Authentication from "../authentication/authentication";
import AppService from "../services/appService";


export const register = async (req: Request, res: Response) => {
  const {name, email, country, password, confirm} = req.body;

  // input validation
  const validation = await AppService.registerValidation(res, {name, email, country, password, confirm});
  if(!validation) return;

  // hashing password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  // insert user into database
  const user = {name,email,country,password: hash}
  await Database.useMySql("INSERT INTO users SET ?", user);
  res.json({message: "User created"});
}

export const login = async (req: Request, res: Response) => {
  const {email, password} = req.body;

  // input validation
  const user = await AppService.loginValidation(res, {email, password});
  if(!user) return;
  
  // generate and send token
  const token = Authentication.generateToken(user);
  res.json(token);
}
