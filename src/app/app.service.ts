import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppService {
  isLoggedIn = signal<boolean>(false);
  currentPage = signal<'dashboard'|'places'|'provinces'|'comments'>('dashboard');
  
  toastMessage = signal<string>('');
  isToastVisible = signal<boolean>(false);
  private toastTimer: any;

  showToast(msg: string) {
    this.toastMessage.set(msg);
    this.isToastVisible.set(true);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.isToastVisible.set(false), 2200);
  }

  logout() {
    this.showToast('Đã đăng xuất khỏi hệ thống!');
    localStorage.removeItem('isLoggedIn');
    setTimeout(() => {
      this.isLoggedIn.set(false);
      this.currentPage.set('dashboard');
    }, 800);
  }
}