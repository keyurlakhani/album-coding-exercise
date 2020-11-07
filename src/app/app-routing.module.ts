import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '' , redirectTo: 'album', pathMatch: 'full'},
  { path: 'album', loadChildren: () => import('./album/album.module').then(m => m.AlbumModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
