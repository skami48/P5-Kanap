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


function getKanapElements(){  //Call API to get kanap list
    fetch("http://127.0.0.1:3000/api/products/").then(function(result){
        if(result.ok){
            return result.json();}})
        .then(function(value){
            console.log(value);
            getlist(value)
            return value;
        })
        .catch(function(err){
            console.log("connection au serveur impossible");
            
        });

}

function fillcartElement(elementID,localStorageElementKey){

    console.log(localStorage.getItem(localStorageElementKey).length);
    

    for(let i =0 ; i < localStorage.getItem(localStorageElementKey).length;i++){
        console.log(localStorage.getItem(localStorageElementKey)[i] );
        
        if( parseInt( localStorage.getItem(localStorageElementKey)[i] )){
            let article = document.createElement("article");
            let section = document.getElementById("cart__items");
            section.appendChild(article)

            article.setAttribute("class", "cart__item");
            article.setAttribute("data-id", localStorageElementKey);
            article.setAttribute("data-color", elementID.colors);
            let divImg = article.appendChild(addElement("div","class","cart__item__img"));
            let image = divImg.appendChild(addElement("img","src",elementID.imageUrl));
            image.setAttribute("alt",elementID.altTxt);
            let content = article.appendChild(addElement("div","class","cart__item__content"));
            let contentDecription = content.appendChild(addElement("div","class","cart__item__content__description"));
            contentDecription.appendChild(addElement("h2","","",elementID.name));
            contentDecription.appendChild(addElement("p","","",elementID.colors[i]));
            contentDecription.appendChild(addElement("p","","",elementID.price+" €"));
            let cart__item__content__settings  = content.appendChild(addElement("div","class","cart__item__content__settings"));
            let  cart__item__content__settings__quantity =  cart__item__content__settings.appendChild(addElement("div","class","cart__item__content__settings__quantity"));
            cart__item__content__settings__quantity.appendChild(addElement("p","","","Qté : "));
            let cart_item_input = cart__item__content__settings__quantity.appendChild(addElement("input","type","number"));
            cart_item_input.setAttribute("class","itemQuantity");
            cart_item_input.setAttribute("name","itemQuantity");
            cart_item_input.setAttribute("min","1");
            cart_item_input.setAttribute("max","100");
            cart_item_input.setAttribute("value",parseInt( localStorage.getItem(localStorageElementKey)[i] ));
            let cart__item__content__settings__delete = cart__item__content__settings.appendChild(addElement("div","class", "cart__item__content__settings__delete"));
            cart__item__content__settings__delete.appendChild(addElement("p","class","deleteItem","Supprimer"));
        }
   
    }


}

var kanaplist = getKanapElements();



function getlist(kanaplist){
for (let i = 0 ; i< localStorage.length;i++){
    
    for(let x = 0;x<kanaplist.length;x++){ 
        
        if (kanaplist[x]._id == localStorage.key(i)){
            console.log(localStorage.key(i)+" found");
            fillcartElement(kanaplist[x],localStorage.key(i));

        }
    }

}
}