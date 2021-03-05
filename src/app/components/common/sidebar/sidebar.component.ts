import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
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
