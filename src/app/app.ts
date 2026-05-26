import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from './app.service';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { PlacesComponent } from './places/places';
import { ProvincesComponent } from './provinces/provinces';
import { CommentsComponent } from './comments/comments';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, DashboardComponent, PlacesComponent, ProvincesComponent, CommentsComponent],
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