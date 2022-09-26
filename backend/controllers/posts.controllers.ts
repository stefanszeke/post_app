import { Request, Response } from "express";
import { Database } from "../database/database";
import AppService from "../services/appService";
import SqlService from "../services/sqlService";
import { Post, UserPost } from "../models/post";
import { UserVotes } from "../models/userVotes";
import { Vote } from "../models/vote";

export const makePost = async (req: Request, res: Response) => {
  try {

    const {title, text} = req.body;
    const {user_id} = req;

    const validation = await AppService.postValidation(res, req.body)
    if(!validation) return;

    const post: Post = { title, text, user_id, score: 0, timestamp: Date.now()};

    await Database.useMySql("INSERT INTO posts SET ?", post);
    res.json({message: "Post created"});

  } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}


export const getPosts = async (req: Request, res: Response) => {
  try {

    const PageLimit = 5;

    const posts:UserPost[] = await Database.useMySql(SqlService.getPosts(req, PageLimit),[PageLimit]);
  
    res.json(posts);

  } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}


export const getUserPosts = async (req: Request, res: Response) => {
  try {

    if(req.query.id) {
      const post:UserPost[] = await Database.useMySql(SqlService.getUsersPostsById(), [req.user_id, req.query.id]);
      
      res.json(post[0]);
    }

    else {
      const PageLimit = 5;
      const posts:UserPost[] = await Database.useMySql(SqlService.getUserPosts(req, PageLimit), [req.user_id, PageLimit]);
      
      res.json(posts);
    }

  } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}


export const updatePost = async (req: Request, res: Response) => {
  try {

    const {title, text} = req.body;
    const id = req.params.id;

    const validation = await AppService.postValidation(res, req.body)
    if(!validation) return;

    const update = { title, text };

    await Database.useMySql("UPDATE posts SET ? WHERE id = ? and user_id = ?", [update, id, req.user_id]);
    res.json({message: "Post updated"});

  } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}


export const deletePost = async (req: Request, res: Response) => {
  try {

    const id = req.params.id;

    await Database.useMySql("DELETE FROM posts WHERE id = ? and user_id = ?", [id, req.user_id]);
    res.json({message: "Post deleted"});

  } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
}


export const votePost = async (req: Request, res: Response) => {
  try {

    const post_id = req.params.id
    const vote: Vote = req.body.vote;


    const userVotes: UserVotes[] = await Database.useMySql("SELECT upvoted,downvoted FROM users WHERE id = ?", [req.user_id]);
    console.log(userVotes);
    let upvotes:string[] = [...userVotes[0].upvoted.split(",")];
    let downvotes:string[] = userVotes[0].downvoted.split(",");
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

    
    await Database.useMySql("UPDATE posts SET score = score + ? WHERE id = ?", [score, post_id]);
    await Database.useMySql("UPDATE users SET upvoted = ?, downvoted = ? WHERE id = ?", [upvotes.join(","), downvotes.join(","), req.user_id]);
    
    res.json({message: "Post voted"});

    } catch (err) { console.log(err); res.status(500).json({message: "Something went wrong"}) }
  }