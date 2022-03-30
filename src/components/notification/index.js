export default class NotificationMessage {

    static shownEl;  
    timerId;

    constructor(
        message = '', {
        duration = 0,
        type = ''
      } = {}) {

        this.message = message;
        this.duration = duration;
        this.type = type;
        
        this.render();
    }    
    
    get template () {
        return `<div class="notification ${this.type}" style="--value:${this.duration/1000}s">
                    <div class="timer"></div>
                    <div class="inner-wrapper">
                    <div class="notification-header">${(this.type === 'success') ? "Успех!" : "Ошибка"}</div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                    </div>
                </div>`
    }

    render() {
        const el = document.createElement('div');
        el.innerHTML = this.template;
       
        this.element = el.firstChild;
    }

    show(parent = document.body) {        
            if (NotificationMessage.shownEl) {
                NotificationMessage.shownEl.remove();
                clearTimeout(this.timerId);
            }
            
            parent.append(this.element);
            NotificationMessage.shownEl = this;
            this.timerId = setTimeout(() => {this.destroy()}, `${this.duration}`);
            

        }

    remove() {
        if (this.element) {
        this.element.remove();
        }
    }

    destroy() {       
        this.remove();
        this.element = null;
    }

}
