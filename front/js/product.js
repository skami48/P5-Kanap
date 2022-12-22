const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const kanapID = urlParams.get('id'); //get kanap ID from link


getKanapElements(); //start
function fillElements(serverValue){ // fill the page with info
    
    let imageElem = document.createElement("img");
    imageElem.setAttribute("src",serverValue.imageUrl);
    document.getElementsByClassName("item__img")[0].appendChild(imageElem);

    let title = document.getElementById("title");
    title.innerHTML = serverValue.name

    let prix = document.getElementById("price");
    prix.innerHTML = serverValue.price
    let description = document.getElementById("description");
    description.innerHTML = serverValue.description
    let colors = document.getElementById("colors");
    for (let i = 0 ; i< serverValue.colors.length;i++){
        let color = document.createElement("option");
        color.setAttribute("value",serverValue.colors[i]);
        color.innerHTML = serverValue.colors[i]
        colors.appendChild(color);

    }


}

function getKanapElements(){ //get the kanap info from APi
    fetch("http://127.0.0.1:3000/api/products/"+kanapID).then(function(result){
        if(result.ok){
            return result.json();}})
        .then(function(value){
            console.log(value);
            
            fillElements(value);
            
        })
        .catch(function(err){
            console.log("connection au serveur impossible");
        });

}

