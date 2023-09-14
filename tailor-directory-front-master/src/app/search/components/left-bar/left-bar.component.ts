import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {SearchAppState} from '../../storage/selectors';
import * as searchTailorListSelectors from '../../storage/selectors/tailor-list.selector';
import * as businessProfileSelectors from '../../storage/selectors/bisiness-profile.selectors';
import * as leftPanelSelectors from '../../storage/selectors/left-panel.selector';
import * as leftPanelAction from '../../storage/actions/left-panel.action';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BusinessModel} from '../../../models/business.model';

@Component({
  selector: 'app-search-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss']
})
export class LeftBarComponent implements AfterViewInit, OnDestroy {

  isOpened = false;
  isHidden = true;
  isShowProfile = false;
  selectedBusinessProfile: BusinessModel;
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private searchStore: Store<SearchAppState>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.searchStore.pipe(select(leftPanelSelectors.getPanelSelector)).subscribe(r => {
      this.isOpened = r;
    });
  }

  onToggleClick() {
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      this.searchStore.dispatch(leftPanelAction.showPanelAction());
    } else {
      this.searchStore.dispatch(leftPanelAction.hidePanelAction());
    }
  }

  ngAfterViewInit(): void {
    this.searchStore.pipe(select(searchTailorListSelectors.tailorsListSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      if (result.isLoaded) {
        this.isHidden = false;
        if (result.tailorsList.length > 0) {
          this.isOpened = true;
          this.searchStore.dispatch(leftPanelAction.showPanelAction());
        }
      }
    });
    this.searchStore.pipe(select(businessProfileSelectors.getBusinessProfileSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      this.isShowProfile = d.isVisible;
      if (d.profile) {
        this.selectedBusinessProfile = d.profile;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
