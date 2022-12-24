const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const purchaseID = urlParams.get('id');

document.getElementById("orderId").innerText = purchaseID;
localStorage.removeItem("chart");