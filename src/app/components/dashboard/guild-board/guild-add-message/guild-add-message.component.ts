import { SnackbarService } from './../../../../services/snackbar.service';
import { MemberModel, MessageModel, PostFreqMessageInModel, UserModel, PostPonctMessageInModel } from './../../../../models/api.model';
import { ApiService } from './../../../../services/api.service';
import { Component, AfterViewInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { toString as cronDescriptor } from "cronstrue";
import { GuildElement } from 'src/app/models/api.model';
import { MentionConfig } from 'angular-mentions';
@Component({
  selector: 'app-guild-add-message',
  templateUrl: './guild-add-message.component.html',
  styleUrls: ['./guild-add-message.component.scss']
})
export class GuildAddMessageComponent implements AfterViewInit {


  public cron: string = "* * * * 12";
  public date = new Date();
  public description: string | null = "";
  public message: string = "";
  public expandedMessage = false;
  public inputMode: InputMode = null;
  public suggestions: (MemberModel | GuildElement)[] = [];
  public selectedIndex = 0;
  public selectedChannel?: string;
  public addedTags: Map<string, string> = new Map();

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
  
  private dateMode = false;

  @ViewChild("textarea")
  private textarea?: ElementRef<HTMLTextAreaElement>;

  @Output()
  public readonly newMessage = new EventEmitter<MessageModel>();

  constructor(
    public readonly api: ApiService,
    private readonly snackbar: SnackbarService
  ) { }

  public ngAfterViewInit(): void {
    (document.querySelector("a[aria-controls=hourly][role=tab]") as HTMLElement)?.click();
  }

  public onCronChange(e: string | Date) {
    if (e instanceof Date) {
      this.description = `The ${e.getDay().toString().padStart(2, '0')}/${e.getMonth().toString().padStart(2, '0')}/${e.getFullYear()} at ${e.getHours().toString().padStart(2, '0')}:${e.getMinutes().toString().padStart(2, '0')}`;
      this.dateMode = true;
    }
    else if (typeof e === 'string') {
      try {
        this.cron = e;
        this.description = cronDescriptor(e, {
          use24HourTimeFormat: true,
          verbose: true
        });
        this.dateMode = false;
      } catch (error) { this.description = null }
    }
  }

  public onCronError(e: string) {
    if (e) {
      this.description = e;
      this.expandedMessage = true;
    }
  }
  public async onInput(keyword: string) {
    if (keyword.length < 2) {
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
    this.message = this.message.substring(0, this.message.lastIndexOf(this.inputMode!)) + this.inputMode + el.name + " ";
    this.addedTags.set(this.inputMode + el.name, el.id);
    this.suggestions = [];
    this.inputMode = null;
    console.log(this.addedTags.entries());
  }

  public async addMessage() {
    let parsedMessage = this.message;
    for (const [tag, id] of this.addedTags.entries())
      parsedMessage = parsedMessage.replaceAll(tag, `<${tag.substr(0, 1)}${id}>`);
    try {
      const msg = !this.dateMode ? await this.api.postFreqMessage([], new PostFreqMessageInModel(
        this.selectedChannel!,
        this.description!,
        this.message,
        parsedMessage,
        this.cron
      )) : await this.api.postPonctualMessage([], new PostPonctMessageInModel(
        this.selectedChannel!,
        this.description!,
        this.message,
        parsedMessage,
        this.date.toString()
      ));
      msg.creator = new UserModel(this.api.profile!.id, this.api.profile!.username, this.api.profile!.avatar);
      this.api.currentGuild?.messages.push(msg);
      this.newMessage.emit(msg);
      this.description = null;
      this.cron = "* * * * 12";
      this.addedTags = new Map();
      this.message = "";
      this.inputMode = null;
      this.selectedChannel = undefined;
      this.selectedIndex = 0;
      this.snackbar.snack("Message successfuly added!");
    } catch (e) {
      console.error(e);
      this.snackbar.snack("Impossible to post this message!");
    }
  }

}

type InputMode = null | "#" | "@";