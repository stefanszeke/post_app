import { createReducer, on } from "@ngrx/store";
import * as UsersActions from "./users.actions";

export interface UsersState {
  name: string;
  isLoggedIn: boolean;
};

export const initialState: UsersState = {
  name: '',
  isLoggedIn: false,
};

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.login, (state, { name }) => ({ ...state, name, isLoggedIn: true })),
  on(UsersActions.logout, state => ({ ...state, name: '', isLoggedIn: false })),
);