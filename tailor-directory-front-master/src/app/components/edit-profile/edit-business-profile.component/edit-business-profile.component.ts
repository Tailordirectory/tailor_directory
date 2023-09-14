import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../storage/selectors';
import {OwnerService} from '../../../services/owner.service';
import {BusinessService} from '../../../services/business.service';
import {BusinessModel} from '../../../models/business.model';
import {OwnerModel} from '../../../models/owner.model';
import {BusinessProfileModalComponent} from '../business-profile-modal.component/business-profile-modal.component';
import * as fromUserSelect from '../../../storage/selectors/user.selector';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-edit-business-profile',
  templateUrl: './edit-business-profile.component.html',
  styleUrls: ['./edit-business-profile.component.scss']
})
export class EditBusinessProfileComponent implements OnDestroy {

  businessList: BusinessModel[];
  owner: OwnerModel;
  showBannerBlock: boolean;
  ownerId: string;
  private unsubscribe$: Subject<void> = new Subject<void>();

  @Input('id') set setId(id: string) {
    this.ownerId = id;
    this.getBusiness();
    this.getOwner();
  }

  @ViewChild('addressRef') addressRef: ElementRef;
  @ViewChild('logoRef') logoRef: ElementRef;
  @ViewChild('galleryRef') galleryRef: ElementRef;
  @ViewChild('editModal') editModal: BusinessProfileModalComponent;

  constructor(
    private appStore: Store<AppState>,
    private ownerService: OwnerService,
    private businessService: BusinessService
  ) {
    this.appStore.select(fromUserSelect.getUserSelector).pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.getOwner();
      this.getBusiness();
    });
  }

  getOwner() {
    this.ownerService.getOwner().subscribe(owner => {
      this.owner = owner;
    });
  }

  getBusiness() {
    this.businessService.getMyBusinessList().subscribe(data => this.businessList = data);
  }


  onHideBannerBlock() {
    this.showBannerBlock = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
