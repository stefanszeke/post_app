import router from 'express'
import * as usersControllers from "../controllers/users.controllers";

export const usersRouter = router()

usersRouter.get('/', (req, res) => { res.send('users router') }) // test route

usersRouter.post('/register', usersControllers.register)

usersRouter.post('/login', usersControllers.login)


