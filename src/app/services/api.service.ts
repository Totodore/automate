import { ProgressService } from './progress.service';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { map, timeout } from "rxjs/operators";
import { GuildElement, PatchMessageModel, PostFreqMessageInModel, WebhookInfo } from 'src/app/models/api.model';
import { DiscordProfile, MessageModel, GuildReqModel, MemberModel, PostPonctMessageInModel } from './../models/api.model';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUtil } from '../utils/api.util';
@Injectable({
  providedIn: 'root'
})
export class ApiService extends ApiUtil {

  public profile?: DiscordProfile;
  public currentGuild?: GuildReqModel;

  constructor(
    http: HttpClient,
    progress: ProgressService,
    private readonly sse: SseService,
  ) { 
    super(http, progress);
  }

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
      formData.append(key, typeof val === "object" ? JSON.stringify(val) : val?.toString()!);
    for (const file of files)
      formData.append("files", file);
    return await this.post(`guild/${this.currentGuild?.id}/message/freq`, body);
  }

  public async postPonctualMessage(files: File[], body: Partial<PostPonctMessageInModel>): Promise<MessageModel> {
    const formData = new FormData();
    for (const [key, val] of Object.entries(body))
      formData.append(key, typeof val === "object" ? JSON.stringify(val) : val?.toString()!);
    for (const file of files)
      formData.append("files", file);
    return await this.post(`guild/${this.currentGuild?.id}/message/ponctual`, body);
  }

  public async patchMessage(msgId: string, body: PatchMessageModel) {
    await this.patch(`guild/${this.currentGuild?.id}/message/${msgId}`, body);
  }
  public async patchWebhook(webhook: WebhookInfo, image?: File): Promise<WebhookInfo> {
    const formData = new FormData();
    formData.append("name", webhook.name);
    if (image)
      formData.append("image", image);
    return await this.patch(`guild/${this.currentGuild?.id}/webhook/${webhook.id}`, formData);
  }
  public async deleteGuildFromServer() {
    await this.delete(`guild/${this.currentGuild?.id}`);
  }
  public async deleteMessage(msgId: string) {
    await this.delete(`guild/${this.currentGuild?.id}/message/${msgId}`);
    this.currentGuild!.messages = this.currentGuild!.messages.filter(el => el.id !== msgId);
  }
  public async deleteWebhook(webhookId: string) {
    await this.delete(`guild/${this.currentGuild?.id}/webhook/${webhookId}`);
    this.currentGuild!.webhooks = this.currentGuild!.webhooks.filter(el => el.id !== webhookId);
  }
}
