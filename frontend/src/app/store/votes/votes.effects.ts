import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { catchError, delay, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Observable, of as observableOf } from 'rxjs';
import { Votes } from "src/app/models/votes";
import { ApiService } from "src/app/services/api.service";
import { AppState } from "../app.state";

import * as VotesActions from './votes.actions';

@Injectable()
export class VotesEffects {
  name$: Observable<string> = this.store.select(state => state.users.name);

  constructor(private apiService: ApiService, private actions$: Actions, private store:Store<AppState>) {}

  loadUpVotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VotesActions.requestVotes),
      // delay(2000),

      mergeMap(
        () =>
          this.apiService
            .getUserVotes()
            .pipe(map((payload:Votes) => VotesActions.successUpVotes({ payload: payload.upvoted })))

      ),
      
      catchError(
        (err) => of(VotesActions.failedVotes({ error: 'something wrong' }))
      )
    )
  );
  

  loadDownVotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VotesActions.requestVotes),
      // delay(2000),

      mergeMap(
        () =>
          this.apiService
            .getUserVotes()
            .pipe(map((payload:Votes) => VotesActions.successDownVotes({ payload: payload.downvoted })))

      ),
      
      catchError(
        (err) => of(VotesActions.failedVotes({ error: 'something wrong' }))
      )
    )
  );
  


}