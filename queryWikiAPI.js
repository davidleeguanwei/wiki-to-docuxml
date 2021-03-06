/*
 * Handle wiki requests and API.
 *
 * It seems like if we request one page/request at a time, and don't request several pages/requests in parallel, then we should definitely be fine.
 * */

// wait for urls
// workers can only accept string.
onmessage = function(event) {
	// revert url array from string
	var urls = event.data.split(",");
	// loop through each url, query each page
	urls.forEach(query);
};

// forEach url, call postMessage to send result back
function query(url, index) {
	// http get
	var re = api_call(url);
	// return value
	if (re.status == 200)
		postMessage({"url": url, "status": true, "data": re.responseText});
	else
		postMessage({"url": url, "status": false, "data": re.statusText});
}

// get page content
function api_call(url) {
	/*
	 * See media wiki for more information.
	 * */
	var HTTPS = "https://";
	var wiki = get_wiki_url(url);
	var API = "/w/api.php?";
	var parameter = "action=query&format=json&prop=extracts%7Cinfo%7Ccategories&origin=*&titles=";
	var title = get_title_from_url(url);
	return http_get(HTTPS + wiki + API + parameter + title);
}

// make http requests
function http_get(url) {
	/*
	 * Reference: https://stackoverflow.com/questions/247483/http-get-request-in-javascript
	 * */
	console.log("get:" + url);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false); // synchronous, this code doesn't run on UI thread.
	xmlHttp.send(null);
	return xmlHttp;
}

// get title from url, assumes the last token is the title
function get_title_from_url(url) {
	var tmp = url.split("/");
	return tmp[tmp.length - 1];
}

// get wiki url. to support en or zh or other wiki sites.
function get_wiki_url(url) {
	var tmp = url.split("/");
	return tmp[2];
}
