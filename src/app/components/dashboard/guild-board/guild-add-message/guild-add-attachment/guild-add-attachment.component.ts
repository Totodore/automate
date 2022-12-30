import { Component } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-guild-add-attachment',
  templateUrl: './guild-add-attachment.component.html',
  styleUrls: ['./guild-add-attachment.component.scss']
})
export class GuildAddAttachmentComponent {


  constructor(
    private readonly snackbar: SnackbarService,
  ) { }
  public attachments: File[] = [];

  public onScroll(event: WheelEvent, target: HTMLElement) {
    target.scrollLeft += Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    event.preventDefault();
    event.stopImmediatePropagation();

  }

  public addAttachments(files: FileList | null) {
    if (!files)
      return;
    for (let i = 0; i < files.length; i++) {
      const item = files.item(i);
      if (!item)
        continue;
      if (item.size > 8_000_000) {
        this.snackbar.snack('Attachments cannot be larger than 8MB.');
        continue;
      }
      if (this.attachments.length >= 10) {
        this.snackbar.snack('You can only add 10 attachments at once.');
        break;
      }
      this.attachments.push(item);
    }
  }

  public removeAttachment(i: number) {
    this.attachments.splice(i, 1);
  }
}
