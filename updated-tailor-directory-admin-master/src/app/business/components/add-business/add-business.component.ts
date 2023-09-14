import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {OwnersService} from "../../../services/owners.service";
import {BusinessService} from "../../../services/business.service";
import {OwnerModel} from "../../../models/owner.model";
import {catchError} from "rxjs/operators";
import {Subject, throwError} from "rxjs";

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent implements OnInit {

  ownerId: string;
  owner: OwnerModel;
  isLoading: boolean;
  submit: Subject<void> = new Subject<void>();

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private ownersService: OwnersService,
  ) {

  }

  ngOnInit(): void {
    this.ownerId = this.activeRoute.snapshot.params?.ownerId
    if (this.ownerId) {
      this.isLoading = true;
      this.ownersService.findById(this.ownerId).pipe(catchError(e => {
        this.isLoading = false;
        return throwError(e);
      })).subscribe(owner => {
        this.owner = owner;
        this.isLoading = false;
      });
    }
  }

  onSubmit() {
    this.route.navigate(['/business']);
  }

}
