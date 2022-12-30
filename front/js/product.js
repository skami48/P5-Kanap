


async function GetSingleKanap(KanapID){
    let kanaplist = await fetch("http://127.0.0.1:3000/api/products/"+KanapID)
                                .then(function(result){
                                    return result;
                                }).catch(function(err){
                                    console.log(err);
                                    return err;
                                });
    kanaplist = await kanaplist.json();
    
    return kanaplist;
}

function fillElements(serverValue){ // fill the page with info
    
    let imageElem = document.createElement("img");
    imageElem.setAttribute("src",serverValue.imageUrl);
    document.getElementsByClassName("item__img")[0].appendChild(imageElem);

    let title = document.getElementById("title");
    title.innerText = serverValue.name;

    let prix = document.getElementById("price");
    prix.innerText = serverValue.price;
    let description = document.getElementById("description");
    description.innerText = serverValue.description;
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
    

    if ( ((parseInt(document.getElementById("quantity").value) < 1) || 
          (parseInt(document.getElementById("quantity").value) > 100)) ||
          (document.getElementById("colors").value == 0 || 
          (parseInt(document.getElementById("quantity").value) == null))){

        alert("erreur quantité ou Couleur pas selectionné");
        return -1;
    }
    if (store != undefined){
        console.log("store.length "+ store.length);
        let chosenColor = document.getElementById("colors").value;
        for (let i = 0; i <store.length  ; i++) {
            const element = store[i];
            console.log("kanapID " + chosenColor);
            console.log("element "+ store[i].color);
            if(store[i].id == kanapID && chosenColor == store[i].color){
                store[i].quantity = parseInt(store[i].quantity)+ parseInt(document.getElementById("quantity").value);
                localStorage.setItem("chart",JSON.stringify(store));
                alert("element ajouté au panier");
                return 0;
                

            }
            
        }
        store.push(ElementCart);
        store[store.length-1].id=kanapID;
        store[store.length-1].color = document.getElementById("colors").value;
        store[store.length-1].quantity = document.getElementById("quantity").value;

        localStorage.setItem("chart",JSON.stringify(store));
        alert("element ajouté au panier");
        return 0;
    }else{
        store = [];
        store.push(ElementCart);
        store[store.length-1].id = kanapID;
        store[store.length-1].color = document.getElementById("colors").value ;

        localStorage.setItem("chart",JSON.stringify(store));
        alert("element ajouté au panier");
        return 0;
    }

   
    
 
}

async function LoadLocalStorage(){
    let storage = await localStorage.getItem("chart");
    
        if( storage) {

            return JSON.parse(storage);
    
        }else{
            return undefined;
        }
}




let ElementCart= {
    id : "",
    color : "",
    quantity :""

};


async function main(){
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const kanapID = urlParams.get('id');
    console.log(kanapID);
    var  kanap = await GetSingleKanap(kanapID);
    await fillElements(kanap);
    let chart = document.getElementById("addToCart");
    
    chart.addEventListener("click",function(event){
        event.preventDefault();
        addToCartButton(kanap,  kanapID);
    });
}

main();