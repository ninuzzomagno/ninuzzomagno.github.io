fetch("./pages/articles/articles.json").then(res => res.json()).then(files=>{
    var div = document.getElementById("recenti");

    files.forEach(element => {

        var href = document.createElement("a");
        href.setAttribute("href","./pages/articles/"+element["name"]+".html");

        var box = document.createElement("div");
        box.setAttribute("class","article");

        var img = document.createElement("img");
        img.setAttribute("src", "./pages/articles/images/" + element["img"] + ".png");
        img.setAttribute("alt","Immagine non disponibile");
        img.setAttribute("loading","lazy");

        box.appendChild(img)

        var descr_container=document.createElement("div");
        descr_container.setAttribute("class","descr");

        var titolo = document.createElement("h3");
        titolo.innerText = element["title"];

        var descr = document.createElement("p");
        descr.innerText = element["descr"];

        descr_container.appendChild(titolo);
        descr_container.appendChild(descr);

        box.appendChild(descr_container);

        href.appendChild(box);

        div.appendChild(href);
        
    });
})