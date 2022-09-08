import { createReducer, on } from "@ngrx/store";

import * as VotesActions from "./votes.actions";

export interface VotesState {
  upvoted: string[];
  downvoted: string[];
  upvotesAreLoading: boolean;
  downvotesAreLoading: boolean;
  error?: string | null;
};

export const initialState: VotesState = {
  upvoted: [],
  downvoted: [],
  upvotesAreLoading: false,
  downvotesAreLoading: false,
  error: null
};

export const votesReducer = createReducer(
  initialState,
  on(VotesActions.requestVotes, state => ({ ...state, isLoading: true })),
  on(VotesActions.successUpVotes, (state, { payload }) => ({ ...state, upvotesAreLoading: false, upvoted: payload })),
  on(VotesActions.successDownVotes, (state, { payload }) => ({ ...state, downvotesAreLoading: false, downvoted: payload })),
  on(VotesActions.failedVotes, (state, { error }) => ({ ...state, isLoading: false, error })),
  on(VotesActions.clearVotes, state => ({ ...state, upvoted: [], downvoted: [] }))
);