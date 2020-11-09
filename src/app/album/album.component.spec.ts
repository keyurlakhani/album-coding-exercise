import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AngularMaterialModule } from '../angular-material.module';
import { AlbumComponent } from './album.component';

describe('AlbumComponent', () => {
  let component: AlbumComponent;
  let fixture: ComponentFixture<AlbumComponent>;
  const JSON_DATA = [
    {
      "id" : 1,
      "album_title" : "Fetch the Bolt Cutters",
      "album_artist" : "Fiona Apple",
      "album_genre" : "Art Pop",
      "year_released" : 2020
    },
    {
      "id" : 2,
      "album_title" : "RTJ4",
      "album_artist" : "Run the Jewels",
      "album_genre" : "Hip Hop",
      "year_released" : 2019
    },
    {
      "id" : 3,
      "album_title" : "Set My Heart on Fire Immediately",
      "album_artist" : "Perfume Genius",
      "album_genre" : "Art Pop",
      "year_released" : 2018
    },
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlbumComponent],
      imports: [
        NoopAnimationsModule,
        AngularMaterialModule,
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.getAlbum = jasmine.createSpy('getAlbum').and.returnValue(of(JSON_DATA));
    component.loadAlbum();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set paginator, sort after view init', fakeAsync(() => {
    expect(component.filterBy.value).toEqual('album_artist');
  }));

  it('should filter by search term ', fakeAsync(() => {
    component.searchTerm.setValue('Fiona');
    tick();
    expect(component.dataSource.filteredData.length).toBeGreaterThan(0)
  }))

  it('should set filter column as year_released', fakeAsync(() => {
    component.filterBy.setValue('year_released');
    component.searchTerm.setValue('2020');
    tick();
    expect(component.dataSource.filteredData.length).toBeGreaterThan(0)
  }))

  it('should set filter column as album_genre', fakeAsync(() => {
    component.filterBy.setValue('album_genre');
    component.searchTerm.setValue('Hip Hop');
    tick();
    expect(component.dataSource.filteredData.length).toBeGreaterThan(0)
  }))

  it('should return false', fakeAsync(() => {
    component.filterBy.setValue('nothing');
    component.searchTerm.setValue('2011');
    tick();
    expect(component.dataSource.filteredData.length).toEqual(0)
  }))

});
