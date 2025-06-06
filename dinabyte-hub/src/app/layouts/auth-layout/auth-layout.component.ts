import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES } from '../../components/sidebar/sidebar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  private listTitles: any[];
  public location: Location;
  public isCollapsed = false;
  private routerSubscription: Subscription;

  constructor(location: Location, private router: Router, private elementRef: ElementRef) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.routerSubscription = this.router.events.subscribe(() => {
      this.isCollapsed = false;
      this.updateNavbarStyles();
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getTitle() {
    let titlee: any = this.location.prepareExternalUrl(this.location.path());
    for (let i = 0; i < this.listTitles.length; i++) {
      if (
        this.listTitles[i].type === 'link' &&
        this.listTitles[i].path === titlee
      ) {
        return this.listTitles[i].title;
      } else if (this.listTitles[i].type === 'sub') {
        for (let j = 0; j < this.listTitles[i].children.length; j++) {
          let subtitle =
            this.listTitles[i].path + '/' + this.listTitles[i].children[j].path;
          if (subtitle === titlee) {
            return this.listTitles[i].children[j].title;
          }
        }
      }
    }
    return 'Now UI Dashboard PRO Angular';
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;
    this.updateNavbarStyles();
  }

  private updateNavbarStyles() {
    // Seleccionar el elemento <nav> dentro del propio componente usando ElementRef
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
      console.warn('Elemento <nav class="navbar"> no encontrado en AuthLayoutComponent');
    }
  }
}