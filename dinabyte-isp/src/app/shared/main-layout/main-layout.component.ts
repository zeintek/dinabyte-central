import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  user: any;
  isAdmin = false;
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }
  
  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.isAdmin = this.authService.hasRole('ROLE_ADMIN');
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}