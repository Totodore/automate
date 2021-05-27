import { GuildTableComponent } from './../guild-table/guild-table.component';
import { SnackbarService } from './../../../../services/snackbar.service';
import { GuildReqModel, MemberModel, MessageModel, PostFreqMessageInModel, UserModel } from './../../../../models/api.model';
import { ApiService } from './../../../../services/api.service';
import { Component, AfterViewInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { toString as cronDescriptor } from "cronstrue";
import { GuildElement } from 'src/app/models/api.model';
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
  
  private needle = "";

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
      console.log(e);
      this.description = `The ${e.getDay().toString().padStart(2, '0')}/${e.getMonth().toString().padStart(2, '0')}/${e.getFullYear()} at ${e.getHours().toString().padStart(2, '0')}:${e.getMinutes().toString().padStart(2, '0')}`;
    }
    else if (typeof e === 'string') {
      try {
        this.cron = e;
        this.description = cronDescriptor(e, {
          use24HourTimeFormat: true,
          verbose: true
        });
      } catch (error) { this.description = null }
    }
  }

  public async onInput(e: Event) {
    if (!(e instanceof InputEvent))
      return;
    if ((e.data == " " && this.inputMode) || (e.inputType === "deleteContentBackward" && e.data === this.inputMode)) {
      this.inputMode = null;
      this.needle = "";
    }
    else if ((e.data === "#" || e.data === "@") && !this.inputMode)
      this.inputMode = e.data;
    if (e.inputType === "insertText" && this.inputMode)
      this.needle += e.data;
    else if (e.inputType === "deleteContentBackward" && this.inputMode && this.textarea) {
      this.needle = this.needle.delete(this.textarea.nativeElement.selectionStart, 1);
      if (this.needle.length === 0) {
        this.inputMode = null;
        this.suggestions = [];
      }
    }
    
    if (this.inputMode && this.api.currentGuild && this.needle.length > 0) {
      if (this.inputMode === "@") {
        const needle = this.needle.toLowerCase();
        this.suggestions = [
          ...await this.api.getMembers(needle),
          ...this.api.currentGuild.roles.filter(el => el.name.toLowerCase().includes(needle.substr(1))).map(el => {
            if (el.name.startsWith("@"))
              el.name = el.name.substr(1);
            return el;
          })
        ];
      } else {
        const needle = this.needle.toLowerCase().delete(0, 1);
        this.suggestions = this.api.currentGuild.channels.filter(el => el.name.toLowerCase().includes(needle));
      }
    }
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
    this.message = this.message.substring(0, this.message.lastIndexOf(this.inputMode!)) + this.inputMode + el.name;
    this.needle = "";
    this.inputMode = null;
    this.suggestions = [];
    this.addedTags.set(this.inputMode + el.name, el.id);
  }

  public async addMessage() {
    let parsedMessage = this.message;
    for (const [tag, id] of this.addedTags.entries())
      parsedMessage = parsedMessage.replaceAll(tag, `<${tag.substr(0, 1)}${id}>`);
    try {
      const msg = await this.api.postFreqMessage([], new PostFreqMessageInModel(
        this.selectedChannel!,
        this.description!,
        this.message,
        parsedMessage,
        this.cron
      ));
      msg.creator = new UserModel(this.api.profile!.id, this.api.profile!.displayName, this.api.profile!.avatar);
      this.api.currentGuild?.messages.push(msg);
      this.newMessage.emit(msg);
      (document.querySelector("a[aria-controls=hourly][role=tab]") as HTMLElement)?.click();
      this.description = null;
      this.cron = "* * * * 12";
      this.addedTags = new Map();
      this.message = "";
      this.inputMode = null;
      this.selectedChannel = undefined;
      this.selectedIndex = 0;
      this.needle = "";
      this.snackbar.snack("Message successfuly added!");
    } catch (e) {
      console.error(e);
      this.snackbar.snack("Impossible to post this message!");
    }
  }

}

type InputMode = null | "#" | "@";