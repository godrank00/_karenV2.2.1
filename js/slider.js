(function () {
  'use strict';
 
  const CONFIG = {
    containerSelector: '.slider-container',
    layoutSelector: '.slider-layout',
    gap: 16,
    edgeRatio: 0.5,
  };
 
  function detectRtlScrollType() {
    const el = document.createElement('div');
    el.dir = 'rtl';
    Object.assign(el.style, {
      fontSize: '14px',
      width: '4px',
      height: '1px',
      position: 'absolute',
      top: '-1000px',
      overflow: 'scroll',
    });
    el.innerHTML = '<div style="width:8px"></div>';
    document.body.appendChild(el);
 
    let type = 'reverse';
    if (el.scrollLeft > 0) {
      type = 'default';
    } else {
      el.scrollLeft = 1;
      if (el.scrollLeft === 0) {
        type = 'negative';
      }
    }
    document.body.removeChild(el);
    return type;
  }
 
  class InfiniteRtlSlider {
    constructor(containerEl) {
      this.container = containerEl;
      this.layout = containerEl.querySelector(CONFIG.layoutSelector);
      if (!this.layout) return;
 
      this.originalItems = Array.from(
        this.layout.querySelectorAll(':scope > li')
      );
      this.itemCount = this.originalItems.length;
      if (this.itemCount === 0) return;
 
      this.scrollType = detectRtlScrollType();
      this.isJumping = false;
      this._currentTotalSets = null;
      this._rebuildScheduled = false;
      this._scrollRafId = null;
 
      this._onScroll = this._onScroll.bind(this);
      this.container.addEventListener('scroll', this._onScroll, {
        passive: true,
      });
 
      this._resizeObserver = new ResizeObserver(() =>
        this._scheduleRebuild()
      );
      this._resizeObserver.observe(this.container);
    }
 
    _scheduleRebuild() {
      if (this._rebuildScheduled) return;
      this._rebuildScheduled = true;
      requestAnimationFrame(() => {
        this._rebuildScheduled = false;
        this._build();
      });
    }
 
    _build() {
      const firstItem = this.originalItems[0];
      const cardWidth = firstItem.getBoundingClientRect().width;
      if (!cardWidth) return;
 
      this.setWidth = cardWidth * this.itemCount + CONFIG.gap * this.itemCount;
 
      const containerWidth = this.container.clientWidth;
 
      const setsNeeded = Math.max(1, Math.ceil(containerWidth / this.setWidth));

      const totalSets = setsNeeded + 2;
 
      if (this._currentTotalSets === totalSets) return;
 
      this._currentTotalSets = totalSets;
      this.setsNeeded = setsNeeded;
      this.totalSets = totalSets;
 
      this._renderSets(totalSets);
      this._setInitialScrollPosition();
    }
 
    _renderSets(totalSets) {
      const fragment = document.createDocumentFragment();
      for (let s = 0; s < totalSets; s++) {
        for (let i = 0; i < this.itemCount; i++) {
          const clone = this.originalItems[i].cloneNode(true);
          clone.setAttribute('data-set-index', String(s));
          fragment.appendChild(clone);
        }
      }
      this.layout.innerHTML = '';
      this.layout.appendChild(fragment);
    }
 
    _setInitialScrollPosition() {
      this._setNormalizedScrollLeft(this.setWidth);
    }
 
    _onScroll() {
      if (this.isJumping) return;
      if (this._scrollRafId) return;
      this._scrollRafId = requestAnimationFrame(() => {
        this._scrollRafId = null;
        this._checkBoundaries();
      });
    }
 
    _checkBoundaries() {
      if (!this.setWidth) return;
 
      const current = this._getNormalizedScrollLeft();
      const maxScroll = this.layout.scrollWidth - this.container.clientWidth;
      const threshold = this.setWidth * CONFIG.edgeRatio;
 
      if (current >= maxScroll - threshold) {
        this._jump(current - this.setWidth);
      } else if (current <= threshold) {
        this._jump(current + this.setWidth);
      }
    }
 
    _jump(newPosition) {
      this.isJumping = true;
      const prevBehavior = this.container.style.scrollBehavior;
      this.container.style.scrollBehavior = 'auto';
      this._setNormalizedScrollLeft(newPosition);
      requestAnimationFrame(() => {
        this.container.style.scrollBehavior = prevBehavior;
        this.isJumping = false;
      });
    }

    _getNormalizedScrollLeft() {
      const { scrollLeft, scrollWidth, clientWidth } = this.container;
      switch (this.scrollType) {
        case 'negative':
          return -scrollLeft;
        case 'reverse':
          return scrollWidth - clientWidth - scrollLeft;
        default:
          return scrollLeft;
      }
    }
 
    _setNormalizedScrollLeft(value) {
      const { scrollWidth, clientWidth } = this.container;
      switch (this.scrollType) {
        case 'negative':
          this.container.scrollLeft = -value;
          break;
        case 'reverse':
          this.container.scrollLeft = scrollWidth - clientWidth - value;
          break;
        default:
          this.container.scrollLeft = value;
      }
    }
 
    destroy() {
      this._resizeObserver.disconnect();
      this.container.removeEventListener('scroll', this._onScroll);
    }
  }
 
  function initAll() {
    document
      .querySelectorAll(CONFIG.containerSelector)
      .forEach((el) => new InfiniteRtlSlider(el));
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
 
  window.InfiniteRtlSlider = InfiniteRtlSlider;
})();

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".slider-container");
  const layout = document.querySelector(".slider-layout");
  if (!container || !layout) return;

  let autoScrollInterval = null;
  let cooldownTimeout = null;

  const scrollPrev = () => {
    const firstCard = layout.querySelector("li");
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = parseInt(window.getComputedStyle(layout).gap) || 16;
    const step = cardWidth + gap;

    container.scrollBy({
      left: -step,
      behavior: "smooth"
    });
  };

  const startAutoScroll = () => {
    stopAllTimers();
    autoScrollInterval = setInterval(scrollPrev, 3500);
  };

  const stopAllTimers = () => {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    if (cooldownTimeout) clearTimeout(cooldownTimeout);
  };

  const handleDragStart = () => {
    stopAllTimers();
  };

  const handleDragEnd = () => {
    stopAllTimers();
    cooldownTimeout = setTimeout(() => {
      startAutoScroll();
    }, 100);
  };

  startAutoScroll();

  container.addEventListener("mousedown", handleDragStart);
  window.addEventListener("mouseup", handleDragEnd);

  container.addEventListener("touchstart", handleDragStart, { passive: true });
  container.addEventListener("touchend", handleDragEnd);
});