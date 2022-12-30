function addElement(type = "div",attribute = "", attributeValue = "",innerText){ // add element attribute + innertext give and array for attribute and attribute value for multiple addition
    let element = document.createElement(type);

    //check if attribute is a string or array
    if ( typeof(attribute) === 'string'){
        if(attribute!= ""){
            element.setAttribute(attribute,attributeValue);
        }
    }else{
        for (let index = 0; index < attribute.length; index++) {
            attribute[index];
            if (attribute[index] != 0){
                element.setAttribute(attribute[index],attributeValue[index]);
                //console.log(attributeValue[index]) 
            }
        }
    }
    if(innerText!=undefined){
        element.innerText = innerText;
    }
    return element;
}




function LoadLocalStorage(){  //Open local storage or return undefined if not exist
    let storage =  localStorage.getItem("chart")
        if( storage) {
            return JSON.parse(storage);
        }else{
            return undefined;
        }
}




function GetKanapList(){ //ask the list of kanap from the server
    let kanaplist =  fetch("http://127.0.0.1:3000/api/products/")
                                .then(function(result){
                                    if(result.ok){
                                        return result.json();
                                }
                                })
                                .then(function(a){
                                   return a
                                })
                                .catch(function(err){
                                    console.log(err)
                                    return 'err'
                                });
    
    return kanaplist
}



async function GetSingleKanap(KanapID){//ask one kanap for the ID from the server
    let kanaplist =  fetch("http://127.0.0.1:3000/api/products/"+KanapID)
                                .then(function(result){
                                    if(result.ok){
                                        return result.json();
                                }
                                })
                                .then(function(a){
                                    return a
                                })
                                .catch(function(err){
                                    console.log(err)
                                    return 'err'
                                });
    
    return kanaplist
}




