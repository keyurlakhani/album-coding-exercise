import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  displayedColumns: string[] = ['year_released', 'album_title', 'album_artist', 'album_genre'];
  dataSource!: MatTableDataSource<any[]>;
  pageIndexValue!: number;
  maxValuePageIndexValue!: number;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterBy: FormControl = new FormControl('');
  searchTerm: FormControl = new FormControl('');
  pageIndex: FormControl = new FormControl('');

  filterByColumnList = [
    { viewValue: 'Year', value: 'year_released' },
    { viewValue: 'Artist', value: 'album_artist' },
    { viewValue: 'Genre', value: 'album_genre' }
  ];

  private spinnerOverlayRef: OverlayRef;

  private filterBySub!: Subscription;
  private searchTermSub!: Subscription;
  private pageIndexSub!: Subscription;

  constructor(
    private http: HttpClient,
    private overlay: Overlay
  ) {
    this.spinnerOverlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
  }

  ngOnInit() {
    this.filterBy.setValue('album_artist')
  }

  loadAlbum() {
    this.spinnerOverlayRef.attach(new ComponentPortal(MatSpinner))
    this.getAlbum().subscribe((data: any) => {
      this.setDataSource(data);
      this.pageIndexValue = data.length / 10;
      if (this.pageIndexValue % 1 !== 0) {
        this.maxValuePageIndexValue = (Math.floor(this.pageIndexValue) + 1);
      } else {
        this.maxValuePageIndexValue = this.pageIndexValue;
      }

      this.pageIndex.clearValidators();
      this.pageIndex.setValidators([Validators.min(1), Validators.max(this.maxValuePageIndexValue)])

      this.spinnerOverlayRef.detach();
    })
  }

  getAlbum() {
    return this.http.get('assets/data.json');
  }

  setDataSource(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (this.filterBySub) {
      this.filterBySub.unsubscribe();
    }
    this.filterBySub = this.filterBy.valueChanges.subscribe(value => {
      this.searchTerm.reset('');
      if (this.dataSource !== undefined) {
        this.dataSource.filterPredicate = function (data: any, filter: string) {
          switch (value) {
            case 'year_released':
              return String(data.year_released).includes(filter);
            case 'album_artist':
              return data.album_artist.toLowerCase().includes(filter);
            case 'album_genre':
              return data.album_genre.toLowerCase().includes(filter)
            default:
              return false;
          }
        }
      }
    })

    if (this.searchTermSub) {
      this.searchTermSub.unsubscribe();
    }
    this.searchTermSub = this.searchTerm.valueChanges.subscribe(filterValue => {
      if (this.dataSource !== undefined) {
        this.dataSource.filter = filterValue.trim().toLowerCase()
      }
    })
    if (this.pageIndexSub) {
      this.pageIndexSub.unsubscribe();
    }
    this.pageIndexSub = this.pageIndex.valueChanges.subscribe(pageIndex => {
      const previousPageIndex = this.paginator.pageIndex;
      this.paginator.pageIndex = Number(pageIndex) - 1;
      this.paginator.page.emit({
        previousPageIndex,
        pageIndex: Number(pageIndex) - 1,
        pageSize: this.paginator.pageSize,
        length: this.paginator.length
      });

    })

    this.paginator.page.subscribe((page: any) => {
      this.pageIndex.patchValue(page.pageIndex + 1, { onlySelf: true, emitEvent: false });
    })

    this.searchTerm.setValue('');
    this.filterBy.setValue('album_artist')
    this.pageIndex.setValue(1);
  }

}
