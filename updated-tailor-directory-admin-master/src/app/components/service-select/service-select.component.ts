import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {TagsModel} from '../../models/tags.model';
import {catchError, debounceTime, map, tap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {FormControl} from '@angular/forms';
import {TagsService} from '../../services/tags.service';

@Component({
  selector: 'app-service-selector',
  templateUrl: './service-select.component.html',
  styleUrls: ['./service-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceSelectComponent implements AfterViewInit, OnDestroy {

  tags: TagsModel[] = [];
  tagsPage = 1;
  tagsLimit = 50;
  tagsTotal: number;
  tagsLoading: boolean;
  unsubscribe: Subject<void> = new Subject<void>();
  @Input('control') control: FormControl;
  @Input('hideClear') hideClear: boolean;
  tagsSearch: string;

  constructor(
    private tagsService: TagsService,
    private cdf: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    this.getTags(1);
  }

  onSelectTagsAll() {
    const tagsList: string[] = this.tags.map(r => {
      return r._id;
    });
    this.control?.setValue(tagsList);
    this.cdf.detectChanges();
  }

  onClearTagsAll() {
    this.control?.setValue([]);
    this.cdf.detectChanges();
  }

  onSearch(event: { term: string }) {
    this.tagsSearch = event.term;
    this.tags = [];
    this.getTags(1);
  }

  getTags(page: number) {
    this.tagsPage = page;
    this.tagsLoading = true;
    this.tagsService.loadTagsList({name: this.tagsSearch}, this.tagsPage, this.tagsLimit).pipe(tap((r => {
        this.tagsTotal = r.total;
        this.cdf.detectChanges();
      })),
      debounceTime(400),
      map(r => r.docs),
      catchError(e => {
        this.tagsLoading = false;
        this.cdf.detectChanges();
        return throwError(e);
      })
    ).subscribe(r => {
      this.tagsLoading = false;
      this.tags = this.tags.concat(r);
      this.cdf.detectChanges();
    });
  }

  onLoadTags() {
    if (this.tagsPage * this.tagsLimit < this.tagsTotal) {
      this.getTags(this.tagsPage + 1);
      this.cdf.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
