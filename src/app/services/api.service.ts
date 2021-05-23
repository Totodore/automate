import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { map, timeout } from "rxjs/operators";
import { GuildElement, PostFreqMessageInModel } from 'src/app/models/api.model';
import { DiscordProfile, MessageModel, GuildReqModel, MemberModel } from './../models/api.model';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public profile?: DiscordProfile;
  public currentGuild?: GuildReqModel;

  constructor(
    private readonly http: HttpClient,
    private readonly sse: SseService
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

  public getCreatedGuild(guildId: string): Observable<string> {
    return this.sse.getSse(`guild/${guildId}/add`, this.token).pipe(timeout(120_000), map(el => el.data));
  }
  public async getGuild(guildId: string): Promise<GuildReqModel | undefined> {
    try {
      return this.currentGuild = await this.get<GuildReqModel>(`guild/${guildId}`);
    } catch (e) { console.error(e) }
    return;
  }
  public async getMembers(needle: string): Promise<MemberModel[]> {
    return await this.get<MemberModel[]>(`guild/${this.currentGuild?.id}/members?q=${needle}`);
  }

  public async patchGuildScope(scope: boolean) {
    return await this.patch<void, void>(`guild/${this.currentGuild?.id}/scope?scope=${scope}`);
  }
  public async patchGuildTimezone(tz: string) {
    return await this.patch<void, void>(`guild/${this.currentGuild?.id}/timezone?timezone=${tz}`);
  }
  public async patchMessageState(state: boolean, msgId: string) {
    return await this.patch<void, void>(`guild/${this.currentGuild?.id}/message/${msgId}/state?state=${state}`);
  }
  public async postFreqMessage(files: File[], body: Partial<PostFreqMessageInModel>): Promise<MessageModel> {
    const formData = new FormData();
    for (const [key, val] of Object.entries(body))
      formData.append(key, val!);
    for (const file of files)
      formData.append("files", file);
    return await this.post(`guild/${this.currentGuild?.id}/message/freq`, body);
  }
  public async deleteGuildFromServer() {
    await this.delete(`guild/${this.currentGuild?.id}`);
  }
  public async deleteMessage(msgId: string) {
    await this.delete(`guild/${msgId}`);
    this.currentGuild!.messages = this.currentGuild!.messages.filter(el => el.id !== msgId);
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
  private async delete<R>(path: string) {
    if (path.startsWith("/"))
      path = path.substring(1);
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.delete<R>(`${environment.apiLink}/${path}`, { headers }).toPromise();
  }

  private get token(): string {
    return localStorage.getItem("jwt") as string;
  }

  public get logged(): boolean {
    return this.token !== null;
  }
  
}
