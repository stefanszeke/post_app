import express, { Request, Response } from 'express';
import { usersRouter } from "./routes/users";
import { postsRouter } from "./routes/posts";
import AppService from "./services/appService";
import cors from 'cors';

// express setup
const app = express();
app.use(express.json());
app.use(cors({origin: ['http://localhost:4200','https://post-app-szeke.herokuapp.com'], credentials: true}));
app.use(express.static('public'));

// routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

app.get("*", (req: Request, res: Response) => {
  res.redirect("/");
})


app.listen(process.env.PORT || 3700, () => AppService.serverLog());
