import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, NavigationExtras, CanLoad } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad{

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    // If has login
    //console.log(localStorage.getItem('currentUser'));
    if (this.authService.isLoggedIn || localStorage.getItem('currentUser')) { return true; }
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    //console.log(url);

    // Set our navigation extras object
    // that contains our global query params and fragment
    let navigationExtras: NavigationExtras = {
      queryParams: { returnUrl: url }
    };
    // Navigate to the login page with extras
    this.router.navigate(['/login'], navigationExtras);
    console.log("chưa đăng nhập");
    return false;
  }

  reqLogin() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
}
