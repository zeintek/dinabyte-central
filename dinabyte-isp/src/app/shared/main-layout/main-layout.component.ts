// src/app/shared/main-layout/main-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent]
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