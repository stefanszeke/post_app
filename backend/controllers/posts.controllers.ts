import { Request, Response } from "express";
import { Database } from "../database/database";

// export const makePost = async (req: Request, res: Response) => {
//   const {title, text, userId} = req.body;

//   const post = {
//     title,
//     text,
//     score: 0,
//     timestamp: new Date().
//   };
//   await Database.useMySql("INSERT INTO posts SET ?", post);
//   res.json({message: "Post created"});
// }



export const getPosts = async (req: Request, res: Response) => {
  const posts = await Database.useMySql("SELECT * FROM posts");

  console.log(req.body.userId)

  res.json(posts);
}