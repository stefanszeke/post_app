import { createReducer, on } from "@ngrx/store";
import { Post } from "src/app/models/post";
import * as PostsActions from "./posts.actions";

export interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error?: string;
};

export const initialState: PostsState = {
  posts: [],
  isLoading: false,
  error: undefined
};

export const postsReducer = createReducer(
  initialState,
  on(PostsActions.requestPosts, state => ({ ...state, isLoading: true })),
  on(PostsActions.failedPosts, (state, action) => ({ ...state, isLoading: false, error: action.error })),
  on(PostsActions.successPosts, (state, action) => ({ ...state, isLoading: false, posts: action.payload })),
  on(PostsActions.requestUserPosts, state => ({ ...state, isLoading: true })),
  on(PostsActions.failedUserPosts, (state, action) => ({ ...state, isLoading: false, error: action.error })),
  on(PostsActions.successUserPosts, (state, action) => ({ ...state, isLoading: false, posts: action.payload }))
);