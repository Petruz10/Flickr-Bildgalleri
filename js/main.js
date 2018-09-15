
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
var galleryPhotos =[];
var _this;

var galleryBtn;
var backSearchBtn; 
var prevBtn;
var nextBtn;

var pageNr;

function init()
{
    var searchBtns;
    var galleryBtns;

    formElem = document.getElementById("searchForm");
    flickrImgElem = document.getElementById("flickrImg");
    largeImgElem = document.getElementById("largeImg");
    
    searchInputElem = document.getElementById("searchInput");
    searchResultElem = document.getElementById("searchResult");
    bigPhotElem = document.getElementById("bigPhoto");
    photoGalleryElem = document.getElementById("photoGallery");
    photoGalleryPhotosElem = document.getElementById("photoGalleryPhotos");
    pageNrElem = document.getElementById("pageNr");

    galleryBtns = document.getElementsByClassName("galleryBtn");
    searchBtns = document.getElementsByClassName("backSearchBtn");

    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");

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

    prevBtn.disabled = true;
    prevBtn.style.cursor = "default";
    
    
    pageNr = 1;

}

function prevPage() {
	if (pageNr > 1) {
		pageNr--;
		requestNewImgs();
    }
    if(pageNr == 1 || pageNr < 1)
    {
        prevBtn.disabled = true;
        prevBtn.style.cursor = "default";
    }
    else
    {
        prevBtn.style.cursor = "pointer";
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

    searchInputElem.style.display = "block";
    searchResultElem.style.display = "none";
    bigPhotElem.style.display = "none";
    photoGalleryElem.style.display = "none";
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
	var request; // Object för Ajax-anropet
	//flickrImgElem.innerHTML = "<img src='pics/progress.gif' style='border:none;' >";
	pageNrElem.innerHTML = pageNr;
	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	request.open("GET","https://api.flickr.com/services/rest/?api_key=" + API_KEY + "&method=flickr.photos.search&tags=" + tags + "&per_page=60&page=" +pageNr + "&format=json&nojsoncallback=1",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) newImgs(request.responseText);
	};
} 

function newImgs(response) {
	var i;			// Loopvariabel
	var photo;		// Ett foto i svaret
    var imgUrl;		// Adress till en bild
    
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
    
    searchInputElem.style.display = "none";
    searchResultElem.style.display = "block";
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

    closeBtn =document.getElementById("closeBtn");
    closeBtn.addEventListener("click", showPhotoGallery);

    searchInputElem.style.display = "none";
    searchResultElem.style.display = "none";
    bigPhotElem.style.display = "block";
    photoGalleryElem.style.display = "none"; 

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
}

function addToPhotoGallery(photo)
{
    galleryPhotos.push(photo);
}

function deleteFromPhotoGallery(photo)
{
    galleryPhotos = galleryPhotos.reduce(function(currPhotoGal, currPhoto){
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

    for(var i=0; i<galleryPhotos.length; i++)
    {
        getGalleryPhotos(galleryPhotos[i]);
    }

    searchInputElem.style.display = "none";
    searchResultElem.style.display = "none";
    bigPhotElem.style.display = "none";
    photoGalleryElem.style.display = "block";
}

function getGalleryPhotos(photo)
{
    imgElem =  document.createElement("img");
    imgElem.setAttribute("src",photo);
    photoGalleryPhotosElem.appendChild(imgElem);
    imgElem.style.padding = "5px";

    imgElem.addEventListener("click", showLargeImg);
}

function removeGalleryPhotos()
{
  while (photoGalleryPhotosElem.firstChild) 
  {
      photoGalleryPhotosElem.removeChild(photoGalleryPhotosElem.firstChild);
    }
}
window.addEventListener("keydown", function(e){
    if(e.keyCode != 13) return;
    e.preventDefault();
    e.stopPropagation();
    formElem.searchBtn.click();
})
window.addEventListener("load", init);