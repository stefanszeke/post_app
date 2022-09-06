import mysql from "mysql2";
import dotenv from "dotenv";
import AppService from "../services/appService";
dotenv.config();





export class Database {
  private static instance: Database;
  public readonly connection: mysql.Pool;

  private constructor() {
    this.connection = mysql.createPool(AppService.getConnection());
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    } 
    return Database.instance;
  }

  public static async useMySql(sql: string, options: any = []) {
    return new Promise<any>((resolve, reject) => {
      Database.getInstance().connection.query(sql, options, (error, result) => {
        if (error) reject(console.log(error))
        else resolve(result);
      })
    })
  }
}