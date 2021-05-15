import { CronEditorModule } from 'cron-editor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http"
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { appearance } from './style/default';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatTabsModule } from "@angular/material/tabs";
import { NavbarComponent } from './components/dashboard/navbar/navbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GuildBoardComponent } from './components/dashboard/guild-board/guild-board.component';
import { MenuComponent } from './components/dashboard/menu/menu.component';
import { MatTableModule } from '@angular/material/table';
import { LastMessagesComponent } from './components/dashboard/menu/last-messages/last-messages.component';
import { AddedGuildsComponent } from './components/dashboard/menu/added-guilds/added-guilds.component';
import { GuildHeaderComponent } from './components/dashboard/guild-board/guild-header/guild-header.component';
import { GuildOptionsComponent } from './components/dashboard/guild-board/guild-options/guild-options.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { GuildTableComponent } from './components/dashboard/guild-board/guild-table/guild-table.component';
import { GuildAddMessageComponent } from './components/dashboard/guild-board/guild-add-message/guild-add-message.component';
import { NoGuildComponent } from './components/dashboard/no-guild/no-guild.component';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    NavbarComponent,
    GuildBoardComponent,
    MenuComponent,
    LastMessagesComponent,
    AddedGuildsComponent,
    GuildHeaderComponent,
    GuildOptionsComponent,
    GuildTableComponent,
    GuildAddMessageComponent,
    NoGuildComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    MatTooltipModule,
    DragDropModule,
    MatTableModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    CronEditorModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
