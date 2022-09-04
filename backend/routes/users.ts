import router from 'express'
import * as usersController from "../controllers/users.controller";

export const usersRouter = router()

usersRouter.get('/', (req, res) => { res.send('users router') }) // test route

usersRouter.post('/register', usersController.register)

usersRouter.post('/login', usersController.login)


