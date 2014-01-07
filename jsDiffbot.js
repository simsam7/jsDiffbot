jsDiffbot = {
    //  Create Ajax object, this code could be made a lot more complex/complete, 
    //  but this should suffice for now and it's nice and compact. 
    getAjax: function () {
        var http = false;
        //Use IE's ActiveX items to load the file.
        if (typeof ActiveXObject != 'undefined') {
            try {
                http = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    http = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (E) {
                    http = false;
                }
            }
            //If ActiveX is not available, use the XMLHttpRequest of Firefox etc. to load the document.
        } else if (window.XMLHttpRequest) {
            try {
                http = new XMLHttpRequest();
            } catch (e) {
                http = false;
            }
        }
        return http;
    },

    //	token: your developer token from Diffbot.com
    //  api: the Diffbot api you want to use e.g. article, product, image, 
    //       frontpage, not sure if any of the others will work with this
    //  url: the url you want to grab
    //  callback: function(data) will do just fine
    //  full example call: jsDiffbot.get('a7122e73c5c2c76118f4234c85ff5f2e', 'frontpage', 'http://www.huffingtonpost.com/', 'format=json', function(data) {
    
    get: function (token, api, url, args, callback) {
        var http = this.init(); //Init every time to defeat Cache problem in IE
        if (!http || !url) return;
        if (http.overrideMimeType) http.overrideMimeType('text/xml'); //setting it to text by default

        token = '&token=' + token;
        url = encodeURI(url); //just in case

        //Get rid of the cache problem in IE
        var  nocache  = '&nocache=' + Math.random() * 1000000;
        url += (url.indexOf("?") + 1) ? "&" : "?";
        url += nocache;

        //  I've taken the approach to code this in here and switch it out to the older format where necessary
        //  that way you don't have to figure out which one to use and should be easy enough to update in here when things change
        var baseURL = 'http://api.diffbot.com/v2/'; 

        var reg = /article|product|image|/ig;
        var regresult = reg.exec(api);
        if (!regresult) {
            baseURL = 'http://www.diffbot.com/api/'; //swap out to older api if the request does not match one of these
        }

        http.open("GET", baseURL + api + '?url=' + url + '&fields=' + args + token, true);

        http.onreadystatechange = function () { //Call a function when the state changes.
            if (http.readyState == 4) { //  Ready State will be 4 when the document is loaded.
                if (http.status == 200) {
                    var result = "";
                    if (http.responseText) {
                        result = http.responseText;
                        result = JSON.parse(result); //  Parsing it by default
                    }

                    //  Give the data to the callback function.
                    if (callback) callback(result);
                } else { //  An error occured
                    if (error) error(http.status);
                }
            }
        }
        http.send(null);
    },
    init: function () {
        return this.getAjax();
    }
}