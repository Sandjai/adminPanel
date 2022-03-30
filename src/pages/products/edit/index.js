import ProductForm from "../../../components/product-form";

export default class Page {
  element;
  subElements = {};
  components = {};  

  constructor(productId = null) {
    this.productId = productId;
  }

  async render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div>
        <h1>${this.productId != null ? 'Редактирование товара' : 'Новый товар'}</h1>
      </div>`;

    this.element = element.firstElementChild;

    this.initComponents();
    await this.renderComponents();

    return this.element;
  }

  initComponents() {
    

    this.components.productFrom = new ProductForm(this.productId);
  }

  async renderComponents() {
    const element = await this.components.productFrom.render();

    this.element.append(element);
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
