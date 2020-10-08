
let cart = [];
let modalQuantity = 1;
let modalKey = 0;

//Listagem
pizzaJson.map((item, index) => {

    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //evento que abre o modal do produto
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQuantity = 1;
        modalKey = key;

        document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');

        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        })

        document.querySelector('.pizzaInfo--qt').innerHTML = modalQuantity;


        let pizzaWindowArea = document.querySelector('.pizzaWindowArea');
        pizzaWindowArea.style.opacity = 0;
        pizzaWindowArea.style.display = 'flex';
        setTimeout(() => {
            pizzaWindowArea.style.opacity = 1;
        }, 200);

    });

    document.querySelector('.pizza-area').append(pizzaItem);

});


function closeModal() {
    let pizzaWindowArea = document.querySelector('.pizzaWindowArea');
    pizzaWindowArea.style.opacity = 0;
    setTimeout(() => {
        pizzaWindowArea.style.display = 'none';
    }, 500);
}

//fecha o modal do produto
let closeBtns = document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//diminui a quantidade do produto
document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQuantity > 1) {
        modalQuantity--;
    }
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQuantity;
});

//aumenta a quantidade do produto
document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQuantity++;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQuantity;
});

//seleciona e troca o tamanho
document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {

    size.addEventListener('click', (e) => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });

});

//acao btn add carrinho
document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item) => {
        return item.identifier == identifier;
    });
    if (key > -1) {
        cart[key].quantity += modalQuantity;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            name: pizzaJson[modalKey].name,
            size,
            quantity: modalQuantity
        });
    }

    updateCart();
    closeModal();
});


document.querySelector('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        document.querySelector('aside').style.left = '0';
    }
});

document.querySelector('.menu-closer').addEventListener('click', () => {
    document.querySelector('aside').style.left = '100vw';
});

//atualiza o carrinho
function updateCart() {

    document.querySelector('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';

        let subTotal = 0;
        let discount = 0;
        let total = 0;

        for (let i in cart) {

            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subTotal += pizzaItem.price * cart[i].quantity;

            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);

            let pizzaSizaName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizaName = 'Pequena';
                    break;
                case 1:
                    pizzaSizaName = 'Média';
                    break;
                case 2:
                    pizzaSizaName = 'Grande';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizaName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantity;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].quantity > 1) {
                    cart[i].quantity--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].quantity++;
                updateCart();
            });

            document.querySelector('.cart').append(cartItem);

        }

        discount = subTotal * 0.1;
        total = subTotal - discount;

        document.querySelector('.result-subtotal').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        document.querySelector('.result-desconto').innerHTML = `R$ ${discount.toFixed(2)}`;
        document.querySelector('.result-total').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }
}

document.querySelector('.cart--finalizar').addEventListener('click', (e)=>{
    e.preventDefault();
  
});


