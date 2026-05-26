import { Component, inject, signal, computed } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-places',
  standalone: true,
  template: `
    <div class="page-header page-header-row">
      <div>
        <h1>Quản lý địa điểm</h1>
        <p>Thêm, sửa, xóa và quản lý trạng thái hiển thị.</p>
      </div>
      <button class="btn btn-primary" (click)="isPlaceModalOpen.set(true)">+ Thêm địa điểm mới</button>
    </div>
    <div class="card">
      <div class="table-toolbar">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;color:var(--text-light);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Tìm kiếm địa điểm, tỉnh thành..." #searchPlace (input)="placeSearchQuery.set(searchPlace.value)">
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width:280px">Tên địa điểm</th><th>Tỉnh thành</th><th>Danh mục</th><th>Trạng thái</th><th style="width:90px">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          @for (p of filteredPlaces(); track p.name) {
            <tr>
              <td><div class="place-cell"><div class="place-thumb">{{p.emoji}}</div><div class="place-name">{{p.name}}</div></div></td>
              <td>{{p.province}}</td><td>{{p.category}}</td>
              <td>
                @switch (p.status) {
                  @case ('active') { <span class="badge badge-green">Hoạt động</span> }
                  @case ('maintenance') { <span class="badge badge-yellow">Bảo trì</span> }
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

    <!-- Modal Thêm địa điểm -->
    <div class="modal-overlay" [class.open]="isPlaceModalOpen()" (click)="handleModalClick($event)">
      <div class="modal">
        <h2>Thêm địa điểm mới</h2>
        <div class="form-row"><label class="form-label">Tên địa điểm *</label><input class="form-input" type="text" placeholder="VD: Vịnh Hạ Long"></div>
        <div class="form-row-2">
          <div class="form-row"><label class="form-label">Tỉnh thành *</label><select class="form-select"><option>Quảng Ninh</option></select></div>
          <div class="form-row"><label class="form-label">Danh mục *</label><select class="form-select"><option>Biển đảo</option></select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="isPlaceModalOpen.set(false)">Hủy</button>
          <button class="btn btn-primary" (click)="isPlaceModalOpen.set(false); appService.showToast('Thêm thành công!')">Lưu</button>
        </div>
      </div>
    </div>
  `
})
export class PlacesComponent {
  appService = inject(AppService);
  isPlaceModalOpen = signal(false);
  
  placesData = signal([
    { name: 'Vịnh Hạ Long', province: 'Quảng Ninh', category: 'Biển đảo', status: 'active', emoji: '🌊' },
    { name: 'Phố cổ Hội An', province: 'Quảng Nam', category: 'Di sản văn hóa', status: 'active', emoji: '🏮' },
    { name: 'Ruộng bậc thang Sapa', province: 'Lào Cai', category: 'Núi rừng', status: 'active', emoji: '🌿' },
    { name: 'Đà Lạt', province: 'Lâm Đồng', category: 'Đô thị', status: 'maintenance', emoji: '🌸' },
    { name: 'Mũi Né', province: 'Bình Thuận', category: 'Biển đảo', status: 'active', emoji: '🏖️' },
    { name: 'Núi Bà Đen', province: 'Tây Ninh', category: 'Núi rừng', status: 'hidden', emoji: '⛰️' }
  ]);

  placeSearchQuery = signal('');
  filteredPlaces = computed(() => {
    const q = this.placeSearchQuery().toLowerCase();
    return this.placesData().filter(p => p.name.toLowerCase().includes(q) || p.province.toLowerCase().includes(q));
  });

  handleModalClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) this.isPlaceModalOpen.set(false);
  }
}