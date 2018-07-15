//TODO: Проверять что все цифры телефона введены
//TODO Проверять доступность камеры
//TODO Сделать переход на главную страницу 
import {
  Component,
  DoCheck,
  ViewChild,
  ElementRef
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
} from "ionic-angular";
import {
  File
} from "@ionic-native/file";
import {
  Observable
} from "rxjs/Observable";
import {
  map
} from "rxjs/operators/map";
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  useAnimation
} from "@angular/animations";
import {
  bounceOut
} from "ng-animate";
import {
  Keyboard
} from '@ionic-native/keyboard';

@Component({
  selector: "page-l-ooka",
  templateUrl: "l-ooka.html",
  providers: [CameraServiceService],
  animations: [
    trigger("visibility", [
      state('shown', style({
        opacity: 1,
        transform: 'scale(1)',

      })),
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0)',
      })),
      transition('* => *', animate('.5s'))
    ])
  ]
})
export class LOOKAPage implements DoCheck {
  state = "shown";
  stateTel = "hidden"
  stateTime = "hidden"
  recentImgUrl;
  checked = true;
  secondsToTakeAPhoto = 3;
  http;
  httpModule;
  selectedPhoto;
  takePhotoUrl = "http://10.5.5.9/gp/gpControl/command/shutter?p=1";
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
  text: string = "none";
  photos: any;
  newPhotos: any;
  current;
  phoneNumber;
  isReady = false;
  @ViewChild('telephone') public inputEl: ElementRef;
  constructor(
    public plt: Platform,
    public navCtrl: NavController,
    http: HTTP,
    httpModule: Http,
    private afStorage: AngularFireStorage,
    cameraService: CameraServiceService,
    private file: File,
    private keyboard: Keyboard
  ) {
    this.http = http;
    this.cameraService = cameraService;
    this.plt.ready().then(() => {
      console.log("Платформа готова");
      keyboard.disableScroll(true)
    });
    keyboard.disableScroll(true);
  }
  ngDoCheck() {
    if (this.photos != this.newPhotos) {
      this.photos = this.newPhotos;
    }
  }

  parseInt(str) {
    return parseInt(str, 10);
  }
  encodeURI(str) {
    return encodeURI(str);
  }
  sendToBack(url) {
    return this.httpModule.get(url);
  }
  isSelected(photo) {
    photo == this.selectedPhoto ? true : false;
  }
  selectPhoto(photo) {
    this.selectedPhoto = "http://10.5.5.9:8080/videos/DCIM/100GOPRO/" + photo;
    this.imageToShow = "http://10.5.5.9:8080/videos/DCIM/100GOPRO/" + photo;
  }

  getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (!max || parseInt(arr[i][prop]) > parseInt(max[prop])) max = arr[i];
    }
    return max;
  }
  downloadPhoto(url, filePath) {
    return this.http.downloadFile(
      url, {}, {},
      this.file.dataDirectory + filePath
    );
  }
  enterPhone() {
    this.state = this.state == 'shown' ? 'hidden' : 'shown';
    this.stateTel = this.stateTel == 'shown' ? 'hidden' : 'shown';
  }
  focusInput(input) {
    input.setFocus();
  }
  showTimer() {
    this.stateTel = this.stateTel == 'shown' ? 'hidden' : 'shown';
    this.stateTime = this.stateTime == 'shown' ? 'hidden' : 'shown';
  }



  timer() {
    var timer = Date.now();
    var time = 0;
    this.current = new Observable((observer) => {
      var x = setInterval(() => {
        console.log(time);
        observer.next(time = (Math.trunc((Date.now() - timer) / 1000)));
        console.log(Date.now() - timer);
        if ((Date.now() - timer) >= this.secondsToTakeAPhoto * 1000) {
          clearInterval(x);
          this.isReady = true;
          this.takePhoto2()
        }
      }, 1000);
    })
  }

  takePhoto2() {
    return this.http
      .get("http://10.5.5.9/gp/gpControl/command/shutter?p=1", {}, {}) //Делаем фото на камере
      .then(result => {
        return new Promise(resolve => setTimeout(resolve, 2000)); //ждем 2 сек, чтобы успело сфотать
      })
      .then(
        result => {
          return this.http.get(this.listLink, {}, {}); //получаем список всех фото с камеры
        },
        err => console.log(err)
      )
      .then(
        data => {
          let newPhotos = JSON.parse(data.data).media[0].fs;
          let imageToShow = "http://10.5.5.9:8080/videos/DCIM/100GOPRO/" + this.getMax(newPhotos, "mod").n; //берем последнее фото
          return this.downloadPhoto(imageToShow, "temp.jpg"); //сохранаяем последнее фото на устройство
        },
        err => console.log(err)
      )
      .then(
        entry => {
          console.log("download complete: " + entry.toURL());
          this.downloadURL= entry.toURL().replace(/^file:\/\//, '');
          let PhotoBlob = entry.toURL();
          return this.file.readAsArrayBuffer(
            this.file.dataDirectory,
            "temp.jpg"
          ); //читаем сохраненное фото как массив
        },
        error => {
          console.log(error);
        }
      )
      .then(
        str => {
          let blob = new Blob([str], {
            type: "image/jpeg"
          });  
          let randomId = Math.random()
            .toString(36)
            .substring(2);
          this.ref = this.afStorage.ref(randomId);
          var fileName = Math.random()
            .toString(36)
            .substring(2);
          this.task = this.afStorage
            .ref("images/" + fileName + ".jpg")
            .put(blob);
          this.uploadState = this.task
            .snapshotChanges()
            .pipe(map(s => s.state));
          this.uploadProgress = this.task.percentageChanges();
          this.task.downloadURL().subscribe(value => {
            let url = encodeURI(
              "http://lookaapp.ru/api/merchant/addlook/?merch=butik&phone=7" + String(this.phoneNumber.replace(/[^0-9]/g, "")) + "&timestamp=" +
              (Date.now() / 1000 | 0) +
              "&photo=" +
              value.toString()
            );
            //this.downloadURL = value;
            this.http
              .get(url, {}, {})
              .then(val => console.log(val), err => console.log(err));
          });
        },
        reason => {
          console.log("Файл не прочитан:" + reason);
        }
      );

  }
 
}
