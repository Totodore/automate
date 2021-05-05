import { MessageModel } from './../../../../models/api.model';
import { Component, OnInit } from '@angular/core';
import { APIState } from 'src/app/models/sys.model';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-last-messages',
  templateUrl: './last-messages.component.html',
  styleUrls: ['./last-messages.component.scss']
})
export class LastMessagesComponent implements OnInit {

  
  public status = APIState.LOADING;
  public messages: MessageModel[] = [];

  public readonly columns = ["Server", "Description", "Message", "Author", "Attachments"];
  public readonly cdn = environment.discordCdn;
  public expandedRow?: MessageModel;

  constructor(
    private readonly api: ApiService
  ) { }

  public async ngOnInit(): Promise<void> {
    this.messages = await this.api.getLastMessages() || [];
    if (!this.messages)
      this.status = APIState.ERROR;
    else
      this.status = APIState.LOADED;
    console.log(this.messages);
  }

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
