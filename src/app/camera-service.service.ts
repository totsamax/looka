import { Injectable } from "@angular/core";
import { Http, ResponseType } from "@angular/http";

@Injectable()
export class CameraServiceService {
  http: Http;
  listLink = "http://10.5.5.9:8080/gp/gpMediaList";

  constructor(http: Http) {
    this.http = http;
  }

  getPhotosList() {
    return this.http.get(this.listLink).map(res => res.text());
  }
}
