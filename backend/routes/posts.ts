import router from 'express'
import * as postsControllers from "../controllers/posts.controllers";
import Authentication from "../authentication/authentication";

export const postsRouter = router()

postsRouter.get('/', postsControllers.getPosts ); 

postsRouter.get('/:userName', Authentication.isAuth, postsControllers.getUserPosts ); 

postsRouter.post('/', Authentication.isAuth, postsControllers.makePost ); 

postsRouter.patch('/:id', Authentication.isAuth, postsControllers.updatePost );

postsRouter.delete('/:id', Authentication.isAuth, postsControllers.deletePost );



