const API_KEY = "8d33e1b0-b77e-11e8-bf0e-e9322ccde4db";

document.addEventListener("DOMContentLoaded", () => {
    const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;

    // get the hash from the URL
    var hash = location.hash


    // if there is a hash and the hash is saved, then go to the location
    if (hash) {
        // if the hash has a dot then it's probably an object
        if (hash.indexOf('.') > -1) {
            showSingleTable(hash.substring(1));
        }
        showObjectsTable(hash.substring(1));
    }
    else {
        // otherwise go to the first page
        showGalleries(url);
    }
});

// go back button in ShowObjectsTable
function goBackToGallery() {
    document.querySelector("#all-objects").style.display = "none";
    document.querySelector("#all-galleries").style.display = "block";
    document.querySelector("#single-object").style.display = "none";
}

// go back button in ShowSingleObject
function goBackToObject() {
    document.querySelector("#all-objects").style.display = "block";
    document.querySelector("#all-galleries").style.display = "none";
    document.querySelector("#single-object").style.display = "none";
}


function showGalleries(url) {
    // Make sure the site is available in local storage
    // if the page has been loaded before
    if (typeof(Storage !== "undefined") && sessionStorage.getItem(url)) {
        // store the url of the current page then use the existing cache
        var cachedData = sessionStorage.getItem(url);
        // Parse and display the existing JSON in local storage
        parseGalleryData(JSON.parse(cachedData));
    }
    // if the url has not been used before
    else {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // add the url and JSON contents
                sessionStorage.setItem(url, JSON.stringify(data));
                // Parse and display the new data
                parseGalleryData(data);
            });
    }
}

// parse gallery data if it does not already exist
function parseGalleryData(data) {

    data.records.forEach(gallery => {
        document.querySelector("#galleries").innerHTML += `
        <li>
          <a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})">
            Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
          </a>
        </li>
      `;
    });

    if (data.info.next) {
        showGalleries(data.info.next);
    }

}




function showObjectsTable(id) {
    document.querySelector("#all-objects").style.display = "block";
    document.querySelector("#all-galleries").style.display = "none";
    document.querySelector("#single-object").style.displayer = "none";
    document.querySelector("#objects").innerHTML = "";

    const obj_url = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&gallery=${id}`
    moreObjects(obj_url)
}

function moreObjects(obj_url) {

    if (typeof(Storage !== "undefined") && sessionStorage.getItem(obj_url)) {
        var cachedData = sessionStorage.getItem(obj_url);
        parseObjectData(JSON.parse(cachedData));
    }
    else {
        fetch(obj_url)
            .then(objResponse => objResponse.json())
            .then(objData => {

                sessionStorage.setItem(obj_url, JSON.stringify(objData));
                parseObjectData(objData);
            });
    }
}

function parseObjectData (objData) {
                objData.records.forEach(object => {
                    var allpeople = "";

                    if (object.people !== "null") {
                        object.people.forEach(person => {
                            allpeople += person.name + ", ";
                        });
                    } else {
                        allpeople = "None found";
                    }

                    document.querySelector("#objects").innerHTML += `
                                    <li>
                                    <a href="#${object.objectnumber}" onclick="showSingleTable('${object.objectnumber}')">
                                    Title: ${object.title}.
                                    <br> 
                                    People involved: ${allpeople}
                                    
                                    <br>
                                    URL: ${object.url}
                                    <br>
                                    Image: <img src="${object.primaryimageurl}" class="picture">
                                    </a>
                                    <br>
                                    </li>
                                    `;
                });
                if (objData.info.next) {
                    moreObjects(objData.info.next);
                }
            }



function showSingleTable(id) {

    document.querySelector("#single-object").style.display = "block";
    document.querySelector("#all-objects").style.display = "none";
    document.querySelector("#all-galleries").style.display = "none";


    const obj_url = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&objectnumber=${id}`;

    fetch(obj_url)
        .then(objResponse => objResponse.json())
        .then(objData => {
            objData.records.forEach(object => {
                document.querySelector("#single").innerHTML = `
                                    <strong> Title: </strong> ${object.title}
                                    <br>
                                    <img src="${object.primaryimageurl}" class="picture">
                                    <br>
                                    <strong> Description: </strong> ${object.desription}
                                    <br> 
                                    <strong> Label:</strong> ${object.labeltext}
                                    <br>
                                    <strong> People involved: </strong> ${object.people[0].name}
                                    <br>
                                    <strong> Provenance: </strong> ${object.provenance}
                                    <br>
                                    <strong> Accession year: </strong> ${object.accessionyear}
                                    <br>
                                    <a href="${object.url}"> ${object.url} </a>
                                    <br>`;
            });
        });
}





