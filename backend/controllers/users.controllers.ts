import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Database } from "../database/database";
import Authentication from "../authentication/authentication";
import AppService from "../services/appService";


export const register = async (req: Request, res: Response) => {
  try{ 

    const {name, email, country, password, confirm} = req.body;

    // input validation
    const validation = await AppService.registerValidation(res, {name, email, country, password, confirm});
    if(!validation) return;

    // hashing passwordgit a
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // insert user into database
    const user = {name,email,country,password: hash, upvoted: '0', downvoted: '0'};
    await Database.useMySql("INSERT INTO users SET ?", user);
    res.json({message: "User created"});

  } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}

export const login = async (req: Request, res: Response) => {
  try{ 
    
    const {email, password} = req.body;

    // input validation
    const user = await AppService.loginValidation(res, {email, password});
    if(!user) return;
    
    // generate and send token
    const token = Authentication.generateToken(user);
    res.cookie("token", token, {maxAge: 3600000, sameSite: 'none', secure: process.env.NODE_ENV === 'production'});
    res.cookie("name", user.name, {maxAge: 3600000, sameSite: 'none', secure: process.env.NODE_ENV === 'production'});
    res.json({message: "User logged in"});

  } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}

export const sendVotes = async (req: Request, res: Response) => {
  try{ 

    const {user_id} = req.body;
    const userVotes = await Database.useMySql("SELECT upvoted,downvoted FROM users WHERE id = ?", [user_id]);
    res.json({upvoted: userVotes[0].upvoted.split(","), downvoted: userVotes[0].downvoted.split(",")} );

 } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}