import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { User } from "../model/user.model";
import { RequestApiService } from "./request-api.service";
import { UserStatusService } from "./user-status.service";

export interface data {
    hotline: string;
    email: string;
}

@Injectable({
    providedIn: "root",
})
export class AuthService {
    user: User;

    urlLogin = "/user/login-api";

    displayedColumns: string[] = ["hotline", "email"];
    dataHotline: data[] = [
        { hotline: "0866.156.422", email: "eshop@tepbac.com" },
    ];

    constructor(
        private router: Router,
        private reqAPIService: RequestApiService,
        private userStatusService: UserStatusService
    ) {}

    isLoggedIn = false;
    // Token login
    _token: string;
    // store the URL so we can redirect after logging in
    redirectUrl: string;
    //loginMessage
    loginMessage: Observable<string>;

    login(loginForm) {
        //console.log(loginForm);
        return this.reqAPIService.postNoneToken(this.urlLogin, loginForm).pipe(
            map((data) => {
                // login successful if there's a jwt token in the response
                if (data.data && data.data.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem("currentUser", JSON.stringify(data));
                    this._token = data.data.token;
                    this.reqAPIService.setToken(this._token);
                    this.isLoggedIn = true;
                    this.setUser(data.data);
                    this.userStatusService.pushEventLogin({ login: true });
                    return data;
                } else {
                    return data;
                }
            })
        );
    }

    logout(): void {
        this.isLoggedIn = false;
        localStorage.removeItem("currentUser");
        this.router.navigate(["/login"]);
    }

    setUser(data: any) {
        let user: User = {
            id: data.user_id,
            username: data.user_name,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.user_email,
            photo: data.user_photo,
            permission: data.permission,
        };
        this.user = user;
    }

    getUser(): User {
        if (!this.user) {
            let currentUser = localStorage.getItem("currentUser");
            this.setUser(JSON.parse(currentUser).data.user);
        }
        return this.user;
    }

    checkIsLogedIn(): boolean {
        if (this.isLoggedIn || localStorage.getItem("currentUser")) {
            this.isLoggedIn = true;
            return true;
        } else {
            return false;
        }
    }
}
