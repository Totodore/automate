import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentChecked {

  public currentGuildId?: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly progress: ProgressService,
    private readonly changeDetector: ChangeDetectorRef,
  ) { }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.currentGuildId = this.route.snapshot?.firstChild?.paramMap.get("id") || undefined;
    this.router.events.subscribe(e => {
      if (e instanceof ChildActivationEnd && e.snapshot.component === DashboardComponent) {
        this.currentGuildId = e.snapshot?.firstChild?.paramMap.get("id") || undefined;
      }
    })
  }

}
