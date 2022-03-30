import header from './products__header.js'
import SortableTable from '../../../components/sortable-table/index.js'
import DoubleSlider from '../../../components/double-slider/index.js';

export default class Page {
  element;
  subElements = {};
  components = {};
  filterData = {
    filterName: '',
    filterStatus: '',
    doubleSliderData: {
      from: 0,
      to: 0
    }
  };

  initComponents() {
    this.components.doubleSlider = new DoubleSlider({ min: 0, max: 4000 });
    // Init start values of double slider
    this.filterData.doubleSliderData.from = this.components.doubleSlider.min;
    this.filterData.doubleSliderData.to = this.components.doubleSlider.max;

    this.components.sortableTable = new SortableTable(header, {
      url: 'api/rest/products?_embed=subcategory.category'
    });
  }

  async render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);    
    
    this.initComponents();
    await this.renderComponents();
    this.initEventListeners();
    return this.element;
  }

  get template() {
    return `
    <div class="products-list">
      <div class="content__top-panel">
        <h1 class="page-title">Товары</h1>
        <a href="/products/add" class="button-primary">Добавить товар</a>
      </div>
      <div class="content-box content-box_small">
      <form data-element="filter" class="form-inline">
          <div class="form-group">
            <label class="form-label">Сортировать по:</label>
            <input type="text" data-element="filterName" class="form-control" placeholder="Название товара">
          </div>
          <div class="form-group" data-element="sliderContainer">
            <label class="form-label">Цена:</label>
              <!-- //! DoubleSlider -->
          </div>
          <div class="form-group">
            <label class="form-label">Статус:</label>
            <select class="form-control" data-element="filterStatus">
              <option value="" selected="">Любой</option>
              <option value="1">Активный</option>
              <option value="0">Неактивный</option>
            </select>
          </div>
        </form>
      </div>
      <div data-element="productsContainer" class="products-list__container">
        <!--//! SortableTable-->
      </div>
    </div>
    `;
  } 

  initEventListeners() {
    const { filter } = this.subElements;
    const { doubleSlider } = this.components;
    //const { clearFilterBtn } = this.components.sortableTable.subElements;

    filter.addEventListener('input', this.onFilterInput);

    doubleSlider.element.addEventListener('range-select', this.onRangeSelect);

    //clearFilterBtn.addEventListener('pointerdown', this.clearFilters);
  }

  onFilterInput = event => {
    const { filterName, filterStatus } = this.subElements;
    const target = event.target;

    if (target === filterName) {
      this.filterData.filterName = target.value.trim();
    } else if (target === filterStatus) {
      this.filterData.filterStatus = target.value;
    }

    this.updateTable();
  };

  onRangeSelect = event => {
    const { from, to } = event.detail;

    this.filterData.doubleSliderData.from = from;
    this.filterData.doubleSliderData.to = to;

    this.updateTable();
  };

  clearFilters = () => {
    const { filterName, filterStatus } = this.subElements;
    const { min, max } = this.components.doubleSlider;

    filterName.value = '';
    filterStatus.value = '';

    this.filterData.filterName = '';
    this.filterData.filterStatus = '';

    // TODO: лучше в таких случаях использовать деструкцию
    this.components.doubleSlider.subElements.from.innerHTML = `$${min}`;
    this.components.doubleSlider.subElements.to.innerHTML = `$${max}`;
    this.components.doubleSlider.update();

    this.filterData.doubleSliderData.from = 0;
    this.filterData.doubleSliderData.to = 4000;

    this.updateTable();
  };

  async updateTable() {
    const { sorted, step } = this.components.sortableTable;

    const updatedUrl = this.createURL();

    this.components.sortableTable.url.href = updatedUrl;
    await this.components.sortableTable.sortOnServer(sorted.id, sorted.order, 0, step);
  }

  createURL() {
    const {
      filterName,
      filterStatus,
      doubleSliderData: { from: minValue, to: maxValue }
    } = this.filterData;

    const url = new URL('api/rest/products?_embed=subcategory.category', process.env.BACKEND_URL);

    url.searchParams.set('price_gte', minValue);
    url.searchParams.set('price_lte', maxValue);

    if (filterName.trim() !== '') {
      url.searchParams.set('title_like', filterName);
    }
    if (filterStatus != '') {
      url.searchParams.set('status', filterStatus);
    }

    return url.href;
  }

  async renderComponents() {
    this.subElements.sliderContainer.append(this.components.doubleSlider.element);
    this.subElements.productsContainer.append(this.components.sortableTable.element);
  }


  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((acc, next) => {      
      acc[next.dataset.element] = next;
      return acc;
    }, {});
  }

  remove() {
    const { filter } = this.subElements;
    //const { clearFilterBtn } = this.components.sortableTable.subElements;
    filter.removeEventListener('input', this.onFilterInput);
    //clearFilterBtn.removeEventListener('pointerdown', this.clearFilters);
    this.element = null;
  }

  destroy() {
    this.remove();
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}

