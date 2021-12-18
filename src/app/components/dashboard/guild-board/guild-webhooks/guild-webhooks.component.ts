import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/components/utils/confirm/confirm.component';
import { DiscordGuild, GuildReqModel, WebhookInfo } from 'src/app/models/api.model';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { checkAdminPermissions } from 'src/app/utils/perms.util';
import { environment } from 'src/environments/environment';
import { GuildEditWebhookComponent } from './guild-edit-webhook/guild-edit-webhook.component';

@Component({
  selector: 'app-guild-webhooks',
  templateUrl: './guild-webhooks.component.html',
  styleUrls: ['./guild-webhooks.component.scss']
})
export class GuildWebhooksComponent implements OnInit {

  @Input()
  public discordGuild?: DiscordGuild;

  public guild?: GuildReqModel;
  public readonly cdn = environment.discordCdn;
  public readonly columns = ["Name", "Channel", "Messages"];
  public toggledRow?: string;
  public dataSource = new MatTableDataSource<WebhookInfo>();

  constructor(
    private readonly snackbar: SnackbarService,
    public readonly api: ApiService,
    private readonly dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    if (this.isAdmin)
      this.columns.push("Actions");
    this.refresh();
  }

  public editWebhook(webhook: WebhookInfo): void {
    this.dialog.open(GuildEditWebhookComponent, { data: webhook });
  }

  public removeWebhook(webhookId: string) {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Are you sure to delete this webhook ? All messages working with this webhook will then be sent by the quota system" });
    dialog.componentInstance.confirm.subscribe(async () => {
      dialog.close();
      try {
        await this.api.deleteWebhook(webhookId);
        this.snackbar.snack("Webhook removed!");
        this.refresh();
      } catch (error) {
        console.error(error);
        this.snackbar.snack("Ooops, impossible to delete this webhook");
      }
    });
  }

  public getChannelName(id: string) {
    return this.api.currentGuild?.channels.find(el => el.id === id)?.name;
  }

  public getMessageCount(channelId: string) {
    return this.api.currentGuild?.messages?.filter(el => el.channelId === channelId)?.length || 0;
  }

  public refresh() {
    this.dataSource.data = this.api.currentGuild!.webhooks;
  }

  public get isAdmin(): boolean {
    return checkAdminPermissions(this.discordGuild?.permissions || 0);
  }

}
