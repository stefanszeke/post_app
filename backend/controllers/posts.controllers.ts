import { Request, Response } from "express";
import { Database } from "../database/database";

export const makePost = async (req: Request, res: Response) => {
  const {title, text, user_id} = req.body;

  const post = {
    title,
    text,
    user_id,
    score: 0,
    timestamp: Date.now()
  };

  await Database.useMySql("INSERT INTO posts SET ?", post);
  res.json({message: "Post created"});
}



export const getPosts = async (req: Request, res: Response) => {
  const posts = await Database.useMySql("SELECT * FROM posts");

  console.log(req.body.userId)

  res.json(posts);
}