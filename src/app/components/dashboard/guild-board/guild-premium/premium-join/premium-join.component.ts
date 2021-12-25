import { ApiService } from './../../../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-premium-join',
  templateUrl: './premium-join.component.html',
  styleUrls: ['./premium-join.component.scss']
})
export class PremiumJoinComponent {

  public loading = false;
  constructor(
    private readonly api: ApiService
  ) { }

  public async goPremium() {
    this.loading = true;
    location.href = `${environment.apiLink}/guild/${this.api.currentGuild!.id}/premium/checkout-session?token=${this.api.token}`;
  }
}
