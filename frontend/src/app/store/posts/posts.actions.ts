import { createAction, props } from "@ngrx/store";
import { Post } from "src/app/models/post";


export const requestPosts = createAction(
  '[Posts Page] Posts Request',
  (page: number = 0, orderBy: string = 'posts.id', order: string = 'DESC',  search: string = "") => ({ page, orderBy, order, search })
);

export const failedPosts = createAction(
  '[Posts Page] Posts Failed',
  props<{ error: string }>()
);

export const successPosts = createAction(
  '[Posts Page] Posts Success',
  props<{ payload: Post[] }>()
);

export const requestUserPosts = createAction(
  '[Posts Page] User Posts Request',
  (page: number = 0, orderBy: string = 'posts.id', order: string = 'DESC',  search: string = "") => ({ page, orderBy, order, search })
);

export const failedUserPosts = createAction(
  '[Posts Page] User Posts Failed',
  props<{ error: string }>()
);

export const successUserPosts = createAction(
  '[Posts Page] User Posts Success',
  props<{ payload: Post[] }>()
);

