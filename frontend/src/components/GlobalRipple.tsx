'use client';

import { useEffect } from 'react';

/**
 * Global Ripple Effect Component
 * Tự động gắn hiệu ứng gợn sóng (Ripple) cao cấp chuẩn Google Material / Apple
 * cho toàn bộ hệ thống nút bấm, tab, checkbox tick và icon tương tác (như Calendar).
 */
export default function GlobalRipple() {
  useEffect(() => {
    function triggerRipple(
      target: HTMLElement,
      clickX?: number,
      clickY?: number,
      customColor?: string
    ) {
      if (target.hasAttribute('disabled') || target.getAttribute('aria-disabled') === 'true') return;

      const computedStyle = window.getComputedStyle(target);
      if (computedStyle.position === 'static') {
        target.style.position = 'relative';
      }
      if (computedStyle.overflow !== 'hidden') {
        target.style.overflow = 'hidden';
      }

      const rect = target.getBoundingClientRect();
      const posX = typeof clickX === 'number' && !isNaN(clickX) ? clickX : rect.width / 2;
      const posY = typeof clickY === 'number' && !isNaN(clickY) ? clickY : rect.height / 2;

      // Tính bán kính bao phủ từ điểm click đến góc xa nhất của phần tử
      const maxDistX = Math.max(posX, rect.width - posX);
      const maxDistY = Math.max(posY, rect.height - posY);
      const radius = Math.hypot(maxDistX, maxDistY);
      const diameter = Math.max(radius * 2, 32);

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect-wave';

      const attrColor = target.getAttribute('data-ripple');
      if (customColor) {
        ripple.style.backgroundColor = customColor;
      } else if (attrColor) {
        ripple.style.backgroundColor = attrColor;
      } else {
        const bg = computedStyle.backgroundColor;
        const isTargetLight =
          target.classList.contains('bg-white') ||
          target.classList.contains('bg-slate-50') ||
          target.classList.contains('bg-slate-100') ||
          target.classList.contains('bg-slate-200') ||
          target.closest('.bg-white, .bg-slate-50, [style*="background-color: rgb(255, 255, 255)"]') !== null;

        const isRedOrDark =
          !isTargetLight &&
          (target.classList.contains('bg-[#D72134]') ||
          target.classList.contains('bg-slate-900') ||
          target.classList.contains('btn-submit') ||
          target.closest('#hero-stage') !== null ||
          bg.includes('215, 33, 52') ||
          bg.includes('185, 28, 28') ||
          bg.includes('15, 23, 42') ||
          bg.includes('30, 41, 59') ||
          bg.includes('6, 12, 34') ||
          bg.includes('9, 21, 56') ||
          bg.includes('0, 0, 0'));

        if (isRedOrDark) {
          ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.32)';
        } else {
          ripple.style.backgroundColor = 'rgba(215, 33, 52, 0.22)';
        }
      }

      ripple.style.width = `${diameter}px`;
      ripple.style.height = `${diameter}px`;
      ripple.style.left = `${posX - radius}px`;
      ripple.style.top = `${posY - radius}px`;

      target.appendChild(ripple);

      const startTime = performance.now();
      const MIN_GROW_TIME = 260; // Đảm bảo gợn sóng có đủ thời gian loang ra toàn bộ phần tử trước khi mờ dần

      let isRemoved = false;
      const finishAndRemove = () => {
        if (isRemoved) return;
        isRemoved = true;
        ripple.classList.add('fade-out');
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.remove();
          }
        }, 320);
      };

      const onPointerRelease = () => {
        window.removeEventListener('pointerup', onPointerRelease);
        window.removeEventListener('pointercancel', onPointerRelease);
        const elapsed = performance.now() - startTime;
        const waitTime = Math.max(0, MIN_GROW_TIME - elapsed);
        setTimeout(finishAndRemove, waitTime);
      };

      window.addEventListener('pointerup', onPointerRelease, { once: true });
      window.addEventListener('pointercancel', onPointerRelease, { once: true });

      setTimeout(() => {
        finishAndRemove();
      }, 700);
    }

    const handlePointerDown = (e: PointerEvent) => {
      // Chỉ nhận chuột trái hoặc chạm màn hình (touch / pen)
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      const targetEl = e.target as HTMLElement | null;
      if (!targetEl) return;

      // 1. XỬ LÝ RIPPLE TẠI ICON LỊCH (KHI BẤM ICON LỊCH HOẶC BẤM Ô ĐỂ MỞ LỊCH)
      const calendarBtn = targetEl.closest<HTMLElement>('.calendar-icon-btn');
      if (calendarBtn) {
        const rect = calendarBtn.getBoundingClientRect();
        triggerRipple(calendarBtn, e.clientX - rect.left, e.clientY - rect.top, 'rgba(215, 33, 52, 0.22)');
        return;
      }

      const dateField = targetEl.closest<HTMLElement>('.lbi-field, [aria-haspopup="dialog"]');
      if (dateField) {
        const calBtn = dateField.parentElement?.querySelector<HTMLElement>('.calendar-icon-btn');
        if (calBtn) {
          triggerRipple(calBtn, calBtn.clientWidth / 2, calBtn.clientHeight / 2, 'rgba(215, 33, 52, 0.22)');
          return;
        }
      }

      // 2. XỬ LÝ RIPPLE TẠI ICON CHECKBOX TICK (KHI NHẤN CHECKBOX HOẶC NHẤN VÀO DÒNG TEXT CAM KẾT)
      const checkboxLabel = targetEl.closest<HTMLElement>('.checkbox-label-target, label');
      if (checkboxLabel) {
        const checkboxIcon = checkboxLabel.querySelector<HTMLElement>('.checkbox-ripple-target');
        if (checkboxIcon) {
          triggerRipple(checkboxIcon, checkboxIcon.clientWidth / 2, checkboxIcon.clientHeight / 2, 'rgba(215, 33, 52, 0.24)');
          return;
        }
      }

      // 3. XỬ LÝ RIPPLE TẠI SQUIRCLE ICON CỦA LOẠI BẰNG (LAUNCHPAD GRID): DÍNH ĐÚNG VÀO ICON, KHÔNG LAN RA CHỮ
      const degreeBtn = targetEl.closest<HTMLElement>('.degree-launchpad-btn');
      if (degreeBtn) {
        const squircle = degreeBtn.querySelector<HTMLElement>('.degree-squircle-target');
        if (squircle) {
          const rect = squircle.getBoundingClientRect();
          const posX =
            e.clientX >= rect.left && e.clientX <= rect.right
              ? e.clientX - rect.left
              : squircle.clientWidth / 2;
          const posY =
            e.clientY >= rect.top && e.clientY <= rect.bottom
              ? e.clientY - rect.top
              : squircle.clientHeight / 2;
          triggerRipple(squircle, posX, posY, 'rgba(255, 255, 255, 0.38)');
          return;
        }
      }

      // 4. HỖ TRỢ ĐÍNH RIPPLE VÀO COMPONENT CON ĐƯỢC CHỈ ĐỊNH QUA DATA-RIPPLE-TARGET
      const targetedParent = targetEl.closest<HTMLElement>('[data-ripple-target]');
      if (targetedParent) {
        const selector = targetedParent.getAttribute('data-ripple-target');
        const customTarget = selector ? targetedParent.querySelector<HTMLElement>(selector) : null;
        if (customTarget) {
          const rect = customTarget.getBoundingClientRect();
          const posX =
            e.clientX >= rect.left && e.clientX <= rect.right
              ? e.clientX - rect.left
              : customTarget.clientWidth / 2;
          const posY =
            e.clientY >= rect.top && e.clientY <= rect.bottom
              ? e.clientY - rect.top
              : customTarget.clientHeight / 2;
          const customColor =
            targetedParent.getAttribute('data-ripple') ||
            customTarget.getAttribute('data-ripple') ||
            undefined;
          triggerRipple(customTarget, posX, posY, customColor);
          return;
        }
      }

      // 5. XỬ LÝ RIPPLE TOÀN BỘ CÁC NÚT BẤM, LIÊN KẾT, TAB, OPTION MENU VÀ NÚT TƯƠNG TÁC
      const target = targetEl.closest<HTMLElement>(
        'button, a, [role="button"], [role="option"], .btn-submit, .ripple-effect, .tab-btn'
      );

      if (!target) return;
      if (target.hasAttribute('disabled') || target.getAttribute('aria-disabled') === 'true') return;
      if (target.classList.contains('no-ripple')) return;

      const rect = target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      triggerRipple(target, clickX, clickY);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return null;
}
