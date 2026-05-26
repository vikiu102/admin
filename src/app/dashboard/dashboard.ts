import { Component, inject } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="page-header">
      <h1>Tổng quan</h1>
      <p>Chào mừng trở lại! Đây là tổng hợp hoạt động hệ thống.</p>
    </div>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon blue">🗺️</div>
        <div class="stat-info"><div class="stat-value">248</div><div class="stat-label">Địa điểm du lịch</div><div class="stat-change up">↑ +12 tháng này</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">🏙️</div>
        <div class="stat-info"><div class="stat-value">63</div><div class="stat-label">Tỉnh thành</div><div class="stat-change up">↑ Đầy đủ 63 tỉnh</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow">💬</div>
        <div class="stat-info"><div class="stat-value">1,247</div><div class="stat-label">Bình luận</div><div class="stat-change up">↑ +48 tuần này</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">⏳</div>
        <div class="stat-info"><div class="stat-value">23</div><div class="stat-label">Chờ duyệt</div><div class="stat-change down">↓ Cần xử lý</div></div>
      </div>
    </div>
    <div class="dash-grid">
      <div class="card">
        <div class="card-header"><h3>Bình luận trong 7 ngày qua</h3><span>Tháng 5, 2026</span></div>
        <div class="card-body">
          <div class="bar-chart">
            <div class="bar-col"><div class="bar" style="height:55px"></div><div class="bar-label">T2</div></div>
            <div class="bar-col"><div class="bar" style="height:78px"></div><div class="bar-label">T3</div></div>
            <div class="bar-col"><div class="bar" style="height:45px"></div><div class="bar-label">T4</div></div>
            <div class="bar-col"><div class="bar" style="height:90px"></div><div class="bar-label">T5</div></div>
            <div class="bar-col"><div class="bar" style="height:65px"></div><div class="bar-label">T6</div></div>
            <div class="bar-col"><div class="bar" style="height:80px; background:#22c55e"></div><div class="bar-label">T7</div></div>
            <div class="bar-col"><div class="bar" style="height:48px; background:#e5e7eb"></div><div class="bar-label">CN</div></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Hoạt động gần đây</h3></div>
        <div class="card-body">
          <ul class="activity-list">
            <li class="activity-item"><div class="activity-dot green"></div><div><div class="activity-text"><span>Trần Minh Khoa</span> đã bình luận về Vịnh Hạ Long</div><div class="activity-time">5 phút trước</div></div></li>
            <li class="activity-item"><div class="activity-dot blue"></div><div><div class="activity-text">Địa điểm <span>Bãi Sao, Phú Quốc</span> được thêm mới</div><div class="activity-time">32 phút trước</div></div></li>
            <li class="activity-item"><div class="activity-dot yellow"></div><div><div class="activity-text"><span>3 bình luận</span> đang chờ phê duyệt</div><div class="activity-time">1 giờ trước</div></div></li>
            <li class="activity-item"><div class="activity-dot red"></div><div><div class="activity-text">Bình luận của <span>Nguyễn Văn A</span> đã bị ẩn</div><div class="activity-time">3 giờ trước</div></div></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="dash-grid-3">
      <div class="card">
        <div class="card-header"><h3>Địa điểm phổ biến</h3></div>
        <div class="card-body" style="padding:0">
          <table>
            <thead><tr><th>Địa điểm</th><th>Bình luận</th><th>Trạng thái</th></tr></thead>
            <tbody>
              <tr><td>Vịnh Hạ Long</td><td>324</td><td><span class="badge badge-green">Hoạt động</span></td></tr>
              <tr><td>Phố cổ Hội An</td><td>287</td><td><span class="badge badge-green">Hoạt động</span></td></tr>
              <tr><td>Mũi Né</td><td>198</td><td><span class="badge badge-green">Hoạt động</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Trạng thái bình luận</h3></div>
        <div class="card-body">
          <div style="display:flex;flex-direction:column;gap:16px">
            <div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px"><span style="color:var(--text-sub)">Đã duyệt</span><span style="font-weight:600;color:#16a34a">1,180</span></div><div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden"><div style="height:100%;width:88%;background:var(--green);border-radius:4px"></div></div></div>
            <div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px"><span style="color:var(--text-sub)">Chờ duyệt</span><span style="font-weight:600;color:#d97706">44</span></div><div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden"><div style="height:100%;width:5%;background:var(--yellow);border-radius:4px"></div></div></div>
            <div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px"><span style="color:var(--text-sub)">Đã ẩn</span><span style="font-weight:600;color:#dc2626">23</span></div><div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden"><div style="height:100%;width:3%;background:var(--red);border-radius:4px"></div></div></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Tác vụ nhanh</h3></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:10px">
          <button (click)="appService.currentPage.set('places')" class="btn btn-primary">+ Thêm địa điểm mới</button>
          <button (click)="appService.currentPage.set('comments')" class="btn btn-outline">⏳ Xem bình luận chờ duyệt</button>
          <button (click)="appService.currentPage.set('provinces')" class="btn btn-outline">🏙️ Quản lý tỉnh thành</button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  appService = inject(AppService);
}