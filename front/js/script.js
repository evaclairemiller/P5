async function getData() {
    const response = await fetch('http://localhost:3000/api/products')
    return response.json()
}
getData()
    .then((data) => {
        data.forEach(canap => {
            const card = `<a href="./product.html?id=${canap._id}"><article><img src = "${canap.imageUrl}" alt = "${canap.altTxt}"><h3>${canap.name}</h3><p>${canap.description}</p></article></a>`;
            document.querySelector('.items').insertAdjacentHTML('beforeend', card)
        })
    });