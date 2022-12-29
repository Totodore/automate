import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { DiscordGuild, GuildReqModel, MessageModel } from './../../../../models/api.model';
import { SnackbarService } from './../../../../services/snackbar.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfirmComponent } from 'src/app/components/utils/confirm/confirm.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-guild-table',
  templateUrl: './guild-table.component.html',
  styleUrls: ['./guild-table.component.scss']
})
export class GuildTableComponent implements OnInit {

  @Input()
  public discordGuild?: DiscordGuild;

  @Input()
  public admin = false;

  @Output()
  public readonly editMessage = new EventEmitter<MessageModel>();

  public guild?: GuildReqModel;
  public readonly cdn = environment.discordCdn;
  public readonly columns = ["Author", "Channel", "Description", "Message", "Attachments"];
  public toggledRow?: string;
  public dataSource = new MatTableDataSource<MessageModel>();

  constructor(
    private readonly snackbar: SnackbarService,
    public readonly api: ApiService,
    private readonly dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    if (this.admin)
      this.columns.push("Actions");
    this.refresh();
  }

  public async updateMessageState(state: boolean, msgId: string) {
    if (!this.api.currentGuild)
      return;
    try {
      await this.api.patchMessageState(state, msgId);
      this.snackbar.snack(`Message successfully ${state ? "enabled" : "disabled"}!`);
    } catch (e) {
      const msg = this.api.currentGuild.messages.find(el => el.id === msgId);
      if (msg)
        msg.activated = !msg.activated;
      this.snackbar.snack("Ooops, impossible to update this message");
      console.error(e);
    }
  }
  public removeMessage(msgId: string) {
    const dialog = this.dialog.open(ConfirmComponent, { data: "Are you sure to delete this message?" });
    dialog.componentInstance.confirm.subscribe(async () => {
      dialog.close();
      try {
        await this.api.deleteMessage(msgId);
        this.snackbar.snack("Message removed!");
        this.refresh();
      } catch (error) {
        console.error(error);
        this.snackbar.snack("Ooops, impossible to delete this message");
      }
    });
  }

  public getChannelName(id: string) {
    return this.api.currentGuild?.channels.find(el => el.id === id)?.name;
  }

  public refresh() {
    if (!this.api.currentGuild)
      return;
    this.dataSource.data = this.api.currentGuild.messages;
  }
}
