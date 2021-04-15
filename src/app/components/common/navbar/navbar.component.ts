import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/services.index';

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
  }
}
