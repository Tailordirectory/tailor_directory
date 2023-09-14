import {Component, OnInit, ViewChild} from "@angular/core";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {ManageService} from "../services/manage.service";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  logoImage: string;
  isLoading: boolean;

  @ViewChild('logoRef') logoRef: HTMLElement;

  constructor(
    private mangeService: ManageService,
    private notificationService: NotificationService) {
  }

  getLogoImage() {
    return '/assets/images/logo.svg'
  }

  ngOnInit(): void {
    this.logoImage = this.getLogoImage();
  }

  onLogoUpload(event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement || event.srcElement as HTMLInputElement;
    const logoFormData = new FormData();
    if (!target.files || target.files.length === 0) {
      return;
    }
    const logoFile: File = target.files.item(0) as File;
    logoFormData.append('file', logoFile);
    this.isLoading = true;
    this.mangeService.updateLogo(logoFormData).pipe(catchError(e => {
      this.isLoading = false;
      return throwError(e);
    })).subscribe(r => {
      this.isLoading = false;
      this.notificationService.notify('Logo has been successfully uploaded.', 'success');
    });
  }
}
