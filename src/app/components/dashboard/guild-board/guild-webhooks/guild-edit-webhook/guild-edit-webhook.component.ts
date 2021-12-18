import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WebhookInfo } from 'src/app/models/api.model';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-guild-edit-webhook',
  templateUrl: './guild-edit-webhook.component.html',
  styleUrls: ['./guild-edit-webhook.component.scss']
})
export class GuildEditWebhookComponent {

  public nameField: FormControl;
  public newImageUrl?: SafeResourceUrl;
  public newImage?: File;
  public loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public webhook: WebhookInfo,
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService,
    private readonly dialog: MatDialogRef<GuildEditWebhookComponent>,
    private readonly sanitizer: DomSanitizer,
  ) { 
    this.nameField = new FormControl(this.webhook.name, [Validators.required, Validators.minLength(2), Validators.maxLength(32)]);
  }

  public onSelectImage(image: File) {
    this.newImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(image));
    this.newImage = image;
  }

  public async onConfirm() {
    try {
      this.loading = true;
      const res = await this.api.patchWebhook({ ...this.webhook, name: this.nameField.value }, this.newImage);
      this.webhook.name = res.name;
      this.webhook.avatar = res.avatar;
      this.dialog.close();
    } catch (e) {
      console.error(e);
      this.snackbar.snack("Ooops, impossible to update this webhook");
    } finally {
      this.loading = false;
    }
  }

}
