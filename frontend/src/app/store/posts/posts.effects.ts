import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { catchError, delay, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Observable, of as observableOf } from 'rxjs';
import { ApiService } from "src/app/services/api.service";
import { AppState } from "../app.state";

import * as PostsActions from './posts.actions';

@Injectable()
export class PostsEffects {
  name$: Observable<string> = this.store.select(state => state.users.name);

  constructor(private apiService: ApiService, private actions$: Actions, private store:Store<AppState>) {}

  loadAllPostsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.requestPosts), // action1
      // delay(2000),

      mergeMap(
        (action) =>

          this.apiService
            .getPosts(action)
            .pipe(map((payload) => PostsActions.successPosts({ payload }))) // action2
      ),

      catchError(
        (err) => of(PostsActions.failedPosts({ error: 'something wrong' })) // action3
      )
    )
  );
  
  
  loadUserEffect$ = createEffect(() =>

    this.actions$.pipe(
      ofType(PostsActions.requestUserPosts), // action1
      withLatestFrom(this.name$),
      // delay(2000),

      
      mergeMap(
        (action) =>
          this.apiService
            .getUserPosts(action)
            .pipe(map((payload) => PostsActions.successUserPosts({ payload }))) // action2
      ),

      catchError(
        (err) => of(PostsActions.failedUserPosts({ error: 'something wrong' })) // action3
      )
    )
  );



}