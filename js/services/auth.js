/* ===========================================================
   Health Log v3.1
   File : js/services/auth.js
   Purpose : Google OAuth2 via Google Identity Services
=========================================================== */

import { Config } from "../core/config.js";

class AuthService {

    constructor() {
        this.accessToken = null;
        this.tokenClient = null;
        this._listeners = [];
    }

    init() {
        const saved = localStorage.getItem("oauth_token");
        if (saved) this.accessToken = saved;

        if (typeof google !== "undefined" && google.accounts) {
            this._initTokenClient();
        } else {
            window.addEventListener("load", () => this._initTokenClient());
        }
    }

    _initTokenClient() {
        if (!Config.GOOGLE_CLIENT_ID) return;
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: Config.GOOGLE_CLIENT_ID,
            scope: "https://www.googleapis.com/auth/script.external_request email profile",
            callback: (response) => {
                if (response.access_token) {
                    this.accessToken = response.access_token;
                    localStorage.setItem("oauth_token", this.accessToken);
                    this._notify(true);
                } else {
                    console.error("OAuth error:", response.error);
                    this._notify(false);
                }
            },
        });
    }

    signIn() {
        if (!this.tokenClient) {
            console.error("Auth: token client not ready");
            return;
        }
        this.tokenClient.requestAccessToken({ prompt: "consent" });
    }

    signOut() {
        if (this.accessToken) {
            google.accounts.oauth2.revoke(this.accessToken, () => {
                this._clear();
                this._notify(false);
            });
        } else {
            this._clear();
            this._notify(false);
        }
    }

    _clear() {
        this.accessToken = null;
        localStorage.removeItem("oauth_token");
    }

    getToken() {
        if (!this.accessToken) {
            this.accessToken = localStorage.getItem("oauth_token");
        }
        return this.accessToken;
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    handleUnauthorized() {
        this._clear();
        this._notify(false);
    }

    onChange(fn) {
        this._listeners.push(fn);
    }

    _notify(isAuth) {
        this._listeners.forEach(fn => fn(isAuth));
    }

}

export const Auth = new AuthService();
