import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Database } from "../database/database";
import { generateToken } from "../authentication/authentication";


export const register = async (req: Request, res: Response) => {
  console.log(req.body);
  const {name, email, country, password, confirm} = req.body;

  // input validation
  if (!name || !email || !password || !confirm) return res.status(400).send({message: "Please fill all fields"});
  const userName = await Database.useMySql(`SELECT name FROM users WHERE name = ?`, [name]);
  console.log(userName[0]);
  if (userName[0]) return res.status(400).send({message: "User already exists"});
  const userMail = await Database.useMySql("SELECT * FROM users WHERE email = ?", [email]);
  if (userMail[0]) return res.status(400).send({message: "Email already exists"});
  if (password !== confirm) return res.status(400).send({message: "Passwords do not match"});
    
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
  if (!email || !password) return res.status(400).send({message: "Please fill all fields"});
  const user = await Database.useMySql("SELECT * FROM users WHERE email = ?", [email])
  if (!user[0]) return res.status(400).send({message: "User not found"})
  
  // check if password is correct
  const isMatch = bcrypt.compareSync(password, user[0].password);
  if (!isMatch) return res.status(400).send({message: "Invalid password"})
  
  // generate and send token
  const token = generateToken(user[0]);
  res.json(token);
}
