import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { iif, Observable } from "rxjs";
import { AppState } from "src/app/store/app.state";
import * as UsersActions from "src/app/store/users/users.actions";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  name$: Observable<string> = this.store.select(state => state.users.name);
  isLoggedIn$: Observable<boolean> = this.store.select(state => state.users.isLoggedIn);

  constructor(private store: Store<AppState>, private cookieService: CookieService) { }

  ngOnInit(): void {
    if(this.cookieService.check('token') && this.cookieService.check('name')) {
      this.store.dispatch(UsersActions.login({ name: this.cookieService.get('name') }));

    } else {
      this.store.dispatch(UsersActions.logout());
      this.cookieService.deleteAll()
 
    }
  }

  logout() {
    this.store.dispatch(UsersActions.logout());
    this.cookieService.deleteAll()
    window.location.reload();
  }
}