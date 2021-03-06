import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.scss']
})
export class PhotoManagementComponent implements OnInit {
  photos: any;

  constructor(private adminService: AdminService, private alertify: AlertifyService) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.getPhotosForApproval();
  }

  // tslint:disable-next-line: typedef
  getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe((photos) => {
      this.photos = photos;
    }, error => {
      this.alertify.error(error);
    });
  }

  // tslint:disable-next-line: typedef
  approvePhoto(photoId) {
    this.adminService.approvePhoto(photoId).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
    }, error => {
      this.alertify.error(error);
    });
  }

  // tslint:disable-next-line: typedef
  rejectPhoto(photoId) {
    this.adminService.rejectPhoto(photoId).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
    }, error => {
      this.alertify.error(error);
    });
  }
}
