import router from 'express'
import * as usersControllers from "../controllers/users.controllers";
import Authentication from "../authentication/authentication";

export const usersRouter = router()

usersRouter.get('/', (req, res) => { res.send('users router') }) // test route

usersRouter.post('/register', usersControllers.register)

usersRouter.post('/login', usersControllers.login)

usersRouter.get('/votes',Authentication.isAuth ,usersControllers.sendVotes)



