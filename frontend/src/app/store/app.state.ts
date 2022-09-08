import { PostsState } from "./posts/posts.reducers";
import { UsersState } from "./users/users.reducers";
import { VotesState } from "./votes/votes.reducers";



export interface AppState {
  users: UsersState;
  posts: PostsState;
  votes: VotesState;
}
