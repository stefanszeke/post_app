import { createAction, props } from "@ngrx/store";
import { Post } from "src/app/models/post";


export const getUpvoted = createAction(
  '[Posts Page] upvoted',
  props<{ payload: string[] }>()
);

export const getDownvoted = createAction(
  '[Posts Page] downvoted',
  props<{ payload: string[] }>()
);

