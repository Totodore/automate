import { ApiService } from 'src/app/services/api.service';
import { GuildOptionsComponent } from './../guild-options/guild-options.component';
import { DiscordGuild, GuildReqModel } from './../../../../models/api.model';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-guild-header',
  templateUrl: './guild-header.component.html',
  styleUrls: ['./guild-header.component.scss']
})
export class GuildHeaderComponent implements OnInit {

  @Input()
  public discordGuild!: DiscordGuild;

  @Input()
  public bodyWrapper: HTMLElement | null = null;

  @ViewChild("wrapper")
  private headerWrapper!: ElementRef<HTMLDivElement>;
  
  private readonly baseHeaderPos = 50;
  private baseSize?: number;

  public readonly cdn = environment.discordCdn;

  constructor(
    private readonly dialogs: MatDialog,
    public readonly api: ApiService
  ) {}

  public ngOnInit(): void {
    // this.bodyWrapper?.addEventListener("scroll", () => this.onScroll())
  }

  private onScroll() {
    const currentPos = this.headerWrapper.nativeElement.getBoundingClientRect().top;
    this.baseSize ??= this.percentwidth(this.headerWrapper.nativeElement);
    console.log("base size", this.baseSize);
    console.log(100 - ((1 - currentPos / this.baseHeaderPos) * (100 - this.baseSize)));
    this.headerWrapper.nativeElement.style.width = `${100 - (1 - currentPos / this.baseHeaderPos) * (100 - this.baseSize)}%`;
  }

  private percentwidth(el: HTMLElement): number {
    const pa: HTMLElement = el.offsetParent as HTMLElement || el;
    return Math.floor((el.offsetWidth / pa.offsetWidth) * 100)
  }
  
  public onOptionsClick() {
    this.dialogs.open(GuildOptionsComponent, {
      data: [this.discordGuild, this.api.currentGuild],
      maxHeight: "90%",
      // height: "70%"
      // width: "800px"
    });
  }
}
