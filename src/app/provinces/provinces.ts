import { Component, inject, signal, computed } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-provinces',
  standalone: true,
  template: `
    <div class="page-header page-header-row">
      <div>
        <h1>Quản lý tỉnh thành</h1>
        <p>Quản lý danh sách các tỉnh thành và thành phố trên cả nước.</p>
      </div>
      <button class="btn btn-primary" (click)="isProvinceModalOpen.set(true)">+ Thêm tỉnh thành</button>
    </div>
    <div class="card">
      <div class="table-toolbar">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;color:var(--text-light);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Tìm kiếm tỉnh thành..." #searchProvince (input)="provinceSearchQuery.set(searchProvince.value)">
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width:240px">Tỉnh / Thành phố</th><th>Vùng miền</th><th>Số địa điểm</th><th>Trạng thái</th><th style="width:90px">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          @for (p of filteredProvinces(); track p.name) {
            <tr>
              <td><div class="place-cell"><div class="place-thumb">{{p.emoji}}</div><div class="place-name">{{p.name}}</div></div></td>
              <td>{{p.region}}</td><td><span style="font-weight:600">{{p.places}}</span> địa điểm</td>
              <td>
                @switch (p.status) {
                  @case ('active') { <span class="badge badge-green">Hoạt động</span> }
                  @case ('hidden') { <span class="badge badge-red">Đã ẩn</span> }
                }
              </td>
              <td>
                <div class="action-btns">
                  <div class="action-btn edit" (click)="appService.showToast('Đang sửa: ' + p.name)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </div>
                  <div class="action-btn del" (click)="appService.showToast('Đã xóa: ' + p.name)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </div>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="modal-overlay" [class.open]="isProvinceModalOpen()" (click)="handleModalClick($event)">
      <div class="modal">
        <h2>Thêm tỉnh thành</h2>
        <div class="form-row"><label class="form-label">Tên tỉnh / thành phố *</label><input class="form-input" type="text" placeholder="VD: Thành phố Hồ Chí Minh"></div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="isProvinceModalOpen.set(false)">Hủy</button>
          <button class="btn btn-primary" (click)="isProvinceModalOpen.set(false); appService.showToast('Thêm thành công!')">Lưu</button>
        </div>
      </div>
    </div>
  `
})
export class ProvincesComponent {
  appService = inject(AppService);
  isProvinceModalOpen = signal(false);

  provincesData = signal([
    { name: 'Hà Nội', region: 'Miền Bắc', places: 32, status: 'active', emoji: '🏛️' },
    { name: 'TP. Hồ Chí Minh', region: 'Miền Nam', places: 28, status: 'active', emoji: '🌆' },
    { name: 'Quảng Ninh', region: 'Miền Bắc', places: 18, status: 'active', emoji: '⛵' },
    { name: 'Quảng Nam', region: 'Miền Trung', places: 15, status: 'active', emoji: '🏮' },
    { name: 'Lâm Đồng', region: 'Tây Nguyên', places: 20, status: 'active', emoji: '🌺' }
  ]);

  provinceSearchQuery = signal('');
  filteredProvinces = computed(() => {
    const q = this.provinceSearchQuery().toLowerCase();
    return this.provincesData().filter(p => p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q));
  });

  handleModalClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) this.isProvinceModalOpen.set(false);
  }
}