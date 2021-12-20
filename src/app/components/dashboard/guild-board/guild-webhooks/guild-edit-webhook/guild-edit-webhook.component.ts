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

  public async onSelectImage(image: File) {
    this.loading = true;
    const obj = URL.createObjectURL(image);
    const img = document.createElement('img');
    img.src = obj;
    await new Promise((resolve) => img.onload = resolve);
    if (img.width != 256 && img.height != 256) {
      this.snackbar.snack("Image must be 256x256");
    } else {
      this.newImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(obj);
      this.newImage = image;
    }
    this.loading = false;
  }

  public async onConfirm(reset = false) {
    if (!reset && !this.newImage && this.nameField.value == this.webhook.name)
      return;
    try {
      this.loading = true;
      const res = await this.api.patchWebhook({ ...this.webhook, name: this.nameField.value }, this.newImage, reset);
      this.webhook.name = res.name;
      this.webhook.avatar = res.avatar;
      this.dialog.close();
      this.snackbar.snack("Webhook updated");
    } catch (e) {
      console.error(e);
      this.snackbar.snack("Ooops, impossible to update this webhook");
    } finally {
      this.loading = false;
    }
  }

}
