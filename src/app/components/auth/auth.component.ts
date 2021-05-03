import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public readonly loginLink = environment.oauthLink;
  
  constructor() { }

  ngOnInit(): void {
  }

}
