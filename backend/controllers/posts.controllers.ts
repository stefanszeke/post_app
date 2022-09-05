import { Request, Response } from "express";
import { Database } from "../database/database";

export const makePost = async (req: Request, res: Response) => {
  const {title, text, user_id} = req.body;

  const post = { title, text, user_id, score: 0, timestamp: Date.now()};

  await Database.useMySql("INSERT INTO posts SET ?", post);
  res.json({message: "Post created"});
}



export const getPosts = async (req: Request, res: Response) => {
  let getPostWithUsers = `SELECT posts.id, posts.title, posts.text, posts.score, posts.timestamp, users.name as user, users.country FROM posts JOIN users ON (posts.user_id = users.id);`
  const posts = await Database.useMySql(getPostWithUsers);

  res.json(posts);
}