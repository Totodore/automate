import { GuildGuard } from './guards/guild.guard';
import { NoGuildComponent } from './components/dashboard/no-guild/no-guild.component';
import { NoGuildGuard } from './guards/no-guild.guard';
import { GuildBoardComponent } from './components/dashboard/guild-board/guild-board.component';
import { MenuComponent } from './components/dashboard/menu/menu.component';
import { NoUserGuard } from './guards/no-user.guard';
import { UserGuard } from './guards/user.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthComponent } from './components/auth/auth.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "", component: AuthComponent, canActivate: [NoUserGuard] },
  {
    path: "board", component: DashboardComponent, canActivate: [UserGuard],
    children: [
      { path: "", component: MenuComponent },
      { path: ":id", component: GuildBoardComponent, canActivate: [NoGuildGuard] },
      { path: ":id/add", component: NoGuildComponent, canActivate: [GuildGuard] }
    ]
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
