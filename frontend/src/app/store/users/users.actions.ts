import { createAction, props } from "@ngrx/store";

export const login = createAction('[Login Page] Login', props<{name: string}>());
export const logout = createAction('[Login Page] Logout');