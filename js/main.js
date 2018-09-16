
/**
 * jag kommer att lägga upp API-nyckeln öppet på Github
 * så att ni kan ladda ner applikationen utan problem.
 * annars ska man aldrig lämna ut kodbas öppet med api-nycklar
 */
var API_KEY = "48a462518d46fee4c62640f416cc7f7f";

var searchInputElem;
var searchResultElem;
var bigPhotElem;
var photoGalleryElem;
var photoGalleryPhotosElem;
var pageNrElem;

var formElem;
var flickrImgElem;
var largeImgElem;
var tags;
var galleryPhotos;
var _this;

var galleryBtn;
var backSearchBtn; 
var prevBtn;
var nextBtn;

var pageNr;

function init()
{
    setElems();
    getLocalStorage();
    setHandlers();

    prevBtn.classList.add("disablePrevBtn");
    prevBtn.disabled = true;
    
    pageNr = 1;
}

function setHandlers()
{
    var searchBtns;
    var galleryBtns; 

    galleryBtns = document.getElementsByClassName("galleryBtn");
    searchBtns = document.getElementsByClassName("backSearchBtn");

    galleryBtn = [];
    for(var i = 0; i < galleryBtns.length; galleryBtn.push(galleryBtns[i++]));

    backSearchBtn = [];
    for(var i = 0; i < searchBtns.length; backSearchBtn.push(searchBtns[i++]));

    formElem.searchBtn.addEventListener("click",searchImg);

    galleryBtn.map(function( btn ) {
        btn.addEventListener("click", showPhotoGallery); 
    });
    backSearchBtn.map(function( btn ) {
        btn.addEventListener("click", showStartPage); 
    });

    prevBtn.addEventListener("click",prevPage);
    nextBtn.addEventListener("click",nextPage);
}

function getLocalStorage()
{
    if(typeof(Storage) !== "undefined") 
    {
        if (localStorage.savedGalleryPhotos) 
        {
            galleryPhotos = JSON.parse(localStorage.getItem("savedGalleryPhotos")); 
        }
        else
        {
            galleryPhotos = [];
        }
    }
}

function setElems()
{
    formElem = document.getElementById("searchForm");
    flickrImgElem = document.getElementById("flickrImg");
    largeImgElem = document.getElementById("largeImg");
    
    searchInputElem = document.getElementById("searchInput");
    searchResultElem = document.getElementById("searchResult");
    bigPhotElem = document.getElementById("bigPhoto");
    photoGalleryElem = document.getElementById("photoGallery");
    photoGalleryPhotosElem = document.getElementById("photoGalleryPhotos");
    pageNrElem = document.getElementById("pageNr");

    

    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");
}

function prevPage() {
	if (pageNr > 1) {
		pageNr--;
		requestNewImgs();
    }
    if(pageNr == 1 || pageNr < 1)
    {
        prevBtn.disabled = true;
        prevBtn.classList.add("disablePrevBtn");
    }
    else
    {
        prevBtn.classList.add("ablePrevBtn");
    }
} 

function nextPage() {
    prevBtn.disabled = false;
	pageNr++;
	requestNewImgs();
}

function showStartPage()
{
    removeGalleryPhotos();

    if(searchInputElem.classList.contains("disableDisplay")) searchInputElem.classList.remove("disableDisplay");
    searchInputElem.classList.add("showDisplay");

    if(searchResultElem.classList.contains("showDisplay")) searchResultElem.classList.remove("showDisplay");
    searchResultElem.classList.add("disableDisplay");

    if(bigPhotElem.classList.contains("showDisplay")) bigPhotElem.classList.remove("showDisplay");
    bigPhotElem.classList.add("disableDisplay");

    if(photoGalleryElem.classList.contains("showDisplay")) photoGalleryElem.classList.remove("showDisplay");
    photoGalleryElem.classList.add("disableDisplay");
}

function searchImg()
{
    if(formElem.tags.value == "") return;
    
    tags ="";
    tags = formElem.tags.value;
    document.getElementById("resultTags").innerHTML = "Visar resultat för: " +tags;
    pageNr = 1;
    
    if(pageNr == 1 || pageNr < 1)
    {
        prevBtn.disabled = true;
    }
	requestNewImgs();
}

function requestNewImgs() 
{
	var request; 
	pageNrElem.innerHTML = pageNr;
    if (XMLHttpRequest) 
    { 
        request = new XMLHttpRequest(); 
    } 
    else if (ActiveXObject) 
    { 
        request = new ActiveXObject("Microsoft.XMLHTTP"); 
    }
    else 
    {
         alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; 
    }

	request.open("GET","https://api.flickr.com/services/rest/?api_key=" + API_KEY + "&method=flickr.photos.search&tags=" + tags + "&per_page=60&page=" +pageNr + "&format=json&nojsoncallback=1",true);
	request.send(null); 
    request.onreadystatechange = function () 
    { 
		if ( (request.readyState == 4) && (request.status == 200) ) newImgs(request.responseText);
	};
} 

