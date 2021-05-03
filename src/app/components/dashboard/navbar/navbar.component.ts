import { GuildInfo, Profile } from 'passport-discord';
import { ApiService } from './../../../services/api.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild("wrapper")
  public wrapper?: ElementRef<HTMLDivElement>

  public readonly cdn = environment.discordCdn;
  constructor(
    public readonly api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  
  public onGuildDrop(event: CdkDragDrop<GuildInfo[]>) {
    if (this.api.profile?.guilds)
    moveItemInArray(this.api.profile.guilds, event.previousIndex, event.currentIndex);
  }
  
  public get guilds(): GuildInfo[] | undefined {
    return this.api.profile?.guilds;
  }
}
