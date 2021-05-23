import { SnackbarService } from './../../../services/snackbar.service';
import { environment } from './../../../../environments/environment';
import { MessageModel } from './../../../models/api.model';
import { APIState } from './../../../models/sys.model';
import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit { 

  public messages!: MessageModel[];
  public status = APIState.LOADING;

  constructor(
    public readonly api: ApiService,
    private readonly router: Router,
    private readonly snackbar: SnackbarService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.messages = await this.api.getLastMessages() || [];
    if (!this.messages)
      this.status = APIState.ERROR;
    else
      this.status = APIState.LOADED;
  }

  public async logout() {
    this.api.logout();
    this.router.navigateByUrl("/");
    this.snackbar.snack("You have been successfuly disconnected!");
  }
  
  public get displayable() {
    return this.status != APIState.LOADING;
  }
}
