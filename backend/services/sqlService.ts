import { Request } from "express";

export default class SqlService {

  private static postWithUsersInfo: string = 'posts.id, posts.title, posts.text, posts.score, posts.timestamp, users.name as user, users.country'

  public static getPosts(req: Request, pageLimit: number ): string {
    let page: number = +req.query.page!-1;
    if(page < 0) page = 0;
  
    let orderBy = req.query.orderBy ||'posts.id' ;
    let order = req.query.order || 'DESC';
    let search = req.query.search || "";

    return `SELECT ${this.postWithUsersInfo}
      FROM posts
      JOIN users ON (posts.user_id = users.id)
      WHERE posts.title
      LIKE '%${search}%' 
      ORDER BY ${orderBy} ${order} 
      LIMIT ${page*pageLimit},?;`
  }

  public static getUserPosts(req: Request, pageLimit: number ): string {
    let page: number = +req.query.page!-1;
    if(page < 0) page = 0;
  
    let orderBy = req.query.orderBy ||'posts.id' ;
    let order = req.query.order || 'DESC';
    let search = req.query.search || "";

    return `SELECT ${this.postWithUsersInfo}
      FROM posts 
      JOIN users ON (posts.user_id = users.id) 
      WHERE posts.user_id = ? AND posts.title 
      LIKE '%${search}%' 
      ORDER BY ${orderBy} ${order} 
      LIMIT ${page*pageLimit},?`
  }

  public static getUsersPostsById() {
    return `SELECT ${this.postWithUsersInfo}
      FROM posts 
      JOIN users ON (posts.user_id = users.id) 
      WHERE posts.user_id = ? AND posts.id = ?
      ORDER BY posts.id DESC;`
  }
}