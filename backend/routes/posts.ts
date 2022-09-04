import router from 'express'
import * as postsControllers from "../controllers/posts.controllers";
import Authentication from "../authentication/authentication";

export const postsRouter = router()

postsRouter.get('/', Authentication.isAuth , postsControllers.getPosts ); // test route



