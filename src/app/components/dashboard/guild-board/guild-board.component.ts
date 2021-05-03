import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-guild-board',
  templateUrl: './guild-board.component.html',
  styleUrls: ['./guild-board.component.scss']
})
export class GuildBoardComponent implements OnInit {

  @Input()
  public guildId?: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
