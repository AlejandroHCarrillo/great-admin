import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/services.index';
// declare function init_plugins():any;
// declare const gapi: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor( private authService : AuthService ) { }

  ngOnInit(): void {
  }

  signOut(){
    this.authService.logout();
    // const auth2 = gapi.auth2.getAuthInstance();
    // auth2.signOut().then(function() {
    //   console.log("User signed out.");
    // });
  }
}
