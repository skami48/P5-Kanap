function getKanapElements(){  //Call API to get kanap list
    fetch("http://127.0.0.1:3000/api/products/").then(function(result){
        if(result.ok){
            return result.json();}})
        .then(function(value){
            console.log(value);
            parsekanapelements(value);
        })
        .catch(function(err){
            console.log("connection au serveur impossible");
        });

}

function parsekanapelements(kanaplist){ //fill canap list to website


let liste = document.getElementById("items");
for (let i = 0 ;i < kanaplist.length;i++){
    let element = document.createElement("a");
    element.setAttribute("href", "./product.html?id="+kanaplist[i]._id)

    liste.appendChild(element);
    //element.innerHTML= '<article><img src="'+kanaplist[i].imageUrl+'" alt="'+kanaplist[i].altTxt+'"><h3 class="productName">'+kanaplist[i].name+'</h3><p class="productDescription">'+kanaplist[i].description+'</p></article>';
    let article = element.appendChild (addElement("article"));
    let img = article.appendChild(addElement("img","src",kanaplist[i].imageUrl));
    img.setAttribute("alt",kanaplist[i].altTxt);
    article.appendChild(addElement("h3","class","productName",kanaplist[i].name));
    article.appendChild(addElement("p","class","productDescription",kanaplist[i].description));

    
}
}

function addElement(type = "div",attribute = "", attributeValue = "",innerText){
    let element = document.createElement(type);
    if(attribute!= ""){
        element.setAttribute(attribute,attributeValue);

    }
    if(innerText!=undefined){
        element.innerText = innerText;
    }
    return element;

}




getKanapElements(); //start
