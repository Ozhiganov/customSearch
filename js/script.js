"use strict";

window.onload = function () {
    var searchBtn   = document.getElementById("searchBtn"),
        searchInput = document.getElementById("searchInput"),
        nextPage = document.getElementById("nextPage"),
        prevPage = document.getElementById("prevPage"),
        requestImg = new Request();

    searchInput.addEventListener("keypress", function(e){
        keypressInBox(e,requestImg);
    });

    searchBtn.addEventListener("click", function(){
        searchBtnHandler(requestImg);
    });

    nextPage.addEventListener("click", function () {
        requestImg.nextPage();
    });

    prevPage.addEventListener("click", function () {
        requestImg.prevPage();
    });

};

/**
 * Handle ENTER button while input focused
 * @param e event
 * @param input object
 */
function keypressInBox (e, input) {
    var code        = (e.keyCode ? e.keyCode : e.which),
        searchValue = document.getElementById("searchInput").value,
        images      = document.getElementById("imageCheck").checked;

    if (code !== 13 || searchValue.length === 0) { //Enter keycode
        return;
    }

    e.preventDefault();
    input.searchingItem = searchValue;
    input.startIndex    = 1;
    input.image         = images;
    input.getRequest();
}

/**
 * Handler for button on click
 * @param input object
 */
function searchBtnHandler (input) {
    var searchValue = document.getElementById("searchInput").value,
        images      = document.getElementById("imageCheck").checked;

    if (searchValue.length === 0) {
        return;
    }

    input.searchingItem = searchValue;
    input.startIndex    = 1;
    input.image         = images;
    input.getRequest();
}
