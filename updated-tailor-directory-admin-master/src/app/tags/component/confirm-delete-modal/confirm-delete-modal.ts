import {Component, ElementRef, Output, ViewChild} from "@angular/core";
import {Subject, throwError} from "rxjs";
import {TagsModel} from "../../../models/tags.model";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {TagsService} from "../../../services/tags.service";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-confirm-delete-tags-modal',
  templateUrl: './confirm-delete-modal.html',
  styleUrls: ['./confirm-delete-modal.scss']
})
export class ConfirmDeleteModal {

  tag: TagsModel;
  isShowSpinner: boolean;
  @ViewChild('content') content: ElementRef;
  @Output('update') update: Subject<void> = new Subject<void>();
  modal: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private tagsService: TagsService
  ) {
  }

  onShowModal(tag: TagsModel) {
    this.tag = tag;
    this.modal = this.modalService.open(this.content);
  }

  onDelete() {
    this.tagsService.delete(this.tag._id).pipe(catchError(e => {
      this.isShowSpinner = false;
      return throwError(e);
    })).subscribe(r => {
      this.isShowSpinner = false;
      this.update.next();
      this.modal.close();
    });
  }
}
