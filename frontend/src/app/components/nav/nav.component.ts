import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/app.state";
import * as UsersActions from "src/app/store/users/users.actions";
import * as VotesActions from "src/app/store/votes/votes.actions";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { faHouse, faRightToBracket, faDoorOpen, faClipboard, faPlus, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  name$: Observable<string> = this.store.select(state => state.users.name);
  isLoggedIn$: Observable<boolean> = this.store.select(state => state.users.isLoggedIn);
  hideMenu:boolean = true;
  
  faHouse = faHouse; faAddressCard = faAddressCard; faRightToBracket = faRightToBracket; faDoorOpen = faDoorOpen;
  faClipboard = faClipboard; faPlus = faPlus; faBars = faBars; faXmark = faXmark
  
  constructor(private store: Store<AppState>, private cookieService: CookieService, private router: Router) { }

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
    this.store.dispatch(VotesActions.clearVotes());
    this.cookieService.deleteAll()
    this.router.navigate(['/login']);
    this.closeMenu()

  }
  
  toggleMenu() {
    this.hideMenu = !this.hideMenu;
  }

  closeMenu() {
    this.hideMenu = true;
  }
}
