import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { iif, Observable } from "rxjs";
import { AppState } from "src/app/store/app.state";
import * as UsersActions from "src/app/store/users/users.actions";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  name$: Observable<string> = this.store.select(state => state.users.name);
  isLoggedIn$: Observable<boolean> = this.store.select(state => state.users.isLoggedIn);

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    if(localStorage.getItem('token') && localStorage.getItem('name')) {
      this.store.dispatch(UsersActions.login({ name: localStorage.getItem('name')! }));
    } else {
      localStorage.clear();
      this.store.dispatch(UsersActions.logout());
    }
  }

  logout() {
    this.store.dispatch({ type: 'LOGOUT' });
    localStorage.clear();
    window.location.reload();
  }
}
