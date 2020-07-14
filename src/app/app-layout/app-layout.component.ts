import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@alfresco/adf-core';

@Component({
  selector: 'app-root',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  isLoggedIn = false;
  aliases = [
    {link: '/documentlist/-mysites-', title: 'My Sites', icon: 'dashboard'},
    {link: '/documentlist/-sharedlinks-', title: 'Shared Links', icon: 'share'},
    {link: '/documentlist/-sites-', title: 'Sites', icon: 'picture_in_picture'},
    {link: '/documentlist/-favorites-', title: 'Favorites', icon: 'favorite'},
    {link: '/documentlist/-recent-', title: 'Recent Files', icon: 'query_builder'},
    {link: '/documentlist/-trashcan-', title: 'Trashcan', icon: 'delete'},
  ];

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

}
