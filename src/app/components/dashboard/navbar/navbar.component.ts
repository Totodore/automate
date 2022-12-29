import { ApiService } from './../../../services/api.service';
import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { Discord } from "src/app/models/discord.model";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @ViewChild("wrapper")
  public wrapper?: ElementRef<HTMLDivElement>

  @Input()
  public currentGuildId?: string;

  @Output()
  public readonly guildClick = new EventEmitter<Discord.GuildInfo>();

  public readonly cdn = environment.discordCdn;

  public readonly window = window;

  constructor(
    public readonly api: ApiService,
  ) { }

  
  public onGuildDrop(event: CdkDragDrop<Discord.GuildInfo[]>) {
    if (this.api.profile?.guilds)
      moveItemInArray(this.api.profile.guilds, event.previousIndex, event.currentIndex);
  }

  public onGuildClick(guild?: Discord.GuildInfo) {
    this.guildClick.emit(guild);
  }
  
  public get guilds(): Discord.GuildInfo[] | undefined {
    return this.api.profile?.guilds;
  }
}
