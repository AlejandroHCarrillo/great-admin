import { Component, OnInit } from '@angular/core';
import { checkRole } from 'src/app/helpers/tools';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  checkRole = checkRole;
  public isCollapsed: boolean = false;
  public notificationsViewed: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(){}

  toggleMenu(){
    this.isCollapsed = !this.isCollapsed;
  }
}
