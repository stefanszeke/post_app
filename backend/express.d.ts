// extend Request type with user property
declare namespace Express {
  export interface Request {
    user_id: number;
  }
}

// add --files to the command line
// Load files, include and exclude from tsconfig.json on startup.
// This may avoid certain typechecking failures. 