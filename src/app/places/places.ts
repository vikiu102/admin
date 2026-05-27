import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header page-header-row">
      <div>
        <h1>Quản lý Khu vực & Địa điểm</h1>
        <p>Chọn tỉnh thành ở bên trái để xem danh sách địa điểm du lịch tương ứng.</p>
      </div>
      <button class="btn btn-primary" (click)="isPlaceModalOpen.set(true)">+ Thêm địa điểm mới</button>
    </div>

    <div style="display: grid; grid-template-columns: 260px 1fr; gap: 24px; align-items: start;">
      
      <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; max-height: calc(100vh - 140px); position: sticky; top: 20px;">
        <div style="padding: 16px 20px; background: #f8fafc;">
          <h3 style="margin: 0; font-size: 15px; font-weight: 600;">📍 Lọc theo Tỉnh thành</h3>
        </div>
        
        <div style="padding: 0 12px 12px 12px; border-bottom: 1px solid var(--border); background: #f8fafc;">
          <div class="search-box" style="margin: 0; padding: 6px 12px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;color:var(--text-light);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Tìm tỉnh thành..." #leftProvSearch (input)="provLeftSearchQuery.set(leftProvSearch.value)" style="font-size: 13px;">
          </div>
        </div>
        
        <div style="overflow-y: auto; flex: 1; padding: 12px;">
          <div class="prov-item" [class.active]="activeProvince() === null" (click)="activeProvince.set(null)">
            <span style="font-weight: 500;">Tất cả địa điểm</span>
            <span class="badge">{{ appService.placesData().length }}</span>
          </div>
          
          <div style="height: 1px; background: var(--border); margin: 8px 0;"></div>
          
          @for (prov of filteredProvincesWithCount(); track prov.name) {
            <div class="prov-item" [class.active]="activeProvince() === prov.name" (click)="activeProvince.set(prov.name)">
              <span>{{prov.name}}</span>
              <span class="badge">{{prov.count}}</span>
            </div>
          }

          @if (filteredProvincesWithCount().length === 0) {
            <div style="text-align: center; padding: 20px 0; color: var(--text-light); font-size: 13px;">
              Không tìm thấy tỉnh này.
            </div>
          }
        </div>
      </div>

      <div class="card" style="display: flex; flex-direction: column;">
        <div class="table-toolbar" style="margin-bottom: 20px; border-bottom: none; padding-bottom: 0;">
          <div>
            <h2 style="margin:0; font-size: 18px; font-weight: 600; color: var(--text-main);">
              {{ activeProvince() ? 'Khu vực: ' + activeProvince() : 'Tất cả địa điểm du lịch' }}
            </h2>
            <div style="font-size: 13px; color: var(--text-sub); margin-top: 4px;">
              Đang hiển thị {{ filteredPlaces().length }} địa điểm
            </div>
          </div>
          
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;color:var(--text-light);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Tìm kiếm địa điểm..." #searchPlace (input)="placeSearchQuery.set(searchPlace.value)">
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width:280px">Tên địa điểm</th>
              <th>Tỉnh thành</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th style="width:90px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            @for (p of filteredPlaces(); track p.name) {
              <tr style="animation: fadein 0.3s ease-out;">
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
                    <div class="action-btn edit" (click)="openEditModal(p)" title="Chỉnh sửa">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </div>
                    <div class="action-btn del" (click)="deletePlace(p)" title="Xóa">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </div>
                  </div>
                </td>
              </tr>
            }
            @if (filteredPlaces().length === 0) {
              <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-light);">
                  Khu vực này hiện chưa có địa điểm nào hoặc không khớp với tìm kiếm.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" [class.open]="isPlaceModalOpen()" (click)="handleModalClick($event, 'add')">
      <div class="modal" style="overflow: visible;">
        <h2>Thêm địa điểm mới</h2>
        
        <div class="form-row-2">
          <div class="form-row">
            <label class="form-label">Tên địa điểm *</label>
            <input class="form-input" type="text" #newName placeholder="VD: Vịnh Hạ Long">
          </div>
          <div class="form-row">
            <label class="form-label">Upload ảnh *</label>
            <input class="form-input" type="file" accept="image/*" style="padding: 7px 14px; cursor: pointer; background: #fff;">
          </div>
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
            <select class="form-select" #newCategory>
              <option value="" disabled selected hidden>Chọn danh mục...</option>
              @for (cat of categories; track cat) {
                <option [value]="cat">{{cat}}</option>
              }
            </select>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="isPlaceModalOpen.set(false)">Hủy</button>
          <button class="btn btn-primary" (click)="addNewPlace(newName.value, newCategory.value); newName.value=''; newCategory.value=''">Lưu địa điểm</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" [class.open]="isEditModalOpen()" (click)="handleModalClick($event, 'edit')">
      <div class="modal">
        <h2>Cập nhật địa điểm</h2>
        
        @if (editingPlace()) {
          <div style="margin-bottom: 20px; padding: 12px; background: var(--content-bg); border-radius: 8px; border: 1px solid var(--border);">
            <div style="font-size: 12px; color: var(--text-sub); margin-bottom: 4px;">Đang chỉnh sửa địa điểm:</div>
            <div style="font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
              <span>{{editingPlace().emoji}}</span> {{editingPlace().name}}
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Upload ảnh mới (Tùy chọn):</label>
            <input class="form-input" type="file" accept="image/*" style="padding: 7px 14px; cursor: pointer; background: #fff;">
          </div>

          <div class="form-row">
            <label class="form-label">Thay đổi trạng thái thành:</label>
            <select class="form-select" #statusSelect [value]="editingPlace().status">
              <option value="active">Hoạt động</option>
              <option value="maintenance">Bảo trì</option>
              <option value="hidden">Đã ẩn</option>
            </select>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline" (click)="isEditModalOpen.set(false)">Hủy</button>
            <button class="btn btn-primary" (click)="saveEdit(statusSelect.value)">Lưu thay đổi</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .prov-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 14px; margin-bottom: 6px; border-radius: 8px; cursor: pointer;
      color: var(--text-main); font-size: 14px; transition: all 0.2s;
    }
    .prov-item:hover { background: #f1f5f9; }
    .prov-item.active { background: #e0f2fe; color: #0284c7; font-weight: 600; }
    .prov-item .badge { background: #e2e8f0; color: #64748b; font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 12px; transition: all 0.2s; }
    .prov-item.active .badge { background: #bae6fd; color: #0284c7; }

    @keyframes fadein {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .custom-dropdown-menu { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: #ffffff; border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); z-index: 1000; overflow: hidden; animation: dropDownIn 0.15s ease-out; }
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
  
  activeProvince = signal<string | null>(null);

  // ĐÃ THÊM: Biến lưu trữ từ khóa tìm kiếm ở cột trái
  provLeftSearchQuery = signal('');

  isPlaceModalOpen = signal(false);
  isEditModalOpen = signal(false);
  editingPlace = signal<any>(null); 
  
  placeSearchQuery = signal('');

  provincesWithCount = computed(() => {
    const places = this.appService.placesData();
    const provMap = new Map<string, number>();
    
    places.forEach(p => {
      provMap.set(p.province, (provMap.get(p.province) || 0) + 1);
    });

    return Array.from(provMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  // ĐÃ THÊM: Logic lọc tỉnh thành bên cột trái dựa trên từ khóa
  filteredProvincesWithCount = computed(() => {
    const q = this.provLeftSearchQuery().toLowerCase();
    return this.provincesWithCount().filter(prov => prov.name.toLowerCase().includes(q));
  });

  filteredPlaces = computed(() => {
    const q = this.placeSearchQuery().toLowerCase();
    const activeProv = this.activeProvince();
    
    return this.appService.placesData().filter(p => {
      const matchSearch = p.name.toLowerCase().includes(q) || p.province.toLowerCase().includes(q);
      const matchProv = activeProv ? p.province === activeProv : true; 
      return matchSearch && matchProv;
    });
  });

  addNewPlace(name: string, category: string) {
    if (!name || !this.selectedProvince() || !category) {
      this.appService.showToast('Vui lòng điền đầy đủ Tên, Tỉnh thành và Danh mục!');
      return;
    }

    const newPlace = {
      name: name,
      province: this.selectedProvince(),
      category: category,
      status: 'active', 
      emoji: '📸' 
    };

    this.appService.placesData.update(places => [...places, newPlace]);
    
    this.isPlaceModalOpen.set(false);
    this.selectedProvince.set('');
    this.appService.showToast('Đã thêm địa điểm mới thành công!');
  }

  openEditModal(place: any) {
    this.editingPlace.set(place);
    this.isEditModalOpen.set(true);
  }

  saveEdit(newStatus: string) {
    const currentPlace = this.editingPlace();
    if (currentPlace) {
      this.appService.placesData.update(places => 
        places.map(p => p.name === currentPlace.name ? { ...p, status: newStatus } : p)
      );
      this.appService.showToast('Cập nhật thành công!');
    }
    this.isEditModalOpen.set(false);
  }

  deletePlace(place: any) {
    if (confirm(`Bạn có chắc chắn muốn xóa địa điểm "${place.name}" không?`)) {
      this.appService.placesData.update(places => places.filter(p => p.name !== place.name));
      // Nếu tỉnh đó bị xóa sạch địa điểm và người dùng đang đứng ở tỉnh đó, tự động chuyển về "Tất cả"
      if (this.activeProvince() === place.province && !this.appService.placesData().some(p => p.province === place.province)) {
        this.activeProvince.set(null);
      }
      this.appService.showToast(`Đã xóa thành công: ${place.name}`);
    }
  }

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

  filteredProvList = computed(() => {
    const q = this.provSearchQuery().toLowerCase();
    return this.provincesList.filter(p => p.toLowerCase().includes(q));
  });

  selectProvince(prov: string) {
    this.selectedProvince.set(prov);
    this.isProvSelectOpen.set(false);
    this.provSearchQuery.set(''); 
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.prov-select-container') && this.isProvSelectOpen()) {
      this.isProvSelectOpen.set(false);
    }
  }

  handleModalClick(event: MouseEvent, modalType: 'add' | 'edit') {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      if (modalType === 'add') {
        this.isPlaceModalOpen.set(false);
        this.isProvSelectOpen.set(false);
      } else if (modalType === 'edit') {
        this.isEditModalOpen.set(false);
      }
    }
  }
}