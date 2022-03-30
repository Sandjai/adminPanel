export default class DoubleSlider {
    element;
    subElements = {};
    shiftX;
    dragging;
  
    constructor({
      min = 100,
      max = 200,
      formatValue = value => '$' + value,
      selected = {
        from: min,
        to: max
      }
    } = {}) {
      this.min = min;
      this.max = max;
      this.formatValue = formatValue;
      this.selected = selected;
      this.render();
    }
  
    get markup() {
      const { from, to } = this.selected;
      return `
            <div class="range-slider">
                <span data-element="from">${this.formatValue(from)}</span>
                <div data-element="inner" class="range-slider__inner">
                    <span data-element="progress" class="range-slider__progress"></span>
                    <span data-element="thumbLeft" class="range-slider__thumb-left"></span>
                    <span data-element="thumbRight" class="range-slider__thumb-right"></span>
                </div>
                <span data-element="to">${this.formatValue(to)}</span>
            </div>`;
    }
  
    render() {
      const element = document.createElement('div');
      element.innerHTML = this.markup;
      this.element = element.firstElementChild;
  
      this.subElements = this.getSubElements(this.element);
  
      this.initEventListeners();
  
      this.update();
    }
  
    getSubElements(element) {
      const allElements = element.querySelectorAll('[data-element]');
      return [...allElements].reduce((acc, nextValue) => {
        acc[nextValue.dataset.element] = nextValue;
  
        return acc;
      }, {});
    }
  
    initEventListeners() {
      const { thumbLeft, thumbRight } = this.subElements;
  
      thumbLeft.addEventListener('pointerdown', this.clickDown);
      thumbRight.addEventListener('pointerdown', this.clickDown);
    }
  
    clickDown = e => {
      e.preventDefault();
      const thumbElement = e.target;
  
      const { left, right } = thumbElement.getBoundingClientRect();
      if (thumbElement === this.subElements.thumbLeft) {
        this.shiftX = right - e.clientX;
      } else {
        this.shiftX = left - e.clientX;
      }
  
      this.dragging = thumbElement;
  
      this.element.classList.add('range-slider_dragging');
  
      document.addEventListener('pointermove', this.pointerMove);
      document.addEventListener('pointerup', this.clickUp);
    };
  
    pointerMove = e => {
      e.preventDefault();
      const {
        left: innerLeft,
        right: innerRight,
        width
      } = this.subElements.inner.getBoundingClientRect();
  
      if (this.dragging === this.subElements.thumbLeft) {
        let newLeft = (e.clientX - innerLeft + this.shiftX) / width;
  
        if (newLeft < 0) {
          newLeft = 0;
        }
        newLeft *= 100;
        let right = parseFloat(this.subElements.thumbRight.style.right);
  
        if (newLeft + right > 100) {
          newLeft = 100 - right;
        }
  
        this.dragging.style.left = this.subElements.progress.style.left = newLeft + '%';
        this.subElements.from.innerHTML = this.formatValue(this.getValue().from);
      }
  
      if (this.dragging === this.subElements.thumbRight) {
        let newRight = (innerRight - e.clientX - this.shiftX) / width;
        if (newRight < 0) {
          newRight = 0;
        }
        newRight *= 100;
  
        let left = parseFloat(this.subElements.thumbLeft.style.left);
  
        if (left + newRight > 100) {
          newRight = 100 - left;
        }
  
        this.dragging.style.right = this.subElements.progress.style.right = newRight + '%';
        this.subElements.to.innerHTML = this.formatValue(this.getValue().to);
      }
    };
  
    clickUp = e => {
      this.element.classList.remove('range-slider_dragging');
  
      document.removeEventListener('pointermove', this.pointerMove);
      document.removeEventListener('pointerup', this.clickUp);
  
      this.element.dispatchEvent(
        new CustomEvent('range-select', {
          detail: this.getValue(),
          bubbles: true
        })
      );
    };
  
    getValue() {
      const rangeTotal = this.max - this.min;
      const { left } = this.subElements.thumbLeft.style;
      const { right } = this.subElements.thumbRight.style;
  
      const from = Math.round(this.min + parseFloat(left) * 0.01 * rangeTotal);
      const to = Math.round(this.max - parseFloat(right) * 0.01 * rangeTotal);
  
      return { from, to };
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
      document.removeEventListener('pointermove', this.onThumbPointerMove);
      document.removeEventListener('pointerup', this.onThumbPointerUp);
    }
  
    update() {
      const rangeTotal = this.max - this.min;
      const left = Math.floor(((this.selected.from - this.min) / rangeTotal) * 100) + '%';
      const right = Math.floor(((this.max - this.selected.to) / rangeTotal) * 100) + '%';
  
  
      this.subElements.progress.style.left = left;
      this.subElements.progress.style.right = right;
  
      this.subElements.thumbLeft.style.left = left;
      this.subElements.thumbRight.style.right = right;
    }
  }
  