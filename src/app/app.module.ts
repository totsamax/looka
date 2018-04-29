import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LOOKAPage } from '../pages/l-ooka/l-ooka';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {AngularFireModule} from 'angularfire2';
import {FirebaseService} from './../providers/firebase-service/firebase-service';
import {HTTP} from "@ionic-native/http";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Keyboard} from '@ionic-native/keyboard';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BrMaskerModule } from 'brmasker-ionic-3';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBhuI5kmjpdrRLlFUpoR05DuPcrWAg5gQI",
  authDomain: "looka-app.firebaseapp.com",
  databaseURL: "https://looka-app.firebaseio.com",
  projectId: "looka-app",
  storageBucket: "looka-app.appspot.com",
  messagingSenderId: "455079341262"
};

@NgModule({
  declarations: [
    MyApp,
    LOOKAPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserAnimationsModule,
    BrMaskerModule,
    RoundProgressModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LOOKAPage
  ],
  providers: [
    StatusBar,
    Keyboard,
    SplashScreen,
    FirebaseService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HTTP,File, FileTransfer, FileTransferObject
  ]
})
export class AppModule {
  
}
