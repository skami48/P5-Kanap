/*function fillElements(serverValue){ // fill the page with info
    
    let imageElem = document.createElement("img");
    imageElem.setAttribute("src",serverValue.imageUrl);
    document.getElementsByClassName("item__img")[0].appendChild(imageElem);

    let title = document.getElementById("title");
    title.innerText = serverValue.name

    let prix = document.getElementById("price");
    prix.innerText = serverValue.price
    let description = document.getElementById("description");
    description.innerText = serverValue.description
    let colors = document.getElementById("colors");
    for (let i = 0 ; i< serverValue.colors.length;i++){
        let color = document.createElement("option");
        color.setAttribute("value",serverValue.colors[i]);
        color.innerText = serverValue.colors[i]
        colors.appendChild(color);

    }

    kanapValue = serverValue;

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

function getselectedcolor(){
    let color = document.getElementById("colors");
    console.log(color.value);
    
}






let chart = document.getElementById("addToCart");
chart.addEventListener("click",function(event){
    event.preventDefault();

    if(document.getElementById("colors").value != 0){
        for (let i = 0;i<kanapValue.colors.length;i++){
            if (document.getElementById("colors").value == kanapValue.colors[i] ){
                if(kanapList[i]== undefined){
                    kanapList[i] = 0;
                }

                kanapList[i] += parseInt(document.getElementById("quantity").value);

        
            }
        }
        
        for( let i = 0 ; i < kanapList.length;i++){
            if (kanapList[i] == undefined){
                kanapList[i] = 0;
            }
        }
        console.log(kanapList);
        localStorage.setItem(kanapID,kanapList);
    }

    


});



const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const kanapID = urlParams.get('id'); //get kanap ID from link

var kanapValue= undefined;


let kanapList = [];
getKanapElements(); //start */


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

function fillElements(serverValue){ // fill the page with info
    
    let imageElem = document.createElement("img");
    imageElem.setAttribute("src",serverValue.imageUrl);
    document.getElementsByClassName("item__img")[0].appendChild(imageElem);

    let title = document.getElementById("title");
    title.innerText = serverValue.name

    let prix = document.getElementById("price");
    prix.innerText = serverValue.price
    let description = document.getElementById("description");
    description.innerText = serverValue.description
    let colors = document.getElementById("colors");
    for (let i = 0 ; i< serverValue.colors.length;i++){
        let color = document.createElement("option");
        color.setAttribute("value",serverValue.colors[i]);
        color.innerText = serverValue.colors[i]
        colors.appendChild(color);

    }

    kanapValue = serverValue;

}


async function addToCartButton(kanap, kanapID){
    let store = await LoadLocalStorage();
    console.log(store);
    if (store != undefined){
        console.log("store.length "+store.id.length);
        let chosenColor = document.getElementById("colors").value;
        for (let i = 0; i <store.id.length  ; i++) {
            const element = store.id[i];
            console.log("kanapID " + chosenColor);
            console.log("element "+ store.color[i]);
            if(store.id[i] == kanapID && chosenColor == store.color[i]){
                store.quantity[i] = parseInt(store.quantity[i])+ parseInt(document.getElementById("quantity").value);
                localStorage.setItem("chart",JSON.stringify(store));
                return 0
                

            }
            
        }
        store.id.push(kanapID);
        store.color.push(document.getElementById("colors").value);
        store.quantity.push(document.getElementById("quantity").value);
        localStorage.setItem("chart",JSON.stringify(store));
        return 0
    }else{
        store = chart
        store.id.push(kanapID);
       
        let color = (document.getElementById("colors").value);
        console.log(color);
        store.color.push(color);
        let quantity = document.getElementById("quantity").value
        store.quantity.push(quantity);
        localStorage.setItem("chart",JSON.stringify(store));
        return 0
    }
   
    

}

async function LoadLocalStorage(){
    let storage = await localStorage.getItem("chart")
    
        if( storage) {

            return JSON.parse(storage);
    
        }else{
            return undefined;
        }
}


let chart= {
    id: [""],
    color: [""],
    quantity : [0]

}

async function main(){
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const kanapID = urlParams.get('id');
    console.log(kanapID)
    var  kanap = await GetSingleKanap(kanapID);
    await fillElements(kanap);
    let chart = document.getElementById("addToCart");
    
    chart.addEventListener("click",function(event){
        event.preventDefault();
        addToCartButton(kanap,  kanapID);
    });
}

main();