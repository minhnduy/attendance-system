import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NgOpenCVModule } from 'ng-open-cv';
import { FaceDetectionComponent } from './face-detection/face-detection.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HelloComponent } from './hello/hello.component';
import {OpenCVOptions} from 'ng-open-cv/public_api';
import { NgxPicaModule } from '@digitalascetic/ngx-pica';
import { RegisterFaceComponent } from './register-face/register-face.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

const openCVConfig: OpenCVOptions = {
  scriptUrl: `assets/opencv/opencv.js`,
  wasmBinaryFile: 'wasm/opencv_js.wasm',
  usingWasm: true
};

@NgModule({
   declarations: [
      AppComponent,
      FaceDetectionComponent,
      HomeComponent,
      HelloComponent,
      RegisterFaceComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      NgOpenCVModule.forRoot(openCVConfig),
      RouterModule,
      AppRoutingModule,
      NgxPicaModule,
      BrowserAnimationsModule,
      CommonModule,
      ToastrModule.forRoot() // ToastrModule added
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
