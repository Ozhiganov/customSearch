/**
 * Creates Request object
 * @param {string} searchingItem
 * @param {boolean} image
 * @param {number} startIndex
 * @constructor
 */
function Request (searchingItem, image, startIndex) {
    this.searchingItem = typeof(startIndex) === "undefined" ? "" : searchingItem;
    this.startIndex    = typeof(startIndex) === "undefined" ? 1 : startIndex;
    this.image         = typeof(startIndex) === "undefined" ? false : image;
}

/**
 * Request for next page with same parameters
 */
Request.prototype.nextPage = function () {
    this.startIndex += 10;
    this.getRequest();
};

/**
 * Request for previous page with same parameters
 */
Request.prototype.prevPage = function () {
    if((this.startIndex - 10) < 1){
        return;
    }
    this.startIndex = this.startIndex - 10;
    this.getRequest();
};

/**
 * Request for Google server
 */
Request.prototype.getRequest = function () {
    var xhr                 = new XMLHttpRequest();
    var createContentBinded = createContent.bind(this);

    xhr.open("GET", setSearchQuery(this.searchingItem, this.image, this.startIndex));
    xhr.onload             = function () {
        if (xhr.status !== 200) {
            alert("Request failed.  Returned status of " + xhr.status);
        }
    };
    xhr.onreadystatechange = function () {
        createContentBinded(xhr);
    };
    xhr.send();

    /**
     * Creates searching query
     * @param query {string} search term
     * @param images {boolean} image containing
     * @param start {number} start with index
     * @return {string}
     */
    function setSearchQuery (query, images, start) {
        var key = " AIzaSyCzRr8_TBJpFGxYhUKAfGFSX2Rows0pCIc",
            cx  = "007248899382391081090:nlikcseoleo";

        return "https://www.googleapis.com/customsearch/v1?q=" + query + "&cx=" + cx + "&key=" + key +
            (images ? "&searchType=image" : "") + "&start=" + start;
    }

    /**
     * Creates content depending on containing images
     * @param response {string} HTMLText
     */
    function createContent (response) {
        var i,
            respondObj,
            itemsLength = 10,
            paginator = document.getElementById("paginator"),
            imgPlace    = document.getElementById("outputGrid"),
            sitePlace   = document.getElementById("outputList");

        paginator.classList.add("active");
        respondObj      = parseToJson(response);
        if (this.image) {
            imgPlace.innerHTML = "";
            sitePlace.parentNode.classList.remove("active");
            imgPlace.parentNode.classList.add("active");
            for (i = 0; i < itemsLength; i += 1) {
                addImage(respondObj, i);
            }
        } else {
            sitePlace.innerHTML = "";
            imgPlace.parentNode.classList.remove("active");
            sitePlace.parentNode.classList.add("active");
            for (i = 0; i < itemsLength; i += 1) {
                addPage(respondObj, i);
            }
        }
    }

    /**
     * Adds LI elements containing image and appends it to PLACE
     * @param input {object}
     * @param i {number} iteration
     */
    function addImage (input, i) {
        var address,
            listItem,
            thumbnailUrl,
            place = document.getElementById("outputGrid");

        address      = input.items[i].link;
        thumbnailUrl = input.items[i].image.thumbnailLink;

        listItem = "<li class='grid__item' style='background-image: url(" + thumbnailUrl + ");'>" +
            "<a href='" + address + "' class='grid__link'></a>" +
            "</li>";

        place.innerHTML = place.innerHTML + listItem;
    }

    /**
     * Adds LI elements containing web page content and appends it to PLACE
     * @param input {object}
     * @param i {number} iteration
     */
    function addPage (input, i) {
        var title,
            address,
            linkText,
            snippetText,
            listItem,
            place = document.getElementById("outputList");

        title       = input.items[i].title;
        address     = input.items[i].link;
        linkText    = input.items[i].displayLink;
        snippetText = input.items[i].snippet;

        listItem = "<li class='list__item'>" +
            "<a href='" + address + "'>" +
            "<h3 class='list__heading'>" + title + "</h3>" +
            "<p>" + snippetText + "</p>" +
            "<span class='list__address'>" + linkText + "</span>" +
            "</a>" +
            "</li>";

        place.innerHTML = place.innerHTML + listItem;
    }

    /**
     * Parse HTMLText to JSON
     * @param input {object} HTMLText
     */
    function parseToJson (input) {
        if (input.readyState === 4 && input.status === 200) {
            return JSON.parse(input.responseText);
        }
    }
};
