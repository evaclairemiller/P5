const link = 'http://localhost:3000/api/products/';
const cart = JSON.parse(localStorage.getItem('cart') ?? "[]");
let cartQuantity = 0;
let totalPrice = 0;

cart.forEach(element => {
    const canap = fetch(link + element.id)
        .then(data => {
            return data.json()
        })
        .then(canap => {
            const prix = canap.price
            const card = `
            <article class="cart__item" data-id="${canap._id}" data-color="${element.color}">
                <div class="cart__item__img">
                    <img src="${canap.imageUrl}" alt="${canap.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${canap.name}</h2>
                        <p>${element.color}</p>
                        <p>${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(prix)}</p>
                    </div>
                    <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" onchange="modifyQuantity(event)" min="1" max="100" value="${element.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p onclick="deleteItem(event)" class="deleteItem">Supprimer</p>
                    </div >
                    </div >
                </div >
            </article >`

            cartQuantity = cartQuantity + parseInt(element.quantity);
            document.getElementById("totalQuantity").innerHTML = cartQuantity;


            totalPrice += (prix * parseInt(element.quantity))
            document.getElementById("totalPrice").innerHTML = (Math.round(totalPrice * 100) / 100).toFixed(2);

            document.querySelector('#cart__items').insertAdjacentHTML('beforeend', card)
        })
    return canap
});

function deleteItem(event) {
    itemToRemove = ((event.target.closest('article')));
    const color = itemToRemove.getAttribute('data-color');
    const id = itemToRemove.getAttribute('data-id');
    let items = JSON.parse(localStorage.getItem('cart'));
    items = items.filter(item => item.id !== id || item.color !== color);
    itemToRemove.remove();
    localStorage.setItem("cart", JSON.stringify(items));
}

function modifyQuantity(event) {
    quantity = event.target.value;
    itemToModify = ((event.target.closest('article')));
    const color = itemToModify.getAttribute('data-color');
    const id = itemToModify.getAttribute('data-id');
    let items = JSON.parse(localStorage.getItem('cart'));
    items.forEach(item => {
        if (item.color == color && item.id == id) {
            item.quantity = parseInt(quantity)
        }
    })
    localStorage.setItem('cart', JSON.stringify(items));
}
document.querySelectorAll('.itemQuantity').forEach(input => {
    input.addEventListener('change', modifyQuantity);
})

// ************* FORMULAIRE *****************
let form = document.querySelector('.cart__order__form')

form.firstName.addEventListener('change', function () {
    validFirstName(this);
});
const validFirstName = function (inputFirstName) {
    let firstNameRegExp = new RegExp(
        '^[A-Za-zÀ-ÖØ-öø-ÿ\' -]+$', 'g'
    );

    let errorFirstName = document.querySelector('#firstNameErrorMsg')

    if (firstNameRegExp.test(inputFirstName.value)) {
        errorFirstName.innerHTML = '';
    }
    else {
        errorFirstName.innerHTML = 'Prénom Non Valide'
    }
};

form.lastName.addEventListener('change', function () {
    validLastName(this);
});
const validLastName = function (inputLastName) {
    let lastNameRegExp = new RegExp(
        '^[A-Za-zÀ-ÖØ-öø-ÿ\' -]+$', 'g'
    );

    let errorLastName = document.querySelector('#lastNameErrorMsg')

    if (lastNameRegExp.test(inputLastName.value)) {
        errorLastName.innerHTML = '';
    }
    else {
        errorLastName.innerHTML = 'Nom Non Valide'
    }
};

form.address.addEventListener('change', function () {
    validAddress(this);
});
const validAddress = function (inputAddress) {
    let addressRegExp = new RegExp(
        '^[0-9A-Za-zÀ-ÖØ-öø-ÿ\' ,-]+$', 'g'
    );

    let errorAddress = document.querySelector('#addressErrorMsg')

    if (addressRegExp.test(inputAddress.value)) {
        errorAddress.innerHTML = '';
    }
    else {
        errorAddress.innerHTML = 'Adresse Non Valide'
    }
};

form.city.addEventListener('change', function () {
    validCity(this);
});
const validCity = function (inputCity) {
    let cityRegExp = new RegExp(
        '^[A-Za-zÀ-ÖØ-öø-ÿ\' -]+$', 'g'
    );

    let errorCity = document.querySelector('#cityErrorMsg')

    if (cityRegExp.test(inputCity.value)) {
        errorCity.innerHTML = '';
    }
    else {
        errorCity.innerHTML = 'Ville Non Valide'
    }
};

form.email.addEventListener('change', function () {
    validEmail(this);
});
const validEmail = function (inputEmail) {
    let emailRegExp = new RegExp(
        '^[a-zA-Z0-9._%+-]+[@]{1}[a-zA-Z0-9_-]+[.]{1}[a-zA-Z.]{2,63}$', 'g'
    );

    let errorEmail = document.querySelector('#emailErrorMsg')

    if (emailRegExp.test(inputEmail.value)) {
        errorEmail.innerHTML = '';
    }
    else {
        errorEmail.innerHTML = 'Adresse Non Valide'
    }
};

// ************* SUBMIT BUTTON ***************
form.addEventListener('submit', callbackFunction);
function callbackFunction(event) {

    event.preventDefault();
    const myFormData = new FormData(event.target);
    const contact = Object.fromEntries(myFormData.entries());

    const panier = JSON.parse(localStorage.getItem('cart'));
    const products = panier.map(item => item.id)

    const body = {
        contact: contact, products: products
    }

    async function sendData() {
        const response = await fetch('http://localhost:3000/api/products/order', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.json()
    }
    sendData()
        .then((data) => {
            const orderNumber = data.orderId;
            const confirmationPage = `confirmation.html?id=`;
            window.location.href = confirmationPage + orderNumber
        });

};