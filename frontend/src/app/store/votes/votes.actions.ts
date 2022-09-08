import { createAction, props } from "@ngrx/store";


export const requestVotes = createAction(
  '[Posts Page] Votes Request'
);

export const failedVotes = createAction(
  '[Posts Page] Votes Failed',
  props<{ error: string }>()
);

export const successUpVotes = createAction(
  '[Posts Page] UpVotes Success',
  props<{ payload: string[] }>()
);

export const successDownVotes = createAction(
  '[Posts Page] DownVotes Success',
  props<{ payload: string[] }>()
);

export const clearVotes = createAction(
  '[Posts Page] Clear Votes'
);