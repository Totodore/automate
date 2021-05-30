import { MessageModel } from './../../../../models/api.model';
import { Component, Input, OnInit } from '@angular/core';
import { APIState } from 'src/app/models/sys.model';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-last-messages',
  templateUrl: './last-messages.component.html',
  styleUrls: ['./last-messages.component.scss']
})
export class LastMessagesComponent {

  @Input()  
  public status!: APIState;

  @Input()
  public messages!: MessageModel[];

  public readonly columns = ["Server", "Description", "Message", "Author"];
  public readonly cdn = environment.discordCdn;

  public get errored() {
    return this.status === APIState.ERROR;
  }
  public get loading() {
    return this.status === APIState.LOADING;
  }
  public get loaded() {
    return this.status === APIState.LOADED;
  }

}
