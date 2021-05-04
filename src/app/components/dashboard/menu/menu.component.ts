import { MessageModel } from './../../../models/api.model';
import { APIState } from './../../../models/sys.model';
import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public status = APIState.LOADING;
  public messages: MessageModel[] = [];

  public readonly columns = ["Server", "Description", "Author", "Attachments"];
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
