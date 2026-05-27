import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from './app.service';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { PlacesComponent } from './places/places';
// ĐÃ XÓA: import { ProvincesComponent }
import { CommentsComponent } from './comments/comments';

@Component({
  selector: 'app-root',
  standalone: true,
  // ĐÃ XÓA: ProvincesComponent ra khỏi mảng imports
  imports: [LoginComponent, DashboardComponent, PlacesComponent, CommentsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appService = inject(AppService);

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.appService.isLoggedIn.set(true);
    }
  }
}