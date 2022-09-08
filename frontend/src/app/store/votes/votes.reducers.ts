import { createReducer, on } from "@ngrx/store";

import * as VotesActions from "./votes.actions";

export interface VotesState {
  upvoted: string[];
  downvoted: string[];

};

export const initialState: VotesState = {
  upvoted: [],
  downvoted: []
};

export const votesReducer = createReducer(
  initialState,
  on(VotesActions.getUpvoted, (state, { payload }) => ({ ...state, upvoted: payload })),
  on(VotesActions.getDownvoted, (state, { payload }) => ({ ...state, downvoted: payload }))
);