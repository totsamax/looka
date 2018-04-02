import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Http} from "@angular/http";
import { ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from "angularfire2/storage";
import {CameraServiceService} from "../../app/camera-service.service"

@Component({
  selector: "page-l-ooka",
  templateUrl: "l-ooka.html",
  providers:[CameraServiceService]
})
export class LOOKAPage {
  recentImgUrl;
  checked = true;
  http: Http;
  cameraUrl = "http://10.5.5.9:8080/";
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  imageToShow: any;
  isImageLoading;
  uploadProgress;
  cameraService:CameraServiceService;
  text:string;

  constructor(
    public navCtrl: NavController,
    http: Http,
    private afStorage: AngularFireStorage,
    cameraService:CameraServiceService
  ) {
    this.http = http;
    this.cameraService=cameraService;
    this.cameraService.getPhotosList().subscribe(data => {
      this.text=data;
    });
  }
  upload() {
    this.http
      .get("https://www.joshmorony.com/static/logo.png", {
        responseType: ResponseContentType.Blob
      })
      .map(res => res.blob())
      .subscribe(data => {
        const randomId = Math.random()
          .toString(36)
          .substring(2);
        this.ref = this.afStorage.ref(randomId);
        this.task = this.ref.put(data);
        this.uploadProgress = this.task.percentageChanges();
      });
  }
  getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (!max || parseInt(arr[i][prop]) > parseInt(max[prop])) max = arr[i];
    }
    return max;
  }

  getImage(imageUrl) {

    this.http
      .get(imageUrl, {
        responseType: ResponseContentType.Blob
      })
      .map(res => res.blob())
      .subscribe(data => {
      this.imageToShow= this.createImageFromBlob(data);
      });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        this.imageToShow = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
