import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  template: `
    <div class="page-header">
      <h1>Quản lý bình luận</h1>
      <p>Kiểm duyệt, ẩn hoặc xóa các bình luận từ người dùng (đã tích hợp phân trang & lọc).</p>
    </div>
    <div class="card">
      <div class="table-toolbar">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;color:var(--text-light);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Tìm kiếm theo nội dung, người dùng..." #searchComment (input)="commentSearch.set(searchComment.value); commentsPage.set(1)">
        </div>
        <div class="filter-wrap">
          <button class="btn btn-outline" (click)="isCommentDropdownOpen.set(!isCommentDropdownOpen())">Lọc trạng thái</button>
          <div class="dropdown" [class.open]="isCommentDropdownOpen()">
            <div class="dropdown-item" (click)="setCommentStatus('all')"><span class="dot" style="background:#94a3b8"></span> Tất cả</div>
            <div class="dropdown-item" (click)="setCommentStatus('approved')"><span class="dot" style="background:#10b981"></span> Đã duyệt</div>
            <div class="dropdown-item" (click)="setCommentStatus('pending')"><span class="dot" style="background:#f59e0b"></span> Chờ duyệt</div>
            <div class="dropdown-item" (click)="setCommentStatus('hidden')"><span class="dot" style="background:#ef4444"></span> Đã ẩn</div>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width:250px">Người dùng & Địa điểm</th>
            <th>Nội dung bình luận</th>
            <th style="width:110px">Ngày đăng</th>
            <th style="width:110px">Trạng thái</th>
            <th style="width:120px">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          @for (c of paginatedComments(); track c.user + c.date; let i = $index) {
            <tr [style.animation]="'fadein .25s ' + (i * 0.04) + 's both'">
              <td>
                <div class="user-cell">
                  <div class="user-name">{{c.user}}</div>
                  <div class="user-location"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px;flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {{c.location}}</div>
                </div>
              </td>
              <td style="color:var(--text-sub); max-width: 250px; line-height: 1.5;">{{c.content}}</td>
              <td style="color:var(--text-sub)">{{c.date}}</td>
              <td>
                @switch (c.status) {
                  @case ('approved') { <span class="badge badge-green">Đã duyệt</span> }
                  @case ('pending') { <span class="badge badge-yellow">Chờ duyệt</span> }
                  @case ('hidden') { <span class="badge badge-red">Đã ẩn</span> }
                }
              </td>
              <td>
                <div class="action-btns">
                  <div class="action-btn" (click)="appService.showToast('Đang xem bình luận')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  <div class="action-btn hide" (click)="appService.showToast('Đã ẩn bình luận')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </div>
                  <div class="action-btn del" (click)="appService.showToast('Đã xóa bình luận')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </div>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
      <div class="pagination">
        <div class="pagination-info">
          Hiển thị {{ Math.min((commentsPage()-1)*commentsPerPage + 1, filteredComments().length > 0 ? filteredComments().length : 0) }}–{{ Math.min((commentsPage()-1)*commentsPerPage + commentsPerPage, filteredComments().length) }} trong {{ filteredComments().length }} bình luận
        </div>
        <div class="pagination-btns">
          <div class="page-btn" [class.disabled]="commentsPage() === 1" (click)="prevPage()">←</div>
          @for (p of totalPagesArray(); track p) { <div class="page-btn" [class.active]="commentsPage() === p" (click)="commentsPage.set(p)">{{p}}</div> }
          <div class="page-btn" [class.disabled]="commentsPage() === totalPages()" (click)="nextPage()">→</div>
        </div>
      </div>
    </div>
  `
})
export class CommentsComponent {
  Math = Math;
  appService = inject(AppService);

  commentsData = signal([
    { user: "Trần Minh Khoa", location: "Vịnh Hạ Long, Quảng Ninh", content: "Cảnh đẹp ngoài sức tưởng tượng, nước biển xanh trong vắt!", date: "2026-05-12", status: "approved" },
    { user: "Lê Thị Hương", location: "Phố cổ Hội An, Quảng Nam", content: "Đèn lồng rực rỡ về đêm, không khí rất lãng mạn.", date: "2026-05-10", status: "approved" },
    { user: "Phạm Quốc Bảo", location: "Sapa, Lào Cai", content: "Ruộng bậc thang mùa lúa chín vàng óng, tuyệt vời!", date: "2026-05-08", status: "pending" },
    { user: "Ngô Thị Thu Thảo", location: "Đà Lạt, Lâm Đồng", content: "Thời tiết mát mẻ, hoa nở khắp nơi. Rất thích hợp nghỉ dưỡng.", date: "2026-05-07", status: "approved" },
    { user: "Hoàng Đức Trung", location: "Mũi Né, Bình Thuận", content: "Đồi cát bay đẹp nhưng trời nắng quá, nhớ mang kem chống nắng.", date: "2026-05-05", status: "approved" },
    { user: "Đinh Thị Lan Anh", location: "Núi Bà Đen, Tây Ninh", content: "Hành trình leo núi rất thú vị, view từ đỉnh cực đỉnh!", date: "2026-05-04", status: "hidden" },
    { user: "Vũ Thanh Long", location: "Tràng An, Ninh Bình", content: "Chèo thuyền qua hang động, khung cảnh như tranh vẽ.", date: "2026-05-03", status: "approved" },
    { user: "Bùi Ngọc Linh", location: "Phú Quốc, Kiên Giang", content: "Bãi biển sạch, đồ hải sản tươi ngon, giá cả hợp lý.", date: "2026-05-01", status: "pending" }
  ]);

  commentSearch = signal('');
  commentStatus = signal('all');
  commentsPage = signal(1);
  commentsPerPage = 6;
  isCommentDropdownOpen = signal(false);

  filteredComments = computed(() => {
    return this.commentsData().filter(c => {
      const matchStatus = this.commentStatus() === 'all' || c.status === this.commentStatus();
      const q = this.commentSearch().toLowerCase();
      const matchSearch = !q || c.content.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.user.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  });

  paginatedComments = computed(() => {
    const start = (this.commentsPage() - 1) * this.commentsPerPage;
    return this.filteredComments().slice(start, start + this.commentsPerPage);
  });

  totalPages = computed(() => Math.ceil(this.filteredComments().length / this.commentsPerPage) || 1);
  totalPagesArray = computed(() => Array.from({length: this.totalPages()}, (_, i) => i + 1));

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-wrap') && this.isCommentDropdownOpen()) {
      this.isCommentDropdownOpen.set(false);
    }
  }

  setCommentStatus(status: string) {
    this.commentStatus.set(status);
    this.isCommentDropdownOpen.set(false);
    this.commentsPage.set(1);
  }
  prevPage() { if (this.commentsPage() > 1) this.commentsPage.set(this.commentsPage() - 1); }
  nextPage() { if (this.commentsPage() < this.totalPages()) this.commentsPage.set(this.commentsPage() + 1); }
}