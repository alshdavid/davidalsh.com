function pushPage(pageName) {
    var aboutMePage = document.getElementById("aboutMe");
    var projectsPage = document.getElementById("portfolio");
    var mainNavAboutMe = document.getElementById("mainNavAboutMe");
    var mainNavPortfolio = document.getElementById("mainNavPortfolio");
    var smallNavAboutMe = document.getElementById("smallNavAboutMe");
    var smallNavPortfolio = document.getElementById("smallNavPortfolio");
    switch (pageName) {
        case "/about-me":
            aboutMePage.classList.add('show');
            mainNavAboutMe.classList.add('selected');
            smallNavAboutMe.classList.add('selected');
            projectsPage.classList.remove('show');
            mainNavPortfolio.classList.remove('selected');
            smallNavPortfolio.classList.remove('selected');
            break;
        case "/portfolio":
            aboutMePage.classList.remove('show');
            mainNavAboutMe.classList.remove('selected');
            smallNavAboutMe.classList.remove('selected');
            projectsPage.classList.add('show');
            mainNavPortfolio.classList.add('selected');
            smallNavPortfolio.classList.add('selected');
            break;
        case "/":
            aboutMePage.classList.remove('show');
            mainNavAboutMe.classList.remove('selected');
            smallNavAboutMe.classList.remove('selected');
            projectsPage.classList.add('show');
            mainNavPortfolio.classList.add('selected');
            smallNavPortfolio.classList.add('selected');
            break;
    }
}
var clickHandler = function () {
    var page = this.getAttribute("href") + ".html";
    event.preventDefault();
    pushPage(this.getAttribute("href"));
    window.history.pushState("object or string", "Title", page);
};
var anchors = document.querySelectorAll("a");
for (var i = 0; i < anchors.length; i++) {
    var current = anchors[i];
    current.addEventListener('click', clickHandler, false);
}
pushPage('/' + location.pathname.split("/")[location.pathname.split("/").length - 1].split(".")[0]);
console.log('/' + location.pathname.split("/")[location.pathname.split("/").length - 1].split(".")[0]);
//# sourceMappingURL=script.js.map