import { Component, inject, signal } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-body">
      <div class="login-box">
        <div class="icon-shield">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <h2>Admin Portal</h2>
        <p class="subtitle">Đăng nhập để quản trị hệ thống</p>
        <form (submit)="handleLogin($event, usernameInput.value, passwordInput.value)">
            <div class="input-group">
                <label>Tên đăng nhập</label>
                <div class="input-wrapper">
                    <svg class="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" #usernameInput placeholder="Nhập tên đăng nhập" autocomplete="off" required>
                </div>
            </div>
            <div class="input-group">
                <label>Mật khẩu</label>
                <div class="input-wrapper">
                    <svg class="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input [type]="showPassword() ? 'text' : 'password'" #passwordInput placeholder="Nhập mật khẩu" required>
                    <svg class="icon-right" (click)="showPassword.set(!showPassword())" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      @if (showPassword()) {
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a2 2 0 1 1 2.83-2.83m9.9 9.9a2 2 0 1 1-2.83 2.83M1 1l22 22"/>
                      } @else {
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      }
                    </svg>
                </div>
            </div>
            <button type="submit" class="login-btn">Đăng nhập</button>
            <div class="error-msg" [style.display]="loginError() ? 'block' : 'none'">Tên đăng nhập hoặc mật khẩu không đúng!</div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  appService = inject(AppService);
  showPassword = signal<boolean>(false);
  loginError = signal<boolean>(false);

  async handleLogin(event: any, user: string, pass: string) {
    event.preventDefault();
    
    try {
      // Gọi API đăng nhập của Spring Boot
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user,
          password: pass
        })
      });

      if (response.ok) {
        // Hứng chuỗi Token do Spring Boot trả về
        const token = await response.text(); 
        
        this.loginError.set(false);
        
        // 1. Lưu Token thật vào localStorage để dùng cho các API sau
        localStorage.setItem('adminToken', token); 
        
        // 2. Giữ nguyên các logic chuyển trạng thái cũ của bạn
        localStorage.setItem('isLoggedIn', 'true'); 
        this.appService.isLoggedIn.set(true);
        
      } else {
        // Sai user/pass hoặc lỗi từ Backend
        this.loginError.set(true); 
      }
    } catch (error) {
      console.error("Lỗi khi kết nối đến Server Backend: ", error);
      this.loginError.set(true);
    }
  }
}