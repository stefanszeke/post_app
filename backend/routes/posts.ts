import router from 'express'
import * as postsControllers from "../controllers/posts.controllers";
import Authentication from "../authentication/authentication";

export const postsRouter = router()

postsRouter.get('/', postsControllers.getPosts ); 

postsRouter.post('/', Authentication.isAuth , postsControllers.makePost ); 



