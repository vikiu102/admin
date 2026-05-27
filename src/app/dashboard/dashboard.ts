import { Component, inject, computed } from '@angular/core';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], 
  template: `
    <div class="dashboard-wrapper" style="padding: 10px; display: flex; flex-direction: column; gap: 24px;">
      
      <div class="stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
        
        <div class="card" style="display: flex; gap: 16px; padding: 20px; align-items: center; background: #fff; border-radius: 12px; border: 1px solid var(--border);">
          <div style="width: 50px; height: 50px; border-radius: 12px; background: #e0f2fe; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">🗺️</div>
          <div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: var(--text-main);">{{ appService.totalPlaces() | number:'1.0-0' }}</h2>
            <div style="color: var(--text-sub); font-size: 13px; margin-top: 2px;">Địa điểm du lịch</div>
          </div>
        </div>
        
        <div class="card" style="display: flex; gap: 16px; padding: 20px; align-items: center; background: #fff; border-radius: 12px; border: 1px solid var(--border);">
          <div style="width: 50px; height: 50px; border-radius: 12px; background: #dcfce7; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">🏙️</div>
          <div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: var(--text-main);">{{ appService.totalProvinces() | number:'1.0-0' }}</h2>
            <div style="color: var(--text-sub); font-size: 13px; margin-top: 2px;">Tỉnh thành</div>
          </div>
        </div>

        <div class="card" style="display: flex; gap: 16px; padding: 20px; align-items: center; background: #fff; border-radius: 12px; border: 1px solid var(--border);">
          <div style="width: 50px; height: 50px; border-radius: 12px; background: #fef9c3; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">💬</div>
          <div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: var(--text-main);">{{ appService.totalComments() | number:'1.0-0' }}</h2>
            <div style="color: var(--text-sub); font-size: 13px; margin-top: 2px;">Bình luận</div>
          </div>
        </div>

        <div class="card" style="display: flex; gap: 16px; padding: 20px; align-items: center; background: #fff; border-radius: 12px; border: 1px solid var(--border);">
          <div style="width: 50px; height: 50px; border-radius: 12px; background: #fee2e2; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">⏳</div>
          <div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #ef4444;">{{ appService.pendingCommentsCount() | number:'1.0-0' }}</h2>
            <div style="color: var(--text-sub); font-size: 13px; margin-top: 2px;">Chờ duyệt</div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h3 style="margin:0; font-size: 15px; font-weight: 600;">Bình luận trong 7 ngày qua</h3>
            <span style="color: var(--text-sub); font-size: 13px;">Tháng 5, 2026</span>
          </div>
          
          <div style="display: flex; align-items: flex-end; gap: 12px; height: 160px; padding-bottom: 0; border-bottom: 1px solid var(--border);">
            @for (bar of commentChartData(); track bar.dayName) {
              <div style="flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center;">
                @if (bar.count > 0) {
                  <div style="font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 6px;">
                    {{ bar.count }}
                  </div>
                }
                <div [style.height.%]="bar.heightPercent" 
                     [style.background]="bar.color"
                     style="width: 100%; border-radius: 4px 4px 0 0; transition: height 0.4s ease;">
                </div>
              </div>
            }
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 12px; color: var(--text-sub);">
            @for (bar of commentChartData(); track bar.dayName) {
              <div style="flex:1; text-align:center;">{{bar.dayName}}</div>
            }
          </div>
        </div>

        <div class="card" style="padding: 24px;">
          <h3 style="margin:0 0 20px 0; font-size: 15px; font-weight: 600;">Hoạt động gần đây</h3>
          
          <div style="display:flex; gap:12px; margin-bottom: 20px;">
            <div style="margin-top:4px;"><span class="dot" style="background:#10b981;"></span></div>
            <div>
              <div style="font-size:13px; color:var(--text-main);"><strong>Trần Minh Khoa</strong> đã bình luận về Vịnh Hạ Long</div>
              <div style="font-size:12px; color:var(--text-sub); margin-top:4px;">5 phút trước</div>
            </div>
          </div>

          <div style="display:flex; gap:12px; margin-bottom: 20px;">
            <div style="margin-top:4px;"><span class="dot" style="background:#3b82f6;"></span></div>
            <div>
              <div style="font-size:13px; color:var(--text-main);">Địa điểm <strong>Bãi Sao, Phú Quốc</strong> được thêm mới</div>
              <div style="font-size:12px; color:var(--text-sub); margin-top:4px;">32 phút trước</div>
            </div>
          </div>

          <div style="display:flex; gap:12px; margin-bottom: 20px;">
            <div style="margin-top:4px;"><span class="dot" style="background:#f59e0b;"></span></div>
            <div>
              <div style="font-size:13px; color:var(--text-main);"><strong>{{ appService.pendingCommentsCount() }} bình luận</strong> đang chờ phê duyệt</div>
              <div style="font-size:12px; color:var(--text-sub); margin-top:4px;">1 giờ trước</div>
            </div>
          </div>

          <div style="display:flex; gap:12px;">
            <div style="margin-top:4px;"><span class="dot" style="background:#ef4444;"></span></div>
            <div>
              <div style="font-size:13px; color:var(--text-main);">Bình luận của <strong>Nguyễn Văn A</strong> đã bị ẩn</div>
              <div style="font-size:12px; color:var(--text-sub); margin-top:4px;">3 giờ trước</div>
            </div>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px;">
        
        <div class="card" style="padding: 24px;">
          <h3 style="margin:0 0 20px 0; font-size: 15px; font-weight: 600;">Địa điểm phổ biến</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border); color: var(--text-sub);">
                <th style="padding-bottom: 12px; text-align: left; font-weight: 600;">ĐỊA ĐIỂM</th>
                <th style="padding-bottom: 12px; text-align: center; font-weight: 600;">BÌNH LUẬN</th>
                <th style="padding-bottom: 12px; text-align: right; font-weight: 600;">TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              @for (p of popularPlaces(); track p.name) {
                <tr style="border-bottom: 1px solid var(--border);">
                  <td style="padding: 16px 0; color: var(--text-main);">{{p.name}}</td>
                  <td style="padding: 16px 0; text-align: center; color: var(--text-main); font-weight: 500;">{{ p.commentCount }}</td>
                  <td style="padding: 16px 0; text-align: right;">
                    @switch (p.status) {
                      @case ('active') { <span style="background: #dcfce7; color: #16a34a; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">&bull; Hoạt động</span> }
                      @case ('maintenance') { <span style="background: #fef08a; color: #ca8a04; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">&bull; Bảo trì</span> }
                      @case ('hidden') { <span style="background: #fee2e2; color: #ef4444; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">&bull; Đã ẩn</span> }
                    }
                  </td>
                </tr>
              }
              @if (popularPlaces().length === 0) {
                 <tr><td colspan="3" style="text-align:center; padding: 20px; color: var(--text-sub);">Chưa có dữ liệu</td></tr>
              }
            </tbody>
          </table>
        </div>

        <div class="card" style="padding: 24px;">
          <h3 style="margin:0 0 20px 0; font-size: 15px; font-weight: 600;">Trạng thái bình luận</h3>
          
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="font-size:13px; color:var(--text-sub)">Đã duyệt</span>
            <span style="font-weight:600; color:#10b981">{{ appService.approvedCommentsCount() }}</span>
          </div>
          <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; margin-bottom: 24px;">
            <div [style.width.%]="(appService.approvedCommentsCount() / (appService.totalComments() || 1)) * 100" style="height:100%; background:#10b981; border-radius:4px; transition: width 0.3s ease;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="font-size:13px; color:var(--text-sub)">Chờ duyệt</span>
            <span style="font-weight:600; color:#f59e0b">{{ appService.pendingCommentsCount() }}</span>
          </div>
          <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; margin-bottom: 24px;">
            <div [style.width.%]="(appService.pendingCommentsCount() / (appService.totalComments() || 1)) * 100" style="height:100%; background:#f59e0b; border-radius:4px; transition: width 0.3s ease;"></div>
          </div>
          
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="font-size:13px; color:var(--text-sub)">Đã ẩn</span>
            <span style="font-weight:600; color:#ef4444">{{ appService.hiddenCommentsCount() }}</span>
          </div>
          <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px;">
            <div [style.width.%]="(appService.hiddenCommentsCount() / (appService.totalComments() || 1)) * 100" style="height:100%; background:#ef4444; border-radius:4px; transition: width 0.3s ease;"></div>
          </div>
        </div>

        <div class="card" style="padding: 24px;">
          <h3 style="margin:0 0 20px 0; font-size: 15px; font-weight: 600;">Tác vụ nhanh</h3>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <button class="btn" (click)="appService.currentPage.set('places')" style="width:100%; padding: 12px 16px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; text-align: left;">+ Thêm địa điểm mới</button>
            <button class="btn" (click)="appService.currentPage.set('comments')" style="width:100%; padding: 12px 16px; background: #fff; color: var(--text-main); border: 1px solid var(--border); border-radius: 8px; font-weight: 500; cursor: pointer; text-align: left;">⏳ Xem bình luận chờ duyệt</button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class DashboardComponent {
  appService = inject(AppService);

  // ==========================================
  // LẤY RA 3 ĐỊA ĐIỂM CÓ NHIỀU BÌNH LUẬN NHẤT
  // ==========================================
  popularPlaces = computed(() => {
    const places = this.appService.placesData();
    const comments = this.appService.commentsData();

    // 1. Tính toán số lượng bình luận cho từng địa điểm
    const placesWithCommentCount = places.map(place => {
      // Đếm số comment mà trường location có chứa tên của địa điểm này
      const count = comments.filter(c => c.location.includes(place.name)).length;
      return {
        ...place,
        commentCount: count
      };
    });

    // 2. Sắp xếp giảm dần theo số comment và cắt lấy 3 cái đầu tiên
    return placesWithCommentCount
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 3);
  });

  // ==========================================
  // DỮ LIỆU BIỂU ĐỒ 7 NGÀY
  // ==========================================
  commentChartData = computed(() => {
    const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const colors = ['#6366f1', '#6366f1', '#6366f1', '#6366f1', '#6366f1', '#34d399', '#e5e7eb'];

    const comments = this.appService.commentsData();

    comments.forEach(comment => {
      if (comment.date) {
        const d = new Date(comment.date);
        const dayIndex = d.getDay(); 
        
        const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        if (mappedIndex >= 0 && mappedIndex < 7) {
          counts[mappedIndex]++;
        }
      }
    });

    const maxCount = Math.max(...counts, 1);

    return dayLabels.map((label, index) => ({
      dayName: label,
      count: counts[index],
      heightPercent: counts[index] === 0 ? 0 : Math.max((counts[index] / maxCount) * 85, 12),
      color: colors[index]
    }));
  });
}