import { environment } from './../../../environments/environment';
import { Component } from '@angular/core';

@Component({
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  public readonly loginLink = environment.oauthLink;
  public imgLoaded = false;
}
