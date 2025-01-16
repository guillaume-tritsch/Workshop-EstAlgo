var galleryIndex = 0;
var galleryItems = []
window.addEventListener("load", function () {
   galleryItems = document.getElementsByClassName("gallery-item");
   

   
  galleryItems[1].style.display = "none";
  galleryItems[2].style.display = "none";
  galleryItems[3].style.display = "none";

});

function displayNext() {
  galleryIndex = (galleryIndex + 1) % 4
  document.getElementById("palette-number").innerText = galleryIndex + 1;

    console.log(galleryIndex)
  galleryItems[0].style.display = "none";
  galleryItems[1].style.display = "none";
  galleryItems[2].style.display = "none";
  galleryItems[3].style.display = "none";

  galleryItems[galleryIndex].style.display = "block";
}

function displayPrevious() {
  galleryIndex = (galleryIndex - 1)
  if (galleryIndex < 0) galleryIndex = 3
  document.getElementById("palette-number").innerText = galleryIndex + 1;

  galleryItems[0].style.display = "none";
  galleryItems[1].style.display = "none";
  galleryItems[2].style.display = "none";
  galleryItems[3].style.display = "none";

  galleryItems[galleryIndex].style.display = "block";
}
