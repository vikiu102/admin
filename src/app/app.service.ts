import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // ==========================================
  // CÁC BIẾN QUẢN LÝ TRẠNG THÁI CHUNG
  // ==========================================
  isLoggedIn = signal(true); // Đặt true để dễ test, sau này đặt false
  currentPage = signal('dashboard');

  toastMessage = signal('');
  isToastVisible = signal(false);

  showToast(message: string) {
    this.toastMessage.set(message);
    this.isToastVisible.set(true);
    setTimeout(() => this.isToastVisible.set(false), 3000);
  }

  logout() {
    this.isLoggedIn.set(false);
    this.currentPage.set('dashboard');
    this.showToast('Đã đăng xuất thành công!');
  }

  // ==========================================
  // KHO DỮ LIỆU ĐỊA ĐIỂM
  // ==========================================
  placesData = signal([
    { name: 'Vịnh Hạ Long', province: 'Quảng Ninh', category: 'Biển đảo', status: 'active', emoji: '🌊' },
    { name: 'Phố cổ Hội An', province: 'Quảng Nam', category: 'Di sản văn hóa', status: 'active', emoji: '🏮' },
    { name: 'Ruộng bậc thang Sapa', province: 'Lào Cai', category: 'Núi rừng', status: 'active', emoji: '🌿' },
    { name: 'Đà Lạt', province: 'Lâm Đồng', category: 'Đô thị', status: 'maintenance', emoji: '🌸' },
    { name: 'Mũi Né', province: 'Bình Thuận', category: 'Biển đảo', status: 'active', emoji: '🏖️' },
    { name: 'Núi Bà Đen', province: 'Tây Ninh', category: 'Núi rừng', status: 'hidden', emoji: '⛰️' },
    { name: 'Bãi Sao Phú Quốc', province: 'Kiên Giang', category: 'Biển đảo', status: 'active', emoji: '🏖️' },
  ]);

  // ==========================================
  // KHO DỮ LIỆU BÌNH LUẬN
  // LƯU Ý: Đã chỉnh ngày tháng để test biểu đồ 7 ngày qua (tuần 18-24/05/2026)
  // ==========================================
  commentsData = signal([
    { user: "Trần Minh Khoa", location: "Vịnh Hạ Long", content: "Cảnh đẹp ngoài sức tưởng tượng...", date: "2026-05-18", status: "approved" }, // T2
    { user: "Trần Minh Khoa", location: "Vịnh Hạ Long", content: "Sẽ quay lại!", date: "2026-05-18", status: "approved" }, // T2
    { user: "Trần Minh Khoa", location: "Vịnh Hạ Long", content: "Hải sản ngon.", date: "2026-05-18", status: "hidden" }, // T2
    { user: "Lê Thị Hương", location: "Phố cổ Hội An", content: "Đèn lồng rực rỡ...", date: "2026-05-19", status: "approved" }, // T3
    { user: "Phạm Quốc Bảo", location: "Sapa, Lào Cai", content: "Ruộng bậc thang mùa lúa chín...", date: "2026-05-20", status: "pending" }, // T4
    { user: "Phạm Quốc Bảo", location: "Sapa, Lào Cai", content: "Đỉnh Fansipan...", date: "2026-05-20", status: "pending" }, // T4
    { user: "Ngô Thị Thu Thảo", location: "Đà Lạt", content: "Thời tiết mát mẻ...", date: "2026-05-21", status: "approved" }, // T5
    { user: "Hoàng Đức Trung", location: "Mũi Né", content: "Đồi cát bay đẹp...", date: "2026-05-22", status: "approved" }, // T6
    { user: "Đinh Thị Lan Anh", location: "Núi Bà Đen", content: "Leo núi vị thú...", date: "2026-05-23", status: "hidden" }, // T7
    { user: "Vũ Thanh Long", location: "Tràng An, Ninh Bình", content: "Cảnh như tranh vẽ...", date: "2026-05-24", status: "approved" }, // CN
  ]);

  // ==========================================
  // CÁC HÀM TỰ ĐỘNG TÍNH TOÁN THỐNG KÊ (COMPUTED)
  // ==========================================
  totalPlaces = computed(() => this.placesData().length);
  
  totalProvinces = computed(() => {
    const provinces = new Set(this.placesData().map(p => p.province));
    return provinces.size;
  });

  totalComments = computed(() => this.commentsData().length);
  pendingCommentsCount = computed(() => this.commentsData().filter(c => c.status === 'pending').length);
  approvedCommentsCount = computed(() => this.commentsData().filter(c => c.status === 'approved').length);
  hiddenCommentsCount = computed(() => this.commentsData().filter(c => c.status === 'hidden').length);
}