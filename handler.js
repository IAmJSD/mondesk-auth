// Detect any URL params and handle them.
var params = new URLSearchParams(window.location.search);
if (params.get("code") && params.get("state")) {
    // Blank the webpage.
    document.body.innerHTML = "";

    // Check the state.
    if (params.get("state") !== localStorage.getItem("state")) {
        document.body.innerHTML = "<h1 class=\"title is-1\">Invalid State</h1>\n<p>Your state token is invalid.</p>";
    }

    // Get the API token.
    var url = "https://api.monzo.com/oauth2/token";
    var body = "grant_type=authorization_code&client_id=" + encodeURIComponent(localStorage.getItem("clientId")) + "&client_secret=" + encodeURIComponent(localStorage.getItem("clientSecret")) + "&redirect_uri=" + encodeURIComponent("https://mondesk-auth.jakegealer.me/") + "&code=" + encodeURIComponent(params.get("code"));
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 200) {
            const json = JSON.parse(xhr.responseText);
            document.body.innerHTML = "<h1 class=\"title is-1\">API Token</h1>\n<p>Your API token is below. Make sure to accept the notification on your phone before using!</p><br><code style=\"word-wrap: break-word;\">\n" + json.access_token + "\n</code>";
            localStorage.removeItem("clientId");
            localStorage.removeItem("clientSecret");
            localStorage.removeItem("state");
        } else {
            const json = JSON.parse(xhr.responseText);
            document.body.innerHTML = "<h1 class=\"title is-1\">Request Failure</h1>\n<p>" + json.error_description + "</p>";
        }
    };
    xhr.onerror = function() {
        document.body.innerHTML = "<h1 class=\"title is-1\">Network Error</h1>\n<p>The request could not be made.</p>";
    };
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(body);
}

// Handles continuing in the webapp.
function handleContinue() {
    var clientId = document.getElementById("client_id").value;
    var clientSecret = document.getElementById("client_secret").value;
    var state = Math.random().toString(36).substring(7);
    localStorage.setItem("clientId", clientId);
    localStorage.setItem("clientSecret", clientSecret);
    localStorage.setItem("state", state);
    window.location.replace("https://auth.monzo.com/?client_id=" +  encodeURIComponent(clientId) + "&redirect_uri=" + encodeURIComponent("https://mondesk-auth.jakegealer.me/") + "&response_type=code&state=" + encodeURIComponent(state));
}
