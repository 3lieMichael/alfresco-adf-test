import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@alfresco/adf-core';

@Component({
  selector: 'app-root',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

}
