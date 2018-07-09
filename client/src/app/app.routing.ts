import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MainPageComponent} from './main-page/main-page.component';
import {ViewUserComponent} from './view-user/view-user.component';
import {UpdateUserComponent} from './update-user/update-user.component';
import {DeleteUserComponent} from './delete-user/delete-user.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ImageDetailComponent} from './image-detail/image-detail.component';
import {FileDetailComponent} from './file-detail/file-detail.component';
import { StudentsDetailComponent} from './students-detail/students-detail.component';
import { PublicationEditComponent } from './publication-edit/publication-edit.component';
import { DutyDetailComponent} from './duty-detail/duty-detail.component';
import { DutyAddComponent } from './duty-add/duty-add.component';
import { DeletePublicationComponent } from './delete-publication/delete-publication.component';
import { ForoaComponent } from './foroa/foroa.component';
import { ChatComponent } from './chat/chat.component';


const appRoutes: Routes = [

  {path: 'profile/:user._id', component: ViewUserComponent},
  {path: 'delete-user/:user._id', component: DeleteUserComponent},
  {path: 'update-user', component: UpdateUserComponent},
  {path: 'login', component: LoginComponent},
  {path: 'foroa', component: ForoaComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'students', component: StudentsDetailComponent},
  {path: 'duties', component: DutyDetailComponent},
  {path: 'duty/:id', component: DutyDetailComponent},
  {path: 'addDuty/:mota', component: DutyAddComponent},
  {path: 'addDuty/:mota/:eginbeharraId', component: DutyAddComponent},
  {path: 'main-page', component: MainPageComponent},
  {path: 'imagen/:id', component: ImageDetailComponent},
  {path: 'file/:id', component: FileDetailComponent},
  {path: 'editPublication/:id', component: PublicationEditComponent},
  {path: 'editPublication/:id/:mota', component: PublicationEditComponent},
  {path: 'deletePublication/:id/:mota', component: DeletePublicationComponent},
  {path: '**', component: LoginComponent} //* no hay nada en el path -> redirigir a pag principal (en lugar de 404). Esto tiene que ir al final siempre!!
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
