import { Request, Response } from "express";
import { Database } from "../database/database";
import AppService from "../services/appService";

export const makePost = async (req: Request, res: Response) => {
  const {title, text, user_id} = req.body;

  const validation = await AppService.postValidation(res, req.body)
  if(!validation) return;

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

  const validation = await AppService.postValidation(res, req.body)
  if(!validation) return;

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

export const votePost = async (req: Request, res: Response) => {
  const post_id = req.params.id
  const {user_id, vote } = req.body;

  const userVotes = await Database.useMySql("SELECT upvoted,downvoted FROM users WHERE id = ?", [user_id]);
  let test:string[] = []
  let upvotes:string[] = [...userVotes[0].upvoted.split(",")];
  let downvotes = userVotes[0].downvoted.split(",");
  let score = 0;


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

    
    await Database.useMySql("UPDATE posts SET score = score + ? WHERE id = ?", [score, post_id]);
    await Database.useMySql("UPDATE users SET upvoted = ?, downvoted = ? WHERE id = ?", [upvotes.join(","), downvotes.join(","), user_id]);
    
    res.json({message: "Post voted"});
  }