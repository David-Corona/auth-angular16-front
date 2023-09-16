import { Component } from '@angular/core';
import { SessionStorageService } from './_services/session-storage.service';
import { AuthService } from './auth/auth.service';
import { EventBusService } from './_services/event-bus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // title = 'juego-front';
  // isLoggedIn = false;

  // eventBusSub?: Subscription;

  constructor(
    // private storageService: SessionStorageService,
    // private authService: AuthService,
    // private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    // this.isLoggedIn = this.storageService.isLoggedIn();
    // console.log("APP Comp: LoggedIn - " + this.isLoggedIn);
    // if (this.isLoggedIn) {
    //   // const user = this.storageService.getUser();
    //   // this.roles = user.roles;

    //   // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
    //   // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

    //   // this.username = user.username;
    // }

    // this.eventBusSub = this.eventBusService.on('logout', () => {
    //   this.logout();
    // });
  }

  // logout(): void {
  //   this.authService.logout()
  //   // .subscribe({
  //   //   next: res => {
  //   //     console.log(res);
  //   //     this.storageService.clean();

  //   //     window.location.reload();
  //   //   },
  //   //   error: err => {
  //   //     console.log(err);
  //   //   }
  //   // });
  // }
}
