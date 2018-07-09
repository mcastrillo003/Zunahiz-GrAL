import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders} from './app.routing';
import { ChatService } from './services/chat.service';

import { AppComponent } from './app.component';

import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

import { MainPageComponent } from './main-page/main-page.component';
import { PublicationEditComponent } from './publication-edit/publication-edit.component';
import { DeletePublicationComponent } from './delete-publication/delete-publication.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { LoginComponent} from './login/login.component';
import { RegisterComponent} from './register/register.component';
import { ImageDetailComponent} from './image-detail/image-detail.component';
import { FileDetailComponent} from './file-detail/file-detail.component';
import { StudentsDetailComponent} from './students-detail/students-detail.component';
import { DutyDetailComponent} from './duty-detail/duty-detail.component';
import { DutyAddComponent } from './duty-add/duty-add.component';
import { ForoaComponent } from './foroa/foroa.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    FileDetailComponent,
    ImageDetailComponent,
    ViewUserComponent,
    UpdateUserComponent,
    LoginComponent,
    RegisterComponent,
    StudentsDetailComponent,
    DeleteUserComponent,
    PublicationEditComponent,
    DutyDetailComponent,
    DutyAddComponent,
    ForoaComponent,
    DeletePublicationComponent,
    ChatComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    CommonModule,
    routing,
    NgxMyDatePickerModule,
    NgxMyDatePickerModule.forRoot()
  ],
  providers: [
    appRoutingProviders,
    ChatService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
