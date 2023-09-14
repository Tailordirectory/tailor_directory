import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import {NotificationService} from "../../../services/notification.service";
import {OwnerModel} from "../../../models/owner.model";
import {OwnersService} from "../../../services/owners.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-edit-owner-modal',
  templateUrl: './add-edit-owner.modal.html',
  styleUrls: ['./add-edit-owner.modal.scss']
})
export class AddEditOwnerModalComponent {

  isEdit: boolean;
  modal: NgbModalRef;
  owner: OwnerModel | null;
  submit: Subject<void> = new Subject<void>();

  @ViewChild('content') content: Element;

  @Output('onUpdate') onUpdate: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private modalService: NgbModal,
    private ownersService: OwnersService,
    private router: Router,
    private notificationService: NotificationService
  ) {

  }

  onShowModal(owner: OwnerModel | null) {
    this.owner = owner;
    this.isEdit = owner != null;
    this.modal = this.modalService.open(this.content, {size: "xl"});
  }

  onAdd($event: { firstName: string, lastName: string, email: string }) {
    this.ownersService.onAddNew($event.firstName, $event.lastName, $event.email).subscribe(r => {
      this.onUpdate.emit();
      this.modal.close();
    });
  }

  onEdit($event: { firstName: string, lastName: string }) {
    const ownerId = this.owner?._id as string;
    this.ownersService.onEdit($event.firstName, $event.lastName, ownerId).subscribe(r => {
      this.onUpdate.emit();
      this.modal.close();
    });
  }

  onAddNewBusiness() {
    this.modal.close(false);
    this.router.navigate(['/business/add', this.owner?._id]);
  }

  onSave() {
    this.submit.next();
  }
}
