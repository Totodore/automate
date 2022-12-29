import { ProgressService } from './progress.service';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { map, timeout } from "rxjs/operators";
import { PatchMessageModel, PostFreqMessageInModel } from 'src/app/models/api.model';
import { DiscordProfile, MessageModel, GuildReqModel, MemberModel, PostPonctMessageInModel } from './../models/api.model';
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
    private readonly sse: SseService,
    private readonly progress: ProgressService
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
      return await this.get("user/me/last");
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
  public async patchOneTimeMessage(deleteOneTime: boolean) {
    return await this.patch<void, void>(`guild/${this.currentGuild?.id}/onetime?delete=${deleteOneTime}`);
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
      formData.append(key, typeof val === "object" ? JSON.stringify(val) : val?.toString() ?? "");
    for (const file of files)
      formData.append("files", file);
    return await this.post(`guild/${this.currentGuild?.id}/message/freq`, body);
  }

  public async postPonctualMessage(files: File[], body: Partial<PostPonctMessageInModel>): Promise<MessageModel> {
    const formData = new FormData();
    for (const [key, val] of Object.entries(body))
      formData.append(key, typeof val === "object" ? JSON.stringify(val) : val?.toString() ?? "");
    for (const file of files)
      formData.append("files", file);
    return await this.post(`guild/${this.currentGuild?.id}/message/ponctual`, body);
  }

  public async patchMessage(msgId: string, body: PatchMessageModel) {
    await this.patch(`guild/${this.currentGuild?.id}/message/${msgId}`, body);
  }
  public async deleteGuildFromServer() {
    await this.delete(`guild/${this.currentGuild?.id}`);
  }
  public async deleteMessage(msgId: string) {
    if (!this.currentGuild)
      return;
    await this.delete(`guild/${this.currentGuild.id}/message/${msgId}`);
    this.currentGuild.messages = this.currentGuild.messages.filter(el => el.id !== msgId);
  }
  private async get<R>(path: string, token?: string) {
    try {
      this.progress.show();
      if (path.startsWith("/"))
        path = path.substring(1);
      const headers = new HttpHeaders({ Authorization: `Bearer ${token || this.token}` });
      return await this.http.get<R>(`${environment.apiLink}/${path}`, { headers }).toPromise();
    } finally {
      this.progress.hide();
    }
  }
  private async post<Q, R>(path: string, body: Q) {
    try {
      if (path.startsWith("/"))
        path = path.substring(1);
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
      return await this.http.post<R>(`${environment.apiLink}/${path}`, body, { headers }).toPromise();
    } finally {
      this.progress.hide();
    }
  }
  private async patch<Q, R>(path: string, body?: Q) {
    try {
      if (path.startsWith("/"))
        path = path.substring(1);
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
      return this.http.patch<R>(`${environment.apiLink}/${path}`, body, { headers }).toPromise();
    } finally {
      this.progress.hide();
    }
  }
  private async delete<R>(path: string) {
    try {
      if (path.startsWith("/"))
        path = path.substring(1);
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
      return this.http.delete<R>(`${environment.apiLink}/${path}`, { headers }).toPromise();
    } finally {
      this.progress.hide();
    }
  }

  private get token(): string {
    return localStorage.getItem("jwt") as string;
  }

  public get logged(): boolean {
    return this.token !== null;
  }
  
}