async function fillcartElement(storage){ //fill the page with kanap elements
    for(let i =0 ; i < storage.length;i++){ 
        
        let elementNumber =  storage[i].id;

        if( (elementNumber!='')){

            let kanap = await GetSingleKanap(elementNumber);
            let article = addElement("article",["class","data-id","data-color"],["cart__item",storage[i].id,storage[i].color]);
            let section = document.getElementById("cart__items");
            section.appendChild(article)
            let divImg = article.appendChild(addElement("div","class","cart__item__img"));
            let image = divImg.appendChild(addElement("img",["src","alt"],[kanap.imageUrl,kanap.altTxt]));
            let content = article.appendChild(addElement("div","class","cart__item__content"));
            let contentDecription = content.appendChild(addElement("div","class","cart__item__content__description"));
            contentDecription.appendChild(addElement("h2","","",kanap.name));
            let kanapColor = kanap.colors[i];
            console.log(kanapColor);
            contentDecription.appendChild(addElement("p","","","Couleur : " + storage[i].color));
            contentDecription.appendChild(addElement("p","","",`Prix : ${kanap.price} €`));
            let cart__item__content__settings  = content.appendChild(addElement("div","class","cart__item__content__settings"));
            let  cart__item__content__settings__quantity =  cart__item__content__settings.appendChild(addElement("div","class","cart__item__content__settings__quantity"));
            cart__item__content__settings__quantity.appendChild(addElement("p","","","Qté : "));
            let cart_item_input = cart__item__content__settings__quantity.appendChild(addElement("input",["type","class","name","min","max","value"],["number","itemQuantity","itemQuantity","1","100",storage[i].quantity]));
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
        upDateKanapQuantity[0].addEventListener('change', function(a){
            a.preventDefault();
            upDateKanapQuantity[0].setAttribute("value",parseInt(upDateKanapQuantity[0].value))
            if((upDateKanapQuantity[0].value <= 0) || (typeof(parseInt(upDateKanapQuantity[0].value))!= 'number' )){
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
            deleteCart(element.getAttribute("data-id"),element.getAttribute("data-color")).then(function(bb){
                CalculatePrice();
            });
            element.remove();
        });
        
    } 
}


async function CalculatePrice(){ // ask the server for the price and parse it to the page
    
    let storage = await LoadLocalStorage();
    let totalPrice = 0;
    let totalKanap = 0;
    for (let i = 0; i < await storage.length; i++) {
        const element = storage[i].id;
        if (element != ""){
            let kanap = await GetSingleKanap(element);
            totalKanap += parseInt(storage[i].quantity);
            totalPrice += parseInt(kanap.price) * parseInt(storage[i].quantity);
        }

        
    }
    
    document.getElementById("totalQuantity").innerText = totalKanap ;
    document.getElementById("totalPrice").innerText = totalPrice;

}
async function deleteCart(kanapID, kanapColor){ //delete element to from the store
    let store = await LoadLocalStorage();
    if (store != undefined){
        for (let i = 0; i <store.length  ; i++) {
            const element = store[i].id;
            if(element== kanapID && kanapColor == store[i].color){
                store.splice(i,1);
                //store.color.splice(i,1);
                //store.quantity.splice(i,1);
                localStorage.setItem("chart",JSON.stringify(store));
                console.log(store.length);
                if (store.length == 0){
                    localStorage.removeItem("chart");
                }
                return 0
            }
        }
    }
}

async function updateCart(kanapID, kanapColor, kanapNumber){// apply user change to localstorage
    let store = await LoadLocalStorage();
    if (store != undefined){
        for (let i = 0; i <store.length  ; i++) {
            const element = store[i].id;
            if(store[i].id == kanapID && kanapColor == store[i].color){
                store[i].quantity = parseInt(kanapNumber);
                localStorage.setItem("chart",JSON.stringify(store));
                return 0
            }
        }
    }
}


async function post(){

    let storage = await LoadLocalStorage();
    let oform =document.forms[0];
    oform.addEventListener("submit",function(a){
        a.preventDefault();
        if(!(/^[a-zA-Z ]+$/.test(oform.firstName.value))){
            let err = document.getElementById("firstNameErrorMsg").innerText ="Prenom Invalide";
            return -1;
        }else{
            document.getElementById("firstNameErrorMsg").innerText = "";
        }
        if(!(/^[a-zA-Z ]+$/.test(oform.lastName.value))){
            document.getElementById("lastNameErrorMsg").innerText = "Nom Invalide";
            return -1
        }else{
            document.getElementById("lastNameErrorMsg").innerText = "";
        }
        if(!(/[A-Za-z0-9'\.\-\s\,]/.test(oform.address.value))){
            document.getElementById("addressErrorMsg").innerText = "Adresse Invalide";
            return -1
        }else{
            document.getElementById("addressErrorMsg").innerText = "";
        }
        if(!(/[A-Za-z0-9'\.\-\s\,]/.test(oform.city.value))){
            document.getElementById("cityErrorMsg").innerText = "Ville Invalide";
            return -1
        }else{
            document.getElementById("cityErrorMsg").innerText = "";
        }
        if(!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(oform.email.value))){
            document.getElementById("emailErrorMsg").innerText = "Email Invalide";
            return -1
        }else{
            document.getElementById("emailErrorMsg").innerText = "";
        }
        let Packet ={
            contact: {
            firstName : oform.firstName.value,
            lastName : oform.lastName.value,
            address : oform.address.value,
            city : oform.city.value,
            email : oform.email.value,
            },
            products:[]
        };

        

        

        for (let index = 0; index < storage.length; index++) {
            const element = storage[index];
            if(element != ""){
                for (let x = 0; x < parseInt(storage[index].quantity); x++) {
                    Packet.products.push(element.id);
                }
            }
            
        }
        
        let topost= (JSON.stringify(Packet));
        fetch('http://localhost:3000/api/products/order', {
                            method: 'POST',
                            headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: topost,})
                    .then(function(result){
                                if(result.ok){
                                return result.json()
                                }
                            })
                    .then(function(a){
                                window.location.href = 'confirmation.html?id='+ a.orderId
                                })
    });
}



async function main(){
    let storage = await LoadLocalStorage();
    if (storage!= undefined){
        await fillcartElement(storage);
        await CalculatePrice();
        await onEventCart();
        await post()

    }
    
}



main();
