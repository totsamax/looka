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
  listLink = "http://10.5.5.9:8080/gp/gpMediaList";

  constructor(public plt: Platform,http: HTTP, private transfer: FileTransfer, private file: File) {
    this.http = http;
  }

  fileTransfer: FileTransferObject = this.transfer.create();


  getPhotosList() {
    return this.http.get(this.listLink, {}, {})
  };
  downloadPhoto(url, filePath) { 
      return this.http.downloadFile(url,{},{}, this.file.dataDirectory + filePath);
  
  };
}
