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
        fetch(api)

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

    document.querySelectorAll('.buy-btn').forEach((item) => {
        item.addEventListener('click', event => {
            console.log(list);
            basket = new Basket(event);
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
    constructor(event) {
        this.event = event;
        this.id = 0;
        this.objBasketAll = [];
        this.countBasket = 0;
        this.addGood();
    }

    addGood() {
        this.id = this.event.target.parentElement.getAttribute('data-id');
        const basketObj = list.goods.find(item => item.id_product == this.id);

        if (basket == 0) {
            const blockBasket = document.querySelector('.box-bucket');
            blockBasket.insertAdjacentHTML('beforeend', this.render());
        }

        if (this.countBasket > 0) {
            basket.forEach(items => {
                if (items.id == this.id) {
                    const basketElem = new ElemBasket(basketObj);
                    this.objBasketAll.push(basketElem);
                    document.querySelector('.bucket').insertAdjacentHTML('beforeend', basketElem.render());
                    this.countBasket++;
                }
                else {
                    this.changeGood();
                }
            })
        }
        else if (this.countBasket == 0) {
            const basketElem = new ElemBasket(basketObj);
            this.objBasketAll.push(basketElem);
            document.querySelector('.bucket').insertAdjacentHTML('beforeend', basketElem.render());
            this.countBasket++;
        }

    }
    removeGood() {

    }
    changeGood() {
        this.objBasketAll[this.id].countSumm = this.objBasketAll[this.id].count + 1;
        this.countBasket++;
        this.priseSumm = this.price * this.countSumm;
        document.querySelector(`[id="${this.id}-price"]`).innerHTML = `${this.countSumm}шт. ${this.priseSumm} $`;
    }

    render() {
        return `<div class="bucket-summ">
     <div class="bucket"></div>
     <p> Стоимость товаров: </p>
     <p class="summ_price">0 $</p>
     </div>`
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
        <button batton-id="${this.id}" class="count-delete">-</button>
        </div>
     </div>`
    }
}