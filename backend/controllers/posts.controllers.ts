import { Request, Response } from "express";
import { convertToObject } from "typescript";
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

export const getUserPosts = async (req: Request, res: Response) => {
  
  if(req.query.id) {
    const getPostWithUsers = `SELECT posts.id, posts.title, posts.text, posts.score, posts.timestamp, users.name as user, users.country FROM posts JOIN users ON (posts.user_id = users.id) WHERE posts.user_id = ? AND posts.id = ?;`
    const post = await Database.useMySql(getPostWithUsers, [req.body.user_id, req.query.id]);
    
    res.json(post[0]);
  }

  else {
    const getPostWithUsers = `SELECT posts.id, posts.title, posts.text, posts.score, posts.timestamp, users.name as user, users.country FROM posts JOIN users ON (posts.user_id = users.id) WHERE posts.user_id = ?;`
    const posts = await Database.useMySql(getPostWithUsers, [req.body.user_id]);
    
    res.json(posts);
  }

}

export const updatePost = async (req: Request, res: Response) => {
  const {title, text, user_id} = req.body;
  const id = req.params.id;

  const post = { title, text };

  await Database.useMySql("UPDATE posts SET ? WHERE id = ? and user_id = ?", [post, id, user_id]);
  res.json({message: "Post updated"});
}

export const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user_id = req.body.user_id;

  await Database.useMySql("DELETE FROM posts WHERE id = ? and user_id = ?", [id, user_id]);
  res.json({message: "Post deleted"});
}