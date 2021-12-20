import { ApiService } from 'src/app/services/api.service';
import { GuildOptionsComponent } from './../guild-options/guild-options.component';
import { DiscordGuild, GuildReqModel } from './../../../../models/api.model';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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

  @Input()
  public admin = false;

  @ViewChild("wrapper")
  private headerWrapper!: ElementRef<HTMLDivElement>;

  public stickyHeader = false;

  public readonly cdn = environment.discordCdn;

  constructor(
    private readonly dialogs: MatDialog,
    public readonly api: ApiService
  ) {}

  public ngOnInit(): void {
    document.querySelector("app-guild-board")?.addEventListener("scroll", () => this.onScroll());
  }

  public onScroll() {
    this.stickyHeader = this.headerWrapper.nativeElement.getBoundingClientRect().top == 0;
  }
  
  public onOptionsClick() {
    this.dialogs.open(GuildOptionsComponent, {
      data: [this.discordGuild, this.api.currentGuild],
      maxHeight: "90%",
    });
  }

  public onPremiumClick() {
    
  }
}
