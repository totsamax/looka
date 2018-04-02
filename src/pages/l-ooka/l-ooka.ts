import {Component} from '@angular/core';
import {NavController}from 'ionic-angular';
import {Http}from '@angular/http'; 
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';


@Component({
    selector: 'page-l-ooka',
    templateUrl: 'l-ooka.html'
  }

) export class LOOKAPage {
  recentImgUrl;
  checked = true;
  http: Http;
  cameraUrl = "http://10.5.5.9:8080/";
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  constructor(public navCtrl: NavController, http: Http,private afStorage: AngularFireStorage) {
    this.http = http;
  }
  getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (!max || parseInt(arr[i][prop]) > parseInt(max[prop])) max = arr[i];
    }
    return max;
  };
  getImageURL() {
    let url = `https://cdn-images-1.medium.com/fit/c/60/60/1*ZHHmDIuhdQBuOAMn1_uxlQ.jpeg`;
    //let url = `${this.cameraUrl}/gp/gpMediaList`;
    return this.http.get(url).subscribe(res => {
      //this.recentImgUrl=res.blob();
      console.log(res.blob());
    });
  };
  upload(){
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put('https://cdn-images-1.medium.com/fit/c/60/60/1*ZHHmDIuhdQBuOAMn1_uxlQ.jpeg');
  };
}
