// 10.5.5.100
// 255.255.255.0
//wave4734
import {
  Injectable
} from "@angular/core";
import {
  HTTP
} from "@ionic-native/http";
import { Http } from '@angular/http';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer';
import {
  File
} from '@ionic-native/file';
import { Platform } from 'ionic-angular';

@Injectable()
export class CameraServiceService {
  http;
  httpmodule;
  listLink = "http://10.5.5.9:8080/gp/gpMediaList";

  constructor(httpmodule:Http,public plt: Platform,http: HTTP, private transfer: FileTransfer, private file: File) {
    this.http = http;
    this.httpmodule = httpmodule;

  }

  fileTransfer: FileTransferObject = this.transfer.create();


  getPhotosList() {
    return this.http.get(this.listLink, {}, {})
  };
  downloadPhoto(url, filePath) {
      return this.http.downloadFile(url,{},{}, this.file.dataDirectory + filePath);
  };
  takePhoto(){
    return this.http.get('http://10.5.5.9/gp/gpControl/command/shutter?p=1',{},{});
  };
  sendToBack(url){
    return this.httpmodule.get(url);
  };
}
