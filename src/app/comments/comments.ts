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
            <th style="width:90px">Thao tác</th>
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
              <td style="color:var(--text-sub); max-width: 250px; line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                {{c.content}}
              </td>
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
                  <div class="action-btn" (click)="openViewModal(c)" title="Xem chi tiết & Cập nhật">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  
                  <div class="action-btn del" (click)="deleteComment(c)" title="Xóa bình luận">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </div>
                </div>
              </td>
            </tr>
          }
          @if (filteredComments().length === 0) {
            <tr>
              <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-light);">
                Không tìm thấy bình luận nào.
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

    <div class="modal-overlay" [class.open]="isViewModalOpen()" (click)="handleModalClick($event)">
      <div class="modal" style="width: 500px;">
        <h2>Chi tiết bình luận</h2>
        <p>Thông tin đầy đủ của bình luận được chọn.</p>

        @if (selectedComment()) {
          <div style="background: var(--content-bg); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border);">
            
            <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 16px;">
              <div class="header-avatar" style="width:44px; height:44px; font-size:16px;">
                {{selectedComment().user.charAt(0)}}
              </div>
              <div>
                <div style="font-weight: 700; color: var(--text-main); font-size: 15px;">{{selectedComment().user}}</div>
                <div style="font-size: 12px; color: var(--text-sub); margin-top: 2px;">Đã bình luận vào {{selectedComment().date}}</div>
              </div>
            </div>

            <div style="font-size: 13px; color: var(--text-sub); margin-bottom: 14px; display:flex; align-items:center; gap:6px; background: #fff; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Địa điểm: <strong style="color:var(--text-main)">{{selectedComment().location}}</strong></span>
            </div>

            <div style="font-size: 14px; color: var(--text-main); line-height: 1.6; padding-top: 14px; border-top: 1px dashed #d1d5db; font-style: italic;">
              "{{selectedComment().content}}"
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Cập nhật trạng thái duyệt:</label>
            <select class="form-select" #commentStatusSelect [value]="selectedComment().status">
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
              <option value="hidden">Đã ẩn</option>
            </select>
          </div>

          <div class="modal-footer">
            <button class="btn btn-outline" (click)="isViewModalOpen.set(false)">Đóng</button>
            <button class="btn btn-primary" (click)="updateStatus(commentStatusSelect.value)">Lưu thay đổi</button>
          </div>
        }
      </div>
    </div>
  `
})
export class CommentsComponent {
  Math = Math;
  appService = inject(AppService);

  commentsData = this.appService.commentsData;

  commentSearch = signal('');
  commentStatus = signal('all');
  commentsPage = signal(1);
  commentsPerPage = 6;
  isCommentDropdownOpen = signal(false);

  selectedComment = signal<any>(null);
  isViewModalOpen = signal(false);

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

  openViewModal(comment: any) {
    this.selectedComment.set(comment);
    this.isViewModalOpen.set(true);
  }

  handleModalClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.isViewModalOpen.set(false);
    }
  }

  // ==========================================
  // HÀM XỬ LÝ DUYỆT VÀ XÓA BÌNH LUẬN
  // ==========================================
  
  // Đổi trạng thái từ trong Cửa sổ chi tiết
  updateStatus(newStatus: string) {
    const current = this.selectedComment();
    if (current) {
      this.commentsData.update(comments =>
        comments.map(c => c === current ? { ...c, status: newStatus } : c)
      );
      this.appService.showToast('Cập nhật trạng thái duyệt thành công!');
    }
    this.isViewModalOpen.set(false);
  }

  // Xóa vĩnh viễn (Nút thùng rác)
  deleteComment(comment: any) {
    if (confirm(`Bạn có chắc chắn muốn xóa bình luận của "${comment.user}" không?`)) {
      this.commentsData.update(comments => comments.filter(c => c !== comment));
      this.appService.showToast(`Đã xóa bình luận của: ${comment.user}`);
      
      // Nếu xóa hết trang hiện tại, lùi lại 1 trang
      if (this.paginatedComments().length === 0 && this.commentsPage() > 1) {
        this.commentsPage.set(this.commentsPage() - 1);
      }
    }
  }
}