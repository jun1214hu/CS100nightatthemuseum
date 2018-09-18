const API_KEY = "8d33e1b0-b77e-11e8-bf0e-e9322ccde4db";

document.addEventListener("DOMContentLoaded", () => {
    const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
    var hash = location.hash

    if (hash && hash === 'ITERATE OVER EXISTING HASHES') {
        window.location = "THE URL THAT MATCHES THAT HASH"
    }
    else {
        showGalleries(url);
    }



});

// Every time the URL changes, save that URL as a hash with that address
window.onhashchange = () => {
        // if there's a URL then change to that API address
    if (window.location.hash) {
        let firstHash = window.location.hash.slice(1);
    // go to that API address and display whatever
    }

    // if there isn't hash then add one?
}
        window.location.hash.slice(1);
// URL change function
function urlChange(hash)
{
    console.log(hash);

    if (!hash.indexOf('.') > -1)
    {
        showObjectsTable(hash);
    }
}

function goBackToGallery() {
    document.querySelector("#all-objects").style.display = "none";
    document.querySelector("#all-galleries").style.display = "block";
    document.querySelector("#single-object").style.display = "none";
}

function goBackToObject() {
    document.querySelector("#all-objects").style.display = "block";
    document.querySelector("#all-galleries").style.display = "none";
    document.querySelector("#single-object").style.display = "none";
}

function showGalleries(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.records.forEach(gallery => {

                // x += x.assign(location.hash);

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

        });
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
    fetch(obj_url)
        .then(objResponse => objResponse.json())
        .then(objData => {
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
        });
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




