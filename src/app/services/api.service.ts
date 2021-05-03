import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from 'passport-discord';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public profile?: Profile;

  constructor(
    private readonly http: HttpClient
  ) { }

  public async login(token?: string) {
    this.profile = await this.get<Profile>("user/me", token || this.token);
    if (token)
      localStorage.setItem("jwt", token);
  }
  public async logout() {
    this.profile = undefined;
    localStorage.removeItem("jwt");
  }

  private async get<R>(path: string, token?: string) {
    if (path.startsWith("/"))
      path = path.substring(1);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token || this.token}` });
    return this.http.get<R>(`${environment.apiLink}/${path}`, { headers }).toPromise();
  }

  private get token(): string {
    return localStorage.getItem("jwt") as string;
  }

  public get logged(): boolean {
    return this.token !== null;
  }
  
}
