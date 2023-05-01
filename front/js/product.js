const link = 'http://localhost:3000/api/products/';
const paramsString = window.location.search
const searchParams = new URLSearchParams(paramsString);
// console.log(searchParams)

async function getData() {
    const response = await fetch(link + searchParams.get("id"))
    return response.json()
}
getData()
    .then((data) => {
        // console.log(data)
        const mainImg = `<img src = "${data.imageUrl}">`;
        const title = `${data.name}`
        const price = `${data.price}`
        const description = `${data.description}`
        document.querySelector(`.item__img`).insertAdjacentHTML('beforeend', mainImg)
        document.querySelector(`#title`).insertAdjacentHTML('afterbegin', title)
        document.querySelector(`#price`).insertAdjacentHTML('afterbegin', price)
        document.querySelector(`#description`).insertAdjacentHTML('afterbegin', description)
        data.colors.forEach(color => {
            const newColor = `<option value = '${color}'>${color}</option>`
            document.querySelector(`#colors`).insertAdjacentHTML('beforeend', newColor)
        })

        let cart = JSON.parse(localStorage.getItem("cart")) ?? [];

        function addItemToCart() {
            if (document.querySelector(`#colors`).value == "") {
                window.alert('Veuillez choisir une couleur')
                return
            }
            if (document.querySelector(`#quantity`).value == "0") {
                window.alert('Veuillez choisir une quantité')
                return
            }
            const color = document.querySelector(`#colors`).value;
            const quantity = parseInt(document.querySelector(`#quantity`).value);
            let change = false;
            cart.forEach(item => {
                if (item.color == color && item.id == data._id) {
                    item.quantity = parseInt(item.quantity) + quantity;
                    change = true;
                }
            })
            if (change == false) {
                let newItem = {
                    color: color,
                    quantity: quantity,
                    id: data._id,
                }
                cart.push(newItem);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            window.alert('Votre produit est bien rajouté au panier. Rendez-vous sur la page \'Panier\' pour passer commande.')
        }
        document.getElementById('addToCart').addEventListener("click", addItemToCart)

    });