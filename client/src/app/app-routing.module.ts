import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceDetectionComponent } from './face-detection/face-detection.component';
import { HomeComponent } from './home/home.component';
import { HelloComponent } from './hello/hello.component';
import { RegisterFaceComponent } from './register-face/register-face.component';

const routes: Routes = [
  { path: 'hello', component: HelloComponent },
  { path: 'checkin', component: FaceDetectionComponent },
  { path: 'register', component: RegisterFaceComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
