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


const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const kanapID = urlParams.get('id'); //get kanap ID from link

var kanapValue= undefined;


let kanapList = [];
getKanapElements(); //start



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
