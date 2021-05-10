import { GuildElement } from 'src/app/models/api.model';
import { DiscordProfile, MessageModel, GuildReqModel, MemberModel } from './../models/api.model';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public profile?: DiscordProfile;

  constructor(
    private readonly http: HttpClient
  ) { }

  public async login(token?: string) {
    this.profile = await this.get<DiscordProfile>("user/me", token || this.token);
    if (token)
      localStorage.setItem("jwt", token);
  }
  public async logout() {
    this.profile = undefined;
    localStorage.removeItem("jwt");
  }

  public async getLastMessages(): Promise<MessageModel[] | undefined> {
    try {
      return await this.post("guild/last", this.profile);
    } catch (e) { console.error(e) }
    return;
  }

  public async getGuild(guildId: string): Promise<GuildReqModel | undefined> {
    try {
      return await this.get<GuildReqModel>(`guild/${guildId}`);
    } catch (e) { console.error(e) }
    return;
  }
  public async getMembers(needle: string, guildId: string): Promise<MemberModel[]> {
    return await this.get<MemberModel[]>(`guild/${guildId}/members?q=${needle}`);
  }

  public async patchGuildScope(scope: boolean, guildId: string) {
    return await this.patch<void, void>(`guild/${guildId}/scope?scope=${scope}`);
  }
  public async patchGuildTimezone(tz: string, guildId: string) {
    return await this.patch<void, void>(`guild/${guildId}/timezone?timezone=${tz}`);
  }
  public async patchMessageState(state: boolean, msgId: string, guildId: string) {
    return await this.patch<void, void>(`guild/${guildId}/message/${msgId}/state?state=${state}`);
  }

  private async get<R>(path: string, token?: string) {
    if (path.startsWith("/"))
      path = path.substring(1);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token || this.token}` });
    return this.http.get<R>(`${environment.apiLink}/${path}`, { headers }).toPromise();
  }
  private async post<Q, R>(path: string, body: Q) {
    if (path.startsWith("/"))
      path = path.substring(1);
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.post<R>(`${environment.apiLink}/${path}`, body, { headers }).toPromise();
  }
  private async patch<Q, R>(path: string, body?: Q) {
    if (path.startsWith("/"))
      path = path.substring(1);
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.patch<R>(`${environment.apiLink}/${path}`, body, { headers }).toPromise();
  }

  private get token(): string {
    return localStorage.getItem("jwt") as string;
  }

  public get logged(): boolean {
    return this.token !== null;
  }
  
}