function newImgs(response) {
	var i;			
	var photo;		
    var imgUrl;		
    
	response = JSON.parse(response);
    flickrImgElem.innerHTML = "";		
    
    for (i=0; i < response.photos.photo.length; i++) 
    {
		photo = response.photos.photo[i];
		imgUrl = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_s.jpg";
		newElem = document.createElement("img");
		newElem.setAttribute("src",imgUrl);
		newElem.setAttribute("data-photo",JSON.stringify(photo));
        newElem.addEventListener("click", changePhotoGallery);
        newElem.style.padding = "5px";
		flickrImgElem.appendChild(newElem);
    }
    
    if(searchInputElem.classList.contains("showDisplay")) searchInputElem.classList.remove("showDisplay");
    searchInputElem.classList.add("disableDisplay");

    if(searchResultElem.classList.contains("disableDisplay")) searchResultElem.classList.remove("disableDisplay");
    searchResultElem.classList.add("showDisplay");
}

function getPhoto()
{
    var photo;		
	var imgUrl;		
   
    photo = JSON.parse(_this.getAttribute("data-photo"));
    imgUrl = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_s.jpg";

    return imgUrl;
}

function showLargeImg()
{
    _this = this;
    var newstr; 
    var closeBtn;

    closeBtn = document.getElementById("closeBtn");
    closeBtn.addEventListener("click", showPhotoGallery);

    if(searchInputElem.classList.contains("showDisplay")) searchInputElem.classList.remove("showDisplay");
    searchInputElem.classList.add("disableDisplay");

    if(searchResultElem.classList.contains("showDisplay")) searchResultElem.classList.remove("showDisplay");
    searchResultElem.classList.add("disableDisplay");

    if(bigPhotElem.classList.contains("disableDisplay")) bigPhotElem.classList.remove("disableDisplay");
    bigPhotElem.classList.add("showDisplay")

    if(photoGalleryElem.classList.contains("showDisplay")) photoGalleryElem.classList.remove("showDisplay");
    photoGalleryElem.classList.add("disableDisplay");

    newstr = this.src.replace("_s.jpg", "_z.jpg");
    largeImgElem.src = newstr;

    removeGalleryPhotos();
}


function changePhotoGallery()
{ 
    _this = this;
    var photo = getPhoto();

    if(this.classList.contains("checkedPhoto"))
    {
        _this.classList.remove("checkedPhoto");
        deleteFromPhotoGallery(photo);
    }
    else
    {
        _this.classList.add("checkedPhoto");
        addToPhotoGallery(photo);
    }

    localStorage.setItem("savedGalleryPhotos", JSON.stringify(galleryPhotos));
}

function addToPhotoGallery(photo)
{
    galleryPhotos.push(photo);
}

function deleteFromPhotoGallery(photo)
{
    galleryPhotos = galleryPhotos.reduce(function(currPhotoGal, currPhoto)
    {
        if(currPhoto != photo) 
        {
            currPhotoGal.push(currPhoto);  
        }
        return currPhotoGal;
    },[]);
}

function showPhotoGallery()
{
    photos = galleryPhotos;
    var photosP;

    if(!galleryPhotos || galleryPhotos.length <= 0)
    {
        pElem = document.createElement("p");
        pElem.innerHTML = "Du har inga bilder i galleriet";
        pElem.setAttribute("id", "NoPhotosp");
        photoGalleryElem.appendChild(pElem);
    }
    else
    {
        photosP = document.getElementById("NoPhotosp");
        if(photosP) photosP.innerHTML ="";
        for(var i=0; i<galleryPhotos.length; i++)
        {
            getGalleryPhotos(galleryPhotos[i]);
        }
    }

    if(searchInputElem.classList.contains("showDisplay")) searchInputElem.classList.remove("showDisplay");
    searchInputElem.classList.add("disableDisplay");

    if(searchResultElem.classList.contains("showDisplay")) searchResultElem.classList.remove("showDisplay");
    searchResultElem.classList.add("disableDisplay");

    if(bigPhotElem.classList.contains("showDisplay")) bigPhotElem.classList.remove("showDisplay");
    bigPhotElem.classList.add("disableDisplay");

    if(photoGalleryElem.classList.contains("disableDisplay")) photoGalleryElem.classList.remove("disableDisplay");
    photoGalleryElem.classList.add("showDisplay");
}

function getGalleryPhotos(photo)
{
    var imgElem;
    var btn;
    var divElem;

    divElem = document.createElement("div");
    divElem.classList.add("photoGalleryPhoto");
    photoGalleryPhotosElem.appendChild(divElem);

    imgElem =  document.createElement("img");
    imgElem.setAttribute("src",photo);
    divElem.appendChild(imgElem);

    imgElem.style.padding = "5px";

    btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("id", photo);
    btn.innerHTML = "Radera bild";
    divElem.appendChild(btn);

    imgElem.addEventListener("click", showLargeImg);
    btn.addEventListener("click", deleteFromPhotoGalleryBtn);
}

function deleteFromPhotoGalleryBtn(e)
{ 
    deleteFromPhotoGallery(this.id);
    removeGalleryPhotos();
    showPhotoGallery();
}

function removeGalleryPhotos()
{
    while (photoGalleryPhotosElem.firstChild) 
    {
        photoGalleryPhotosElem.removeChild(photoGalleryPhotosElem.firstChild);
    }

    localStorage.setItem("savedGalleryPhotos", JSON.stringify(galleryPhotos));
}

window.addEventListener("keydown", function(e){
    if(e.keyCode != 13) return;
    e.preventDefault();
    e.stopPropagation();
    formElem.searchBtn.click();
});

window.addEventListener("load", init);