import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {BusinessModel} from '../../../models/business.model';
import {OwnerService} from '../../../services/owner.service';
import {BusinessService} from '../../../services/business.service';
import {BusinessProfileModalComponent} from '../business-profile-modal.component/business-profile-modal.component';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-multiple-profile',
  templateUrl: './multiple-business.component.html',
  styleUrls: ['./multiple-business.component.scss']
})
export class EditMultipleBusinessProfileComponent implements OnDestroy {

  @Input('businessList') businessList: BusinessModel[];
  @Output('getBusiness') getBusiness: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('addressRef') addressRef: ElementRef;
  @ViewChild('logoRef') logoRef: ElementRef;
  @ViewChild('galleryRef') galleryRef: ElementRef;
  @ViewChild('editModal') editModal: BusinessProfileModalComponent;
  $resetUpload: Subject<void> = new Subject<void>();

  constructor(
    private ownerService: OwnerService,
    private businessService: BusinessService,
  ) {
  }

  onEditBusiness(business: BusinessModel) {
    this.editModal.onShowModal(business);
  }

  onDeleteBusiness(business: BusinessModel) {
    if (this.businessList.length <= 1) {
      return;
    }
    this.businessService.deleteBusiness(business._id).subscribe(r => {
      this.getBusiness.emit();
    });
  }

  onAddNewBusiness() {
    this.editModal.onShowModal(null);
  }

  ngOnDestroy(): void {
    this.$resetUpload.next();
    this.$resetUpload.complete();
  }

}
