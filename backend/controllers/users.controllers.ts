import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Database } from "../database/database";
import Authentication from "../authentication/authentication";
import AppService from "../services/appService";
import { User } from "../models/user";
import { loginInput, registerInput } from "../models/inputs";
import { UserVotes } from "../models/userVotes";


export const register = async (req: Request, res: Response) => {
  try{ 

    const {name, email, country, password, confirm} = req.body;
    const registerInput: registerInput = {name, email, country, password, confirm};

    // input validation
    const validation: boolean = await AppService.registerValidation(res, registerInput);
    if(!validation) return;

    // hashing password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // insert user into database
    const user: User = {name,email,country,password: hash, upvoted: '0', downvoted: '0'};
    await Database.useMySql("INSERT INTO users SET ?", user);
    res.json({message: "User created"});

  } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}

export const login = async (req: Request, res: Response) => {
  try{ 
    
    const loginInput: loginInput = req.body;

    // input validation
    const user: false | User = await AppService.loginValidation(res, loginInput);
    if(!user) return;

  
    // generate and send token
    if(user) {
    const token = Authentication.generateToken(user);
    res.cookie("token", token, {maxAge: 3600000, sameSite: 'none', secure: process.env.NODE_ENV === 'production'});
    res.cookie("name", user.name, {maxAge: 3600000, sameSite: 'none', secure: process.env.NODE_ENV === 'production'});
    res.json({message: "User logged in"});
    }
  } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}

export const sendVotes = async (req: Request, res: Response) => {
  try{ 

    const userVotes: UserVotes[] = await Database.useMySql<UserVotes[]>("SELECT upvoted,downvoted FROM users WHERE id = ?", [req.user_id]);
    res.json({upvoted: userVotes[0].upvoted.split(","), downvoted: userVotes[0].downvoted.split(",")} );

 } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}