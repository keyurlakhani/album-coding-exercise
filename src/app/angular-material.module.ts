import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OverlayModule } from "@angular/cdk//overlay";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PortalModule } from '@angular/cdk/portal';

const MAT_MODULES: any[] = [
  MatToolbarModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatFormFieldModule,
  OverlayModule,
  MatProgressSpinnerModule,
  PortalModule
]

@NgModule({
  imports: [...MAT_MODULES],
  exports: [...MAT_MODULES]
})
export class AngularMaterialModule { }
