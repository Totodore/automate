import { SnackbarService } from './../../../services/snackbar.service';
import { DiscordGuild } from './../../../models/api.model';
import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-no-guild',
  templateUrl: './no-guild.component.html',
  styleUrls: ['./no-guild.component.scss']
})
export class NoGuildComponent implements OnInit {

  public id?: string;
  public readonly cdn = environment.discordCdn;
  public readonly botLink = environment.botLink;
  public dispIframe = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService,
    private readonly router: Router,
    private readonly snackbar: SnackbarService,
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(e => this.id = e.get("id") || undefined);
  }

  public onDispIframe() {
    if (!this.id)
      return;
    this.dispIframe = true;
    const discordWindow = window.open(this.botLink + this.id, 'newwindow', 'height=670,width=400,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no');

    const handle = setInterval(() => {
      if (discordWindow?.closed) {
        clearInterval(handle);
        this.dispIframe = false;
      }
    }, 1000);

    const subscribtion = this.api.getCreatedGuild(this.id).subscribe(() => {
      if (!this.api.profile)
        return;
      const guild = this.api.profile.guilds.find(el => el.id == this.id);
      if (guild)
        guild.added = true;
      this.dispIframe = false;
      discordWindow?.close();
      this.router.navigateByUrl(`/board/${this.id}`);
      subscribtion.unsubscribe();
    }, (err) => { console.error(err); this.onError() }, () => this.onError());
  }

  public onError() {
    this.dispIframe = false;
    this.snackbar.snack("Impossible to add Automate to " + this.guild?.name + ", try to reload the application !");
  }

  public get guild(): DiscordGuild | undefined {
    return this.api.profile?.guilds.find(el => el.id == this.id);
  }

}
