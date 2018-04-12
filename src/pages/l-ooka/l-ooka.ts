import {
  Component,
  DoCheck
} from "@angular/core";
import {
  NavController
} from "ionic-angular";
import {
  Http
} from "@angular/http";
import {
  HTTP
} from "@ionic-native/http";
import {
  ResponseContentType
} from "@angular/http";
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from "angularfire2/storage";
import {
  CameraServiceService
} from "../../app/camera-service.service";
import {
  Platform
} from 'ionic-angular';
import {
  File
} from '@ionic-native/file';
import {
  Observable
} from 'rxjs/Observable';
import {
  map
} from 'rxjs/operators/map';

@Component({
  selector: "page-l-ooka",
  templateUrl: "l-ooka.html",
  providers: [CameraServiceService]
})

export class LOOKAPage implements DoCheck {

  recentImgUrl;
  checked = true;
  http;
  HttpModule;
  cameraUrl = "https://picsum.photos/list";
  selectedPhoto = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Landscape-nature-field-italy_%2824298559796%29.jpg/800px-Landscape-nature-field-italy_%2824298559796%29.jpg";
  listLink = "http://10.5.5.9:8080/gp/gpMediaList";
  selectedPhotoBlob;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  imageToShow: any;
  isImageLoading;
  uploadProgress: Observable < number > ;
  uploadState;
  downloadURL;
  cameraService: CameraServiceService;
  text: string = 'none';
  photos: any;
  newPhotos: any;

  constructor(
    public plt: Platform,
    public navCtrl: NavController,
    http: HTTP,
    httpmodule: Http,
    private afStorage: AngularFireStorage,
    cameraService: CameraServiceService,
    private file: File
  ) {
    this.http = http;
    this.cameraService = cameraService;
    this.plt.ready().then(() => {
      console.log("Платформа готова");
      //this.getImages();
    })
  }

  ngDoCheck() {
    if (this.photos != this.newPhotos) {
      this.photos = this.newPhotos;
    }
  };

  parseInt(str) {
    return parseInt(str, 10);
  };
  encodeURI(str) {
    return encodeURI(str)
  };
  sendToBack(url) {
    this.cameraService.sendToBack(url).subscribe();
  };
  isSelected(photo) {
    photo == this.selectedPhoto ? true : false;
  };
  selectPhoto(photo) {
    this.selectedPhoto = 'http://10.5.5.9:8080/videos/DCIM/100GOPRO/' + photo;
    this.imageToShow = 'http://10.5.5.9:8080/videos/DCIM/100GOPRO/' + photo;
  }


  // upload(selectedPhotoBlob) {
  //   console.log(this.file.dataDirectory + 'temp.jpg');

  //   this.file.readAsArrayBuffer(this.file.dataDirectory, 'temp.jpg').then((str) => {
  //     let blob = new Blob([str], {
  //       type: "image/jpeg"
  //     });
  //     const randomId = Math.random()
  //       .toString(36)
  //       .substring(2);
  //     this.ref = this.afStorage.ref(randomId);
  //     var fileName = Math.random().toString(36).substring(2);
  //     this.task = this.afStorage.ref('images/' + fileName + ".jpg").put(blob);

  //     this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  //     this.uploadProgress = this.task.percentageChanges();


  //   }, (reason) => {
  //     console.log("Файл не прочитан:" + reason)
  //   });

  // }
  getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (!max || parseInt(arr[i][prop]) > parseInt(max[prop])) max = arr[i];
    }
    return max;
  };
  downloadPhoto(url, filePath) {
    return this.http.downloadFile(url, {}, {}, this.file.dataDirectory + filePath);
  };
  // getImages() {
  //   this.cameraService.getPhotosList().then((data) => {
  //     this.newPhotos = JSON.parse(data.data).media[0].fs;
  //     this.imageToShow = 'http://10.5.5.9:8080/videos/DCIM/100GOPRO/' + this.getMax(this.newPhotos, "mod").n;
  //     console.log("Последнее фото" + this.imageToShow);
  //   });
  // };

  // getImage(imageUrl) {
  //   this.cameraService.downloadPhoto(imageUrl, 'temp.jpg').then((entry) => {
  //     console.log('download complete: ' + entry.toURL());
  //     this.selectedPhotoBlob = entry.toURL();
  //     this.getImages();
  //   }, (error) => {
  //     console.log();
  //   });

  // };

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

}
