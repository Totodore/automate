import { SnackbarService } from './../../../services/snackbar.service';
import { DiscordGuild } from './../../../models/api.model';
import { ApiService } from './../../../services/api.service';
import { Component, OnInit, Sanitizer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  public done = false;
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
    this.dispIframe = true;
    const discordWindow = window.open(this.botLink + this.id, 'newwindow', 'height=670,width=400,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no');
    discordWindow?.addEventListener("close", () => this.dispIframe = this.done ? this.dispIframe : false);
    const subscribtion = this.api.getCreatedGuild(this.id!).subscribe(el => {
      this.api.profile!.guilds.find(el => el.id == this.id)!.added = true;
      discordWindow?.close();
      this.router.navigateByUrl(`/board/${this.id}`);
      subscribtion.unsubscribe();
    }, (err) => { console.error(err); this.onError() }, () => this.onError());
  }

  public onError() {
    this.dispIframe = false;
    this.snackbar.snack("Impossible to add Automate to " + this.guild!.name);
  }

  public get guild(): DiscordGuild | undefined {
    return this.api.profile?.guilds.find(el => el.id == this.id);
  }

}
