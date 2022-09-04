import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const dockerConnection = {
  host: 'localhost',
  database: 'post_app',
  user: 'admin',
  password: 'admin',
  port: 3398
}



export class Database {
  private static instance: Database;
  public readonly connection: mysql.Connection;

  private constructor() {
    this.connection = mysql.createConnection(dockerConnection);
    this.connection.connect((error) => {
      if (error) { console.log(error); return; }
    
      console.log(`Database status: connected`)
    })
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
