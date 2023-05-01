const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const id = searchParams.get('id');

if (id == null) {
    window.location.href = 'index.html'
}
document.getElementById('orderId').innerHTML = `<br> ${id}`;

localStorage.clear();