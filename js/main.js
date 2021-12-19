const api = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json';

class ProductsList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this.img = [];
        this.allProducts = [];
        this._fetchProducts();
        this._imgAdd();
    }

    _fetchProducts() {
        return fetch(api)
            .then(data => data.json())
            .then(data => {
                this.goods = data;

                let count = 0;
                for (let line of this.goods) {
                    line[this.img[count].name] = this.img[count].adress;
                    count++;
                }
                this.render()
            })
    }

    _imgAdd() {
        this.img = [
            { name: 'img', adress: 'notebook.jpg' },
            { name: 'img', adress: 'mouse.jpg' }
        ];
    }

    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new ProductItem(product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }

    getSum() {
        //         let s = 0;
        //         this.goods.forEach(item=>{
        //             s += item.price;
        //         })


        //        for(let product of this.goods){
        //            s += product.price;
        //        }
        //reduce используется для последовательной обработки каждого элемента массива с сохранением промежуточного результата.
        //        let res = this.allProducts.reduce((s, item) => s + item.price,0);
        // alert(res);
    }
}


class ProductItem {
    constructor(product) {
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = product.img;

    }

    render() {
        return `<div class="product-item" data-id="${this.id}">
                <img src="img/${this.img}" alt="Some img">
                <h3>${this.title}</h3>
                <p>${this.price}</p>
                <button class="buy-btn">Купить</button>
            </div>`
    }
}

let list = new ProductsList();
let basket = 0;


setTimeout(() => {
    // list.render();
    list.getSum();
    Basket.addBoxBasket();

    document.querySelectorAll('.products').forEach((item) => {
        item.addEventListener('click', event => {
            //console.log(event.target.classList.contains('buy-btn'));
            if (event.target.classList.contains('buy-btn')) {
                console.log(list);
                basket.event = event;
                basket.changeGood();
            }
        });
    });
}, 1000);



// let prom = link => {
//     return new Promise((resolve) => {
//         resolve(fetch(link))
//     })
// };

// prom(api)


class Basket {
    constructor(event = 0, countBasket = 0, containerBasket = '.bucket', eventButtonClass = '.count-delete') {
        this.event = event;
        this.containerBasket = document.querySelector(containerBasket);
        this.eventButtonClass = eventButtonClass;
        this.basketId = 0;
        this.objBasketAll = [];
        this.countBasket = countBasket;
        this.summResult = 0;
    }

    static addBoxBasket() {
        const blockBasket = document.querySelector('.box-bucket');
        blockBasket.insertAdjacentHTML('beforeend', Basket.render());
        basket = new Basket();
    }

    static render() {
        return `<div class="bucket-summ">
     <div class="bucket"></div>
     <p> Стоимость товаров: </p>
     <p class="summ_price">0 $</p>
     </div>`
    }

    addGood() {
        const basketObj = list.goods.find(item => item.id_product == this.id);

        const basketElem = new ElemBasket(basketObj);
        this.objBasketAll.push(basketElem);

        // basket.objBasketAll[basket.basketId].basketId = basket.basketId++;

        this.containerBasket.insertAdjacentHTML('beforeend', basketElem.render());
        const eventDelete = new Button();
        this.countBasket++;
        this.summResult += basketObj.price;
        basket.renderResult();
    }

    removeGood() {
        this.id = this.event.target.getAttribute('button-id');
        const object = Basket.getBasketElem(this.id);

        Basket.delete(object);
        document.querySelector(`div[prise-id='${this.id}']`).innerHTML = `${object.count}шт. ${object.price} $`;
        basket.renderResult();

        if (object.count == 0) {
            if (this.containerBasket.hasChildNodes()) {           //Не пуст ли объект, есть ли у него дети
                var children = this.containerBasket.childNodes;
                children.forEach(box => {
                    if (Basket.getIDObject(box) == object.id) {
                        box.remove();
                        delete basket.objBasketAll[Basket.getBasketId(this.id)];
                        if (basket.countBasket == 0) {
                            basket.objBasketAll = [];
                            document.querySelector(`.summ_price`).innerHTML = 'Корзина пуста';
                        }
                    }
                })
            }
        }
    }

    changeGood() {
        this.id = this.event.target.parentElement.getAttribute('data-id');
        const object = Basket.getBasketElem(this.id)

        if (object == undefined) {
            this.addGood();
        }
        else {
            Basket.add(object);
            document.querySelector(`div[prise-id='${this.id}']`).innerHTML = `${object.count}шт. ${object.summPrice} $`;
            basket.renderResult();
        }
    }

    renderResult() {
        document.querySelector(`.summ_price`).innerHTML = `${this.countBasket}шт. ${this.summResult} $`;
    }

    static getIDObject(object) {
        return Number(object.getAttribute('box-id'));
    }

    static add(object) {
        basket.countBasket++;
        object.count++;
        object.summPrice = object.price * object.count;
        basket.summResult += object.price;
    }

    static delete(object) {
        basket.countBasket--;
        object.count--;
        object.summPrice = object.price * object.count;
        basket.summResult -= object.price;
    }

    static getBasketId(id) {
        return basket.objBasketAll.findIndex(object => object.id == id);
    }

    static getBasketElem(id) {
        if (basket.countBasket > 0) {
            return basket.objBasketAll.find(object => object.id == id);
        }
    }
}

class Button {
    constructor(eventButtonClass = '.bucket') {
        this.eventButtonClass = eventButtonClass;
        this.addEventDelete();
    }

    addEventDelete() {
        document.querySelectorAll(this.eventButtonClass).forEach((item) => {
            item.addEventListener('click', event => {
                if (event.target.classList.contains('count-delete')) {
                    basket.event = event;
                    basket.removeGood();
                    event.stopPropagation();
                }
            });
        });
    }
}

class ElemBasket extends ProductItem {
    constructor(product) {
        super(product)
        this.count = 1;
    }

    render() {
        return `<div box-id="${this.id}" class="bucket-item">
        <div>
        <h3 class = "title">${this.title}</h3>
        <img src="img/${this.img}" alt="img_${this.id}" style="width: 120px; height: 90px;">
        </div>
        <div prise-id="${this.id}" class = "price">
        <p>${this.count}шт. ${this.price} $</p>
        </div>
        <div class = "count-item">
        <button button-id="${this.id}" class="count-delete">-</button>
        </div>
     </div>`
    }
}