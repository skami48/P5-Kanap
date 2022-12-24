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







async function LoadLocalStorage(){
    let storage = await localStorage.getItem("chart")
    
        if( storage) {

            return JSON.parse(storage);
    
        }else{
            return undefined;
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




async function fillcartElement(storage){

    


    for(let i =0 ; i < storage.id.length;i++){

        let elementNumber =  storage.id[i];
        console.log (elementNumber)
        if( (elementNumber!='')){
            let kanap = await GetSingleKanap(elementNumber);
            
            let article = document.createElement("article");
            let section = document.getElementById("cart__items");
            section.appendChild(article)
            
            article.setAttribute("class", "cart__item");
            article.setAttribute("data-id", storage.id[i]);
            article.setAttribute("data-color", storage.color[i]);
            let divImg = article.appendChild(addElement("div","class","cart__item__img"));
            let image = divImg.appendChild(addElement("img","src",kanap.imageUrl));
            image.setAttribute("alt",kanap.altTxt);
            let content = article.appendChild(addElement("div","class","cart__item__content"));
            let contentDecription = content.appendChild(addElement("div","class","cart__item__content__description"));
            contentDecription.appendChild(addElement("h2","","",kanap.name));
            contentDecription.appendChild(addElement("p","","","Couleur : " + kanap.colors[i]));
            contentDecription.appendChild(addElement("p","","",`Prix : ${kanap.price} €`));
            let cart__item__content__settings  = content.appendChild(addElement("div","class","cart__item__content__settings"));
            let  cart__item__content__settings__quantity =  cart__item__content__settings.appendChild(addElement("div","class","cart__item__content__settings__quantity"));
            cart__item__content__settings__quantity.appendChild(addElement("p","","","Qté : "));
            let cart_item_input = cart__item__content__settings__quantity.appendChild(addElement("input","type","number"));
            cart_item_input.setAttribute("class","itemQuantity");
            cart_item_input.setAttribute("name","itemQuantity");
            cart_item_input.setAttribute("min","1");
            cart_item_input.setAttribute("max","100");
            cart_item_input.setAttribute("value",storage.quantity[i]);
            let cart__item__content__settings__delete = cart__item__content__settings.appendChild(addElement("div","class", "cart__item__content__settings__delete"));
            cart__item__content__settings__delete.appendChild(addElement("p","class","deleteItem","Supprimer"));
        }
   
    }


}


async function onEventCart(){
    let KanapCart = document.getElementsByClassName("cart__item");
    
    for (let i = 0; i < KanapCart.length; i++) {
        const element = KanapCart[i];
        
        let upDateKanapQuantity = element.getElementsByClassName("itemQuantity");
        console.log((typeof(parseInt(upDateKanapQuantity[0].value))))
        upDateKanapQuantity[0].addEventListener('change', function(a){
            a.preventDefault();
            
            upDateKanapQuantity[0].setAttribute("value",parseInt(upDateKanapQuantity[0].value))
            if((upDateKanapQuantity[0].value == 0) || (typeof(parseInt(upDateKanapQuantity[0].value))!= 'number' )){
                upDateKanapQuantity[0].value = 1 ;
                upDateKanapQuantity[0].setAttribute("value",upDateKanapQuantity[0].value)
            }
            upDateKanapQuantity[0].value = parseInt(upDateKanapQuantity[0].value)
            updateCart(KanapCart[i].getAttribute("data-id"),KanapCart[i].getAttribute("data-color"),parseInt(upDateKanapQuantity[0].value))
                .then(function priceupdate(aa){
                CalculatePrice();
            });
  
        });

        let DeleteButton = element.getElementsByClassName("deleteItem");
        DeleteButton[0].addEventListener("click", function(b){
            deleteCart(KanapCart[i].getAttribute("data-id"),KanapCart[i].getAttribute("data-color")).then(function(bb){
                CalculatePrice();
            });
            element.remove();
        });
        
    } 
}


async function CalculatePrice(){
    
    let storage = await LoadLocalStorage();
    let totalPrice = 0;
    let totalKanap = 0;
    for (let i = 0; i < await storage.id.length; i++) {
        const element = storage.id[i];
        if (element != ""){
            let kanap = await GetSingleKanap(element);
            totalKanap += parseInt(storage.quantity[i]);
            totalPrice += parseInt(kanap.price) * parseInt(storage.quantity[i]);

        }

        
    }
    
    document.getElementById("totalQuantity").innerText = totalKanap ;
    
    document.getElementById("totalPrice").innerText = totalPrice;

}
async function deleteCart(kanapID, kanapColor){
    let store = await LoadLocalStorage();
    


    if (store != undefined){
        
        
        for (let i = 0; i <store.id.length  ; i++) {
            const element = store.id[i];

            if(store.id[i] == kanapID && kanapColor == store.color[i]){
                store.id.splice(i,1);
                store.color.splice(i,1);
                store.quantity.splice(i,1);
                localStorage.setItem("chart",JSON.stringify(store));
 
                return 0
                

            }
            
        }

    }
    
}

async function updateCart(kanapID, kanapColor, kanapNumber){
    let store = await LoadLocalStorage();
    


    if (store != undefined){
        
        
        for (let i = 0; i <store.id.length  ; i++) {
            const element = store.id[i];

            if(store.id[i] == kanapID && kanapColor == store.color[i]){
                store.quantity[i] = parseInt(kanapNumber);
                localStorage.setItem("chart",JSON.stringify(store));
                return 0
                

            }
            
        }

    }
    
}


async function main(){
    let storage = await LoadLocalStorage();
    if (storage!= undefined){
        await fillcartElement(storage);
        await CalculatePrice();
        await onEventCart();
    }
}



main();
