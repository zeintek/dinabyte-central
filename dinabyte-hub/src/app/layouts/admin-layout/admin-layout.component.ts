import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();
  isCollapsed = false;
  private routerSubscription: Subscription;

  constructor(private router: Router, private elementRef: ElementRef) {}

  ngOnInit(): void {
    console.log('AdminLayoutComponent cargado');
    this.routerSubscription = this.router.events.subscribe(() => {
      this.isCollapsed = false;
      this.updateNavbarStyles();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;
    this.updateNavbarStyles();
  }

  private updateNavbarStyles() {
    const navbar = this.elementRef.nativeElement.querySelector('nav.navbar');
    if (navbar) {
      if (this.isCollapsed) {
        navbar.classList.remove('navbar-transparent');
        navbar.classList.add('bg-white');
      } else {
        navbar.classList.add('navbar-transparent');
        navbar.classList.remove('bg-white');
      }
    } else {
      console.warn('Elemento <nav class="navbar"> no encontrado en AdminLayoutComponent');
    }
  }
}