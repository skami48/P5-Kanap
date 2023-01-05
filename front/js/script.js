function getKanapElements(){  //Call API to get kanap list
    fetch("http://127.0.0.1:3000/api/products/").then(function(result){
        if(result.ok){
            return result.json();}})
        .then(function(value){
            
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
    let article = element.appendChild (addElement("article"));
    
    let img = article.appendChild(addElement("img",["src","alt"],[kanaplist[i].imageUrl,kanaplist[i].altTxt]));
    article.appendChild(addElement("h3","class","productName",kanaplist[i].name));
    article.appendChild(addElement("p","class","productDescription",kanaplist[i].description));

    
}
}

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
                
                
            }
            
        }
    
    }
    if(innerText!=undefined){
        element.innerText = innerText;
    }
    return element;

}




getKanapElements(); //start
