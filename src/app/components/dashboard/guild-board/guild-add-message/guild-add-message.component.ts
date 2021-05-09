import { GuildReqModel, MemberModel } from './../../../../models/api.model';
import { ApiService } from './../../../../services/api.service';
import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CronOptions } from 'cron-editor';
import { toString as cronDescriptor } from "cronstrue";
import { GuildElement } from 'src/app/models/api.model';
@Component({
  selector: 'app-guild-add-message',
  templateUrl: './guild-add-message.component.html',
  styleUrls: ['./guild-add-message.component.scss']
})
export class GuildAddMessageComponent implements AfterViewInit {


  public cron = "* * * * 12";
  public description: string | null = "";
  public message: string = "";
  public expandedMessage = false;
  public inputMode: InputMode = null;
  public suggestions: (MemberModel | GuildElement)[] = [];
  
  private needle = "";

  @ViewChild("textarea")
  private textarea?: ElementRef<HTMLTextAreaElement>;

  @Input()
  public guild?: GuildReqModel;

  public readonly cronOptions: CronOptions = {
       
    defaultTime: "00:00:00",

    hideMinutesTab: true,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: true,
    hideAdvancedTab: true,
    removeSeconds: true,
    removeYears: true,
    hideSeconds: false,

    use24HourTime: true,

    formInputClass: 'cron-editor-material-control',
    formSelectClass: 'cron-editor-material-control',
    formCheckboxClass: "",
    formRadioClass: ""

 };
  constructor(
    private readonly api: ApiService
  ) { }

  public ngAfterViewInit(): void {
    (document.querySelector("a[aria-controls=hourly][role=tab]") as HTMLElement)?.click();
  }

  public onCronChange(e: string) {
    try {
      this.description = cronDescriptor(e, {
        use24HourTimeFormat: true,
        verbose: true
      });
    } catch (error) { this.description = null }
  }

  public async onInput(e: InputEvent) {
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
    
    if (this.inputMode && this.guild && this.needle.length > 0) {
      if (this.inputMode === "@") {
        const needle = this.needle.toLowerCase();
        this.suggestions = [
          ...await this.api.getMembers(needle, this.guild.id),
          ...this.guild.roles.filter(el => el.name.toLowerCase().includes(needle.substr(1))).map(el => {
            if (el.name.startsWith("@"))
              el.name = el.name.substr(1);
            return el;
          })
        ];
        console.log(this.suggestions);
      } else {
        const needle = this.needle.toLowerCase().delete(0, 1);
        this.suggestions = this.guild.channels.filter(el => el.name.toLowerCase().includes(needle));
      }
    }
    console.log(this.inputMode, this.suggestions, e.inputType);
  }

  public onSuggestionsClick(el: GuildElement) {
    this.message = this.message.substring(0, this.message.lastIndexOf(this.inputMode!)) + this.inputMode + el.name;
    this.needle = "";
    this.inputMode = null;
    this.suggestions = [];
  }

}

type InputMode = null | "#" | "@";