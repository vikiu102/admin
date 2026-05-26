import { Component, inject, signal, computed, HostListener } from '@angular/core';
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

    <div class="modal-overlay" [class.open]="isPlaceModalOpen()" (click)="handleModalClick($event)">
      <div class="modal" style="overflow: visible;">
        <h2>Thêm địa điểm mới</h2>
        <div class="form-row">
          <label class="form-label">Tên địa điểm *</label>
          <input class="form-input" type="text" placeholder="VD: Vịnh Hạ Long">
        </div>
        
        <div class="form-row-2">
          
          <div class="form-row prov-select-container" style="position: relative;">
            <label class="form-label">Tỉnh thành *</label>
            <div class="form-select" (click)="isProvSelectOpen.set(!isProvSelectOpen())" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
              <span [style.color]="selectedProvince() ? 'var(--text-main)' : 'var(--text-light)'">
                {{ selectedProvince() || 'Chọn tỉnh thành...' }}
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--text-sub)"><path d="M6 9l6 6 6-6"/></svg>
            </div>

            @if (isProvSelectOpen()) {
              <div class="custom-dropdown-menu">
                <div class="dropdown-search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;color:var(--text-light);position:absolute;left:18px;top:18px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Tìm nhanh..." autofocus
                         (input)="provSearchQuery.set($event.target.value)"
                         (click)="$event.stopPropagation()">
                </div>
                <div class="dropdown-list">
                  @for (prov of filteredProvList(); track prov) {
                    <div class="dropdown-item" (click)="selectProvince(prov); $event.stopPropagation()">
                      {{prov}}
                    </div>
                  }
                  @if (filteredProvList().length === 0) {
                    <div class="dropdown-item" style="color: var(--text-light); text-align: center; cursor: default;">
                      Không tìm thấy tỉnh thành
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <div class="form-row">
            <label class="form-label">Danh mục *</label>
            <select class="form-select">
              <option value="" disabled selected hidden>Chọn danh mục...</option>
              @for (cat of categories; track cat) {
                <option [value]="cat">{{cat}}</option>
              }
            </select>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="isPlaceModalOpen.set(false)">Hủy</button>
          <button class="btn btn-primary" (click)="isPlaceModalOpen.set(false); appService.showToast('Thêm thành công!')">Lưu</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-dropdown-menu {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0;
      background: #ffffff; border: 1px solid var(--border); border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15); z-index: 1000; overflow: hidden;
      animation: dropDownIn 0.15s ease-out;
    }
    @keyframes dropDownIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
    .dropdown-search { padding: 10px; border-bottom: 1px solid var(--border); background: #f9fafb; position: relative; }
    .dropdown-search input { width: 100%; padding: 8px 12px 8px 32px; border: 1px solid var(--border); border-radius: 6px; font-size: 13px; outline: none; transition: border-color 0.2s; }
    .dropdown-search input:focus { border-color: var(--accent); }
    .dropdown-list { max-height: 200px; overflow-y: auto; }
    .dropdown-list .dropdown-item { padding: 10px 14px; font-size: 13px; cursor: pointer; color: var(--text-main); transition: background 0.1s; }
    .dropdown-list .dropdown-item:hover { background: var(--accent-light); color: var(--accent); font-weight: 500; }
  `]
})
export class PlacesComponent {
  appService = inject(AppService);
  isPlaceModalOpen = signal(false);
  
  // DỮ LIỆU ĐỊA ĐIỂM BẢNG
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

  // ==========================================
  // DỮ LIỆU CHO DROPDOWN THÊM MỚI
  // ==========================================
  categories = ['Biển đảo', 'Núi rừng', 'Di sản văn hóa', 'Đô thị', 'Khu du lịch sinh thái', 'Du lịch tâm linh', 'Khu nghỉ dưỡng', 'Khu vui chơi giải trí', 'Hang động'];
  
  provincesList = [
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 
    'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 
    'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 
    'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 
    'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'TP Hồ Chí Minh', 
    'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
  ];

  isProvSelectOpen = signal(false);
  provSearchQuery = signal('');
  selectedProvince = signal('');

  // Lọc 63 tỉnh thành dựa trên ô tìm kiếm
  filteredProvList = computed(() => {
    const q = this.provSearchQuery().toLowerCase();
    return this.provincesList.filter(p => p.toLowerCase().includes(q));
  });

  selectProvince(prov: string) {
    this.selectedProvince.set(prov);
    this.isProvSelectOpen.set(false);
    this.provSearchQuery.set(''); // Xóa text tìm kiếm sau khi chọn
  }

  // Tắt dropdown nếu click ra ngoài vùng chọn
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.prov-select-container') && this.isProvSelectOpen()) {
      this.isProvSelectOpen.set(false);
    }
  }

  handleModalClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.isPlaceModalOpen.set(false);
      this.isProvSelectOpen.set(false);
    }
  }
}