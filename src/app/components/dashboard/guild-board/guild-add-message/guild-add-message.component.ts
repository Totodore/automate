import { StateDataModel, Tab } from './cron-editor/cron-options';
import { SnackbarService } from './../../../../services/snackbar.service';
import { MemberModel, MessageModel, PostFreqMessageInModel, UserModel, PostPonctMessageInModel, MessageType } from './../../../../models/api.model';
import { ApiService } from './../../../../services/api.service';
import { Component, AfterViewInit, Input, ViewChild, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { toString as cronDescriptor } from "cronstrue";
import { GuildElement, PatchMessageModel } from 'src/app/models/api.model';
import { MentionConfig } from 'angular-mentions';
@Component({
  selector: 'app-guild-add-message',
  templateUrl: './guild-add-message.component.html',
  styleUrls: ['./guild-add-message.component.scss']
})
export class GuildAddMessageComponent {


  public expandedMessage = false;
  public inputMode: InputMode = null;
  public suggestions: (MemberModel | GuildElement)[] = [];
  public selectedIndex = 0;

  public messageData = this.baseMessageModel();

  public mentionConfig: MentionConfig = {
    mentions: [
        {
          triggerChar: '@',
          disableSearch: true,
          returnTrigger: true
        },
        {
          triggerChar: '#',
          disableSearch: true,
          returnTrigger: true
        },
    ]
}
  

  @ViewChild("textarea")
  private textarea?: ElementRef<HTMLTextAreaElement>;

  @Output()
  public readonly newMessage = new EventEmitter<MessageModel>();

  @Input()
  public set msg(val: MessageModel) {
    this.messageData.description = val?.description || "";
    this.messageData.editingId = val?.id;
    this.messageData.activeTab = val?.cronTab || "minutes";
    this.messageData.cronState = val?.cronState;
    this.messageData.selectedChannel = val?.channelId;
    this.messageData.message = val?.message || "";
    this.expandedMessage = this.messageData.message?.length > 0;
  }
  
  private dateMode = false;

  constructor(
    public readonly api: ApiService,
    private readonly snackbar: SnackbarService
  ) { }
  
  public onCronChange(e: string | Date) {
    if (e instanceof Date) {
      this.messageData.description = `The ${e.getDate().toString().padStart(2, '0')}/${(e.getMonth() + 1).toString().padStart(2, '0')}/${e.getFullYear()} at ${e.getHours().toString().padStart(2, '0')}:${e.getMinutes().toString().padStart(2, '0')}`;
      this.dateMode = true;
    }
    else if (typeof e === 'string') {
      try {
        this.messageData.cron = e;
        this.messageData.description = cronDescriptor(e, {
          use24HourTimeFormat: true,
          verbose: true
        });
        this.dateMode = false;
      } catch (error) { this.messageData.description = null }
    }
  }

  public onCronError(e: string) {
    if (e) {
      this.messageData.description = e;
      this.expandedMessage = true;
    }
  }

  public onCloseEdit() {
    this.messageData = this.baseMessageModel();
  }
  public async onInput(keyword: string) {
    if (keyword.length < 1) {
      this.suggestions = [];
      this.inputMode = null;
      return;
    }
    if (keyword.startsWith("@") && this.api.currentGuild) {
      this.inputMode = "@";
      this.suggestions = [
        ...(await this.api.getMembers(keyword) ?? []),
        ...this.api.currentGuild.roles.filter(el => el.name.toLowerCase().includes(keyword.substr(1))).map(el => {
          if (el.name.startsWith("@"))
            el.name = el.name.substr(1);
          return el;
        })
      ];
    } else if (keyword.startsWith("#") && this.api.currentGuild) {
      this.inputMode = "#";
      const needle = keyword.toLowerCase().substr(1);
      this.suggestions = this.api.currentGuild.channels.filter(el => el.name.toLowerCase().includes(needle));
    } else this.inputMode = null;
  }

  public onKeydown(e: KeyboardEvent) {
    if (!this.inputMode)
      return;
    if (e.key == "ArrowRight" && this.textarea?.nativeElement.selectionStart === this.textarea?.nativeElement.value.length) {
      if (this.selectedIndex <= this.suggestions.length)
        this.selectedIndex++;
      else this.selectedIndex = 0;
      e.preventDefault();
    } else if (e.key == "ArrowLeft" && this.selectedIndex > 0) {
      this.selectedIndex--;
      e.preventDefault();
    } else if (e.key == "Enter") {
      e.preventDefault();
      this.onSuggestionsClick(this.suggestions[this.selectedIndex]);
    }
  }

  public onSuggestionsClick(el: GuildElement) {
    this.messageData.message = this.messageData.message.substring(0, this.messageData.message.lastIndexOf(this.inputMode!)) + this.inputMode + el.name + " ";
    this.messageData.addedTags.set(this.inputMode + el.name, el.id);
    this.suggestions = [];
    this.inputMode = null;
  }

  public async addMessage() {
    let parsedMessage = this.messageData.message;
    for (const [tag, id] of this.messageData.addedTags.entries())
      parsedMessage = parsedMessage.replaceAll(tag, `<${tag.substr(0, 1)}${id}>`);
    try {
      let msg: MessageModel | undefined;
      if (!this.messageData.editingId) {
        msg = await (!this.dateMode ? this.postFreqMessage(parsedMessage) : this.postPonctMessage(parsedMessage));
        msg.creator = new UserModel(this.api.profile!.id, this.api.profile!.username, this.api.profile!.avatar);
        this.api.currentGuild?.messages.push(msg);
        this.newMessage.emit(msg);
      } else {
        msg = await this.patchMessage(parsedMessage);
        if (!msg)
          throw new Error("Impossible to find the patched message");
      }
      this.messageData = this.baseMessageModel();
      this.inputMode = null;
      this.selectedIndex = 0;
      this.snackbar.snack("Message successfuly added!");
    } catch (e) {
      console.error(e);
      this.snackbar.snack("Impossible to post this message!");
    }
  }

  private async postFreqMessage(parsedMessage: string): Promise<MessageModel> {
    return await this.api.postFreqMessage([], new PostFreqMessageInModel(
      this.messageData.selectedChannel!,
      this.messageData.description!,
      this.messageData.message,
      parsedMessage,
      this.messageData.cron,
      this.messageData.cronState,
      this.messageData.activeTab
    ));
  }

  private async postPonctMessage(parsedMessage: string): Promise<MessageModel> {
    return await this.api.postPonctualMessage([], new PostPonctMessageInModel(
      this.messageData.selectedChannel!,
      this.messageData.description!,
      this.messageData.message,
      parsedMessage,
      this.messageData.date.toString().slice(0, 24),
      this.messageData.cronState,
      this.messageData.activeTab
    ));
  }

  private async patchMessage(parsedMessage: string): Promise<MessageModel | undefined> {
    await this.api.patchMessage(this.messageData.editingId as string, new PatchMessageModel(
      this.dateMode ? this.messageData.date.toString().slice(0, 24) : null,
      this.messageData.selectedChannel!,
      this.messageData.description!,
      this.messageData.message,
      parsedMessage,
      !this.dateMode ? this.messageData.cron : null,
      this.messageData.cronState,
      this.messageData.activeTab,
    ));
    let msg = this.api.currentGuild!.messages.find(el => el.id == this.messageData.editingId);
    if (msg) {
      msg.date = this.messageData.date;
      msg.channelId = this.messageData.selectedChannel || msg.channelId;
      if (this.messageData.selectedChannel)
        msg.channelName = this.api.currentGuild?.channels.find(el => el.id == this.messageData.selectedChannel)?.name;
      msg.creator = new UserModel(this.api.profile!.id, this.api.profile!.username, this.api.profile!.avatar);
      msg.cron = this.messageData.cron;
      msg.cronState = this.messageData.cronState;
      msg.cronTab = this.messageData.activeTab;
      msg.description = this.messageData.description || msg.description;
      msg.message = this.messageData.message;
      msg.parsedMessage = this.messageData.parsedMessage;
      msg.type = this.messageData.date ? MessageType.PONCTUAL : MessageType.FREQUENTIAL;
      msg.updatedDate = new Date();
    }
    return msg;
  }

  private baseMessageModel(): AddMessageModel {
    return {
      addedTags: new Map(),
      cron: "* * * * 12",
      date: new Date(Date.now() + 60_000 * 3),
      description: "",
      message: "",
      parsedMessage: "",
      editingId: null,
      activeTab: "minutes",
    }
  }

}

type InputMode = null | "#" | "@";

export interface AddMessageModel {
  message: string;
  parsedMessage: string;
  cron: string;
  description: string | null;
  editingId: string | null;
  date: Date;
  addedTags: Map<string, string>;
  selectedChannel?: string;
  cronState?: Partial<StateDataModel>;
  activeTab?: Tab;
}