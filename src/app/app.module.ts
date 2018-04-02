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
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LOOKAPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}