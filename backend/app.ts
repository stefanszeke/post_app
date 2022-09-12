import express, { Request, Response } from 'express';
import { usersRouter } from "./routes/users";
import { postsRouter } from "./routes/posts";
import path from "path";
import cors from 'cors';

// express setup
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

app.get("*", (req: Request, res: Response) => {
  res.redirect("/");
})

const PORT = process.env.PORT || 3700;
app.listen(3700, () => { console.log('\x1b[32m%s\x1b[0m', ` ⇒ App listening on Port ${PORT}`) });
