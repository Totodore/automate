import { environment } from './../../../../environments/environment';
import { MessageModel } from './../../../models/api.model';
import { APIState } from './../../../models/sys.model';
import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent { }
