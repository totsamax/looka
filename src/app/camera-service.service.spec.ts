import { TestBed, inject } from '@angular/core/testing';

import { CameraServiceService } from './camera-service.service';

describe('CameraServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CameraServiceService]
    });
  });

  it('should be created', inject([CameraServiceService], (service: CameraServiceService) => {
    expect(service).toBeTruthy();
  }));
});
