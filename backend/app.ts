import express from 'express';
import { usersRouter } from "./routes/users";

// express setup
const app = express();
app.use(express.json());

// routes
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

const PORT = process.env.PORT || 3700;
app.listen(3700, () => { console.log('\x1b[32m%s\x1b[0m', ` ⇒ App listening on Port ${PORT}`) });
