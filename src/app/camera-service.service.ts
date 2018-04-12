// 10.5.5.100
// 255.255.255.0
//wave4734
import {
  Injectable
} from "@angular/core";
import {
  HTTP
} from "@ionic-native/http";
import {
  Http
} from '@angular/http';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer';
import {
  File
} from '@ionic-native/file';
import {
  Platform
} from 'ionic-angular';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from "angularfire2/storage";
import {
  Observable
} from 'rxjs/Observable';
import {
  map
} from 'rxjs/operators/map';
import { snapshotChanges } from "angularfire2/database";

@Injectable()
export class CameraServiceService {
  http;
  httpmodule;
  listLink = "http://10.5.5.9:8080/gp/gpMediaList";
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  imageToShow: any;
  isImageLoading;
  uploadProgress: Observable < number > ;
  uploadState;

  constructor(
    httpmodule: Http,
    public plt: Platform,
    http: HTTP,
    private transfer: FileTransfer,
    private afStorage: AngularFireStorage,
    private file: File
  ) {
    this.http = http;
    this.httpmodule = httpmodule;

  }

  fileTransfer: FileTransferObject = this.transfer.create();

  getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (!max || parseInt(arr[i][prop]) > parseInt(max[prop])) max = arr[i];
    }
    return max;
  };

  getPhotosList() {
    return this.http.get(this.listLink, {}, {})
  };
  downloadPhoto(url, filePath) {
    return this.http.downloadFile(url, {}, {}, this.file.dataDirectory + filePath);
  };


  takePhoto() {
    return this.http.get('http://10.5.5.9/gp/gpControl/command/shutter?p=1', {}, {})
      .then(result => {
        return new Promise(resolve => setTimeout(resolve, 2000))
      })
      .then(result => {
        return this.http.get(this.listLink, {}, {})
      }, err => console.log(err))
      .then(data => {
        let newPhotos = JSON.parse(data.data).media[0].fs;
        let imageToShow = 'http://10.5.5.9:8080/videos/DCIM/100GOPRO/' + this.getMax(newPhotos, "mod").n;
        return this.downloadPhoto(imageToShow, 'temp.jpg')
      }, err => console.log(err))
      .then((entry) => {
        console.log('download complete: ' + entry.toURL());
        let PhotoBlob = entry.toURL();
        return this.file.readAsArrayBuffer(this.file.dataDirectory, 'temp.jpg')
      }, (error) => {
        console.log(error);
      })
      .then((str) => {
        let blob = new Blob([str], {
          type: "image/jpeg"
        });
        let randomId = Math.random()
          .toString(36)
          .substring(2);
        this.ref = this.afStorage.ref(randomId);
        var fileName = Math.random().toString(36).substring(2);
        return this.afStorage.ref('images/' + fileName + ".jpg").put(blob);
        // this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
        // this.uploadProgress = this.task.percentageChanges();
      }, (reason) => {
        console.log("Файл не прочитан:" + reason)
      }) 
  };

  sendToBack(url) {
    return this.httpmodule.get(url);
  };
}
