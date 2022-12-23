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




function fillcartElement(elementID,localStorageElementKey, colorArray){





    for(let i =0 ; i < colorArray.length;i++){

        let elementNumber =  parseInt(colorArray[i]);
;
        if( (elementNumber!= 0)){
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
            contentDecription.appendChild(addElement("p","","","Couleur : " + elementID.colors[i]));
            contentDecription.appendChild(addElement("p","","","Prix : " + elementID.price+" €"));
            let cart__item__content__settings  = content.appendChild(addElement("div","class","cart__item__content__settings"));
            let  cart__item__content__settings__quantity =  cart__item__content__settings.appendChild(addElement("div","class","cart__item__content__settings__quantity"));
            cart__item__content__settings__quantity.appendChild(addElement("p","","","Qté : "));
            let cart_item_input = cart__item__content__settings__quantity.appendChild(addElement("input","type","number"));
            cart_item_input.setAttribute("class","itemQuantity");
            cart_item_input.setAttribute("name","itemQuantity");
            cart_item_input.setAttribute("min","1");
            cart_item_input.setAttribute("max","100");
            cart_item_input.setAttribute("value",colorArray[i]);
            let cart__item__content__settings__delete = cart__item__content__settings.appendChild(addElement("div","class", "cart__item__content__settings__delete"));
            cart__item__content__settings__delete.appendChild(addElement("p","class","deleteItem","Supprimer"));
        }
   
    }


}



function setcartlist(kanaplist){
for (let i = 0 ; i< localStorage.length;i++){
    
    for(let x = 0;x<kanaplist.length;x++){ 
        
        if (kanaplist[x]._id == localStorage.key(i)){
            console.log(localStorage.key(i)+" found");
            let colorArray =localStorage.getItem(localStorage.key(i)); 
            colorArray = colorArray.split(",");
            fillcartElement(kanaplist[x],localStorage.key(i),colorArray);
            


            

        }
    }

}

}



  

async function GetKanapList(){
    let kanaplist = await fetch("http://127.0.0.1:3000/api/products/")
                                .then(function(result){
                                    return result
                                }).catch(function(err){
                                    console.log(err)
                                    return err
                                });
    kanaplist = await kanaplist.json();
    
    return kanaplist
}
async function GetSingleKanap(KanapID){
    let kanaplist = await fetch("http://127.0.0.1:3000/api/products/"+KanapID)
                                .then(function(result){
                                    return result
                                }).catch(function(err){
                                    console.log(err)
                                    return err
                                });
    kanaplist = await kanaplist.json();
    
    return kanaplist
}

async function CalculatePrice(){
    let kanapCartArray = document.getElementsByClassName("cart__item");
    let totalKanapPrice = 0;
    let totalKanap =0;
    for (let i = 0; i < kanapCartArray.length; i++) {
        const element = kanapCartArray[i];
        let kanapNumber = element.getElementsByClassName("itemQuantity")[0];
        let elementID = element.getAttribute("data-id");
        let singlePriceElement = await GetSingleKanap(elementID)
        totalKanapPrice += parseInt(kanapNumber.getAttribute("value"))*await  singlePriceElement.price ;
        totalKanap +=parseInt(kanapNumber.getAttribute("value"))
    }
    console.log(totalKanapPrice);
    console.log(totalKanap + " kanap");

    let total = document.getElementById("totalQuantity");
    total.innerText = totalKanap;
    let totalPrice = document.getElementById("totalPrice");
    totalPrice.innerText = totalKanapPrice;


}




async function main(){
    let  kanapList = await GetKanapList();
    await setcartlist(kanapList);
    await CalculatePrice();
    
}


main();
