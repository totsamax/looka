//TODO: Проверять что все цифры телефона введены
//TODO Проверять доступность камеры
//TODO Сделать переход на главную страницу 
import {
  Component,
  DoCheck,
  ViewChild,
  ElementRef,
  NgZone
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
import {BLE} from '@ionic-native/ble';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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
  devices: any[] = [];
  statusMessage: string;
  peripheral: any = {}; 
  currentState:any = {
    stateStart:'shown',
    stateImage:'hidden',
    stateTel:'hidden',
    stateTime:'hidden'
  }

  @ViewChild('telephone') public inputEl: ElementRef;
  constructor(
    private ble: BLE,
    public plt: Platform,
    public navCtrl: NavController,
    private toastCtrl: ToastController, 
    private ngZone: NgZone,
    http: HTTP, 
    private afStorage: AngularFireStorage,
    cameraService: CameraServiceService,
    private file: File,
    public alertCtrl: AlertController,
    private keyboard: Keyboard
  ) {
    this.http = http;
    this.cameraService = cameraService;
    this.plt.ready().then(() => {
      console.log("Платформа готова");
      keyboard.disableScroll(true);
      this.scan();
    });
    keyboard.disableScroll(true);
  }
  


//--------------------------------------------------
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list
    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device), 
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
    if (device.name =='GoPro 1840'){
      this.ble.connect(device.id).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => this.onDeviceDisconnected(peripheral)
      );
    }
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  onConnected(peripheral) {
    this.ngZone.run(() => {
      this.setStatus('');
      this.peripheral = peripheral;
    });
  }

  onDeviceDisconnected(peripheral) {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }
//--------------------------------------------------

  ngDoCheck() {
    if (this.photos != this.newPhotos) {
      this.photos = this.newPhotos;
    }
  }
  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Ваше фото отправлено!',
      subTitle: 'Мы отправили вам ссылку на ваш телефон',
      buttons: ['OK']
    });
    alert.present();
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
 
  focusInput(input) {
    input.setFocus();
  }
  

  resetView() { 
    this.currentState.stateTel = false;
    this.currentState.stateTime = true;
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
          this.downloadURL = entry.toURL().replace(/^file:\/\//, '');
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
            this.showAlert();
            let url = encodeURI(
              "http://lookaapp.ru/api/merchant/addlook/?merch=butik&phone=7" + String(this.phoneNumber.replace(/[^0-9]/g, "")) + "&timestamp=" +
              (Date.now() / 1000 | 0) +
              "&photo=" +
              value.toString()
            )
            this.http
              .get(url, {}, {})
              .then(val => {console.log(val)}, err => console.log(err));
          });

        },
        reason => {
          console.log("Файл не прочитан:" + reason);
        }
      );

  }

}
