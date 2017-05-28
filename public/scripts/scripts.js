$(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});

const data = [
    {
        "name": "Marshall Installs",
        "subtitle": "Delivery and Installation Specialists",
        "thumb": "/assets/projects/marshallinstalls/image.jpg",
        "feature": {
            "type": "image",
            "href": "/assets/projects/marshallinstalls/feature.jpg"
        },
        "technologies": [
            "angular",
            "typescript",
            "node",
            "express",
            "javascript",
            "mongo",
            "scss",
            "html"
        ],
        "type": [
            "website",
            "app"
        ],
        "description": " <p> This is a progressive web app created for Marshall Installs in collaboration with Harvey Norman. </p><br><p> The software is aimed at being an administration system to help internal staff members manage bookings and deliveries. </p> <br> <p> The system also allows customers to track items through an external system attached to the website via a public API. </p> <br><br> <h3> Features: </h3>  <ul> <li>Responsive</li><li>Restful API</li><li>Progressive Web App</li> <li>CSS animations.</li> <li>JavaScript Animations.</li> </ul> <br><br> <h3> Technologies: </h3>  <ul><li>Angular 4+</li><li>Node.js</li><li>Webpack, Babel, ES6 Import</li><li>Express.js</li><li>SCSS</li><li>Typescript</li> </ul>",
        "colors": {
            "text": "#fff",
            "brand": [
                "#cbed00"
            ]
        }
    },
    {
        "name": "Manor Homes",
        "subtitle": "Construction Managment Company",
        "thumb": "/assets/projects/manorbuild/image.jpg",
        "feature": {
            "type": "video",
            "href": "/assets/projects/manorbuild/feature.mp4"
        },
        "technologies": [
            "wordpress",
            "jquery",
            "javascript",
            "php",
            "scss",
            "html"
        ],
        "type": [
            "website"
        ],
        "description": "<p>The purpose of this site is to provide a listings service for a company that designs and constructs properties. <br><br> The user is able to add listings, providing a description, image gallery, prices and details. The front page is dynamically populated with the listings added in the back end. <br><br> The banner slider is manually chosen, however the items below are taken from the database and link to an item. There is a listings page with a search and filter feature which works asynchronously. <br><br> The example above is limited to just the front page, as the customer is populating the back end. </p> <br><br> <h3>Features</h3>  <ul> <li>Home Page</li> <li>Home Page Slider</li> <li>Property Listings</li> </ul> <br><br> <h3>Technologies</h3> <ul> <li>HTML/SCSS/JS/TS</li> <li>WordPress</li> </ul>",
        "colors": {
            "text": "#fff",
            "brand": [
                "#ee2e2e"
            ]
        }
    },
    {
        "name": "Textile Recycle Center",
        "subtitle": "Collection and Delivery Managment App",
        "thumb": "/assets/projects/trc/image.png",
        "feature": {
            "type": "video",
            "href": "/assets/projects/trc/feature.mp4"
        },
        "technologies": [
            "angular",
            "phonegap",
            "typescript",
            "scss",
            "html"
        ],
        "type": [
            "app"
        ],
        "description": " After some time, BrownPaperBag felt that I demonstrated a level of aptitude which made it appropriate to give me creative freedom over a project. <br><br> To summerise, the purpose of the application was to provide a platform where by the drivers of the Textile Recycling Centre would be able to manage their field duties digitally - including chat and vehicle stop managment. <br><br> First I received the design briefing, after which I liaised with the team members and began consultation on the technical architecture of the project. The project was entirely API based, using both RESTful and Websocket technologies. <br><br> I began by creating the application’s documentation wiki on BrownPaperBag’s private project wiki. Mapped out the API’s endpoints and created the interface for the websocket chat. At the time, I had a basic understanding of Angular 2. I had spent more time with Angular 1 in the past so it was easier for me to wrap my head around the concepts in Angular 2. I pushed forward using it as the front-end framework for the application. <br><br> As the project grew in size I kept detailed documentation on everything from the folder structure to the application’s build process. <br><br> The application was built natively using PhoneGap build, leveraging “OneSignal’s” push notification API for the native application and service worker. <br><br> At the end of the project, the client was blown away with it’s performance and the team congratulated me on it’s success. </p> <br><br> <h3>Features</h3> <br> <ul> <li>Chat (Text and Photos)</li> <li>Photos</li> <li>GPS</li> <li>Authorisation</li> <li>Custom Design</li> </ul> <br><br> <h3>Technologies</h3> <br> <ul> <li>Angular 2</li> <li>PhoneGap Build</li> <li>Cordova</li> <li>Socket.io</li> <li>Node.js</li> <li>PHP Larvel</li> </ul> ",
        "colors": {
            "text": "#fff",
            "brand": [
                "#84bc46"
            ]
        }
    },
    {
        "name": "BDG Architects",
        "subtitle": "Auckland Based Architecture Company",
        "thumb": "/assets/projects/bdg/image.jpg",
        "feature": {
            "type": "video",
            "href": "/assets/projects/bdg/feature.mp4"
        },
        "type": [
            "website"
        ],
        "technologies": [
            "larvel",
            "jquery",
            "javascript",
            "php",
            "scss",
            "html"
        ],
        "description": " <p> BDG Architects is a company that specialises in providing architectural designs commercially. <br><br> They were looking for a website that allowed them to advertise their portfolio in a way that was unique and animated. <br><br> The challenge in this site was the unique design language, animations, layout of the homepage and masonry grid gallery. <br><br> It’s currently not complete, but still an enjoyable experience. </p> <br><br> <h3>Features:</h3> <br> <ul> <li>Responsive</li> <li>Homepage slider</li> <li>Masonry Gallery</li> <li>CSS Animations</li> <li>JavaScript Animations.</li> <li></li> </ul> <br><br> <h3>Technologies:</h3> <br> <ul> <li>HTML5</li> <li>SCSS</li> <li>JavaScript</li> <li>JQuery</li> <li>Laravel</li> </ul>",
        "colors": {
            "text": "#fff",
            "brand": [
                "#333"
            ]
        }
    },
    {
        "name": "BrownPaperBag",
        "subtitle": "Previous Employer",
        "thumb": "/assets/projects/brownpaperbag/image.jpg",
        "feature": {
            "type": "image",
            "href": "/assets/projects/brownpaperbag/feature.jpg"
        },
        "type": [
            "other"
        ],
        "technologies": [
            "larvel",
            "angular",
            "wordpress",
            "jquery",
            "javascript",
            "typescript",
            "php",
            "scss",
            "html"
        ],
        "description": " <p> I began my employment with BrownPaperBag in late July 2016 as a junior front end developer. I was responsible for constructing website front-ends from designs provided to me by the design team, building them into their custom content management system. <br><br> Essentially, I was translating the designer's vision into a product that the back-end team could make dynamic. <br><br> The back-end was using PHP + the Laravel framework. <br><br> I applied myself diligently and my skills developed rapidly. Initially I was responsible for just HTML/CSS, however that quickly evolved to incorporating complex JavaScript and eventually leading a team in the development of a progressive web app (PWA) built in Angular2. <br><br> Between the Friday barbeques and the late nights, BrownPaperBag threw me into an intense rollercoaster of learning and laughs. The developers I worked with were incredible people, both professionally and as friends. Having gone through the trenches with them, I feel a great deal of respect for their capacity and an even greater pride for the incredible team work. <br><br> I look forward to many more beers, barbeques and late nights with the squad. </p> <br><br> <h3>Responsibilities:</h3> <br> <ul> <li>HTML/SCSS</li> <li>PHP/Laravel</li> <li>WordPress</li> <li>Angular</li> <li>Banter</li> </ul>",
        "colors": {
            "text": "#fff",
            "brand": [
                "#B6936B"
            ]
        }
    }
]

const techIcons = {
    getPin: pin => techIcons[pin] ? ('<img class="pin" src="' + techIcons[pin] + '"/>') : "",
    wordpress: 'http://simpleicon.com/wp-content/uploads/wordpress.svg',
    larvel: 'http://go-labs.net/wp-content/themes/golabs/css/template/images/laravel.png',
    angular: 'https://cdn.worldvectorlogo.com/logos/angular-icon-1.svg',
    html: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1000px-HTML5_logo_and_wordmark.svg.png',
    php: 'http://freevector.co/wp-content/uploads/2010/10/php-1.png',
    scss: 'https://cdn.worldvectorlogo.com/logos/node-sass.svg',
    javascript: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/2000px-Unofficial_JavaScript_logo_2.svg.png',
    typescript: 'https://s3-us-west-2.amazonaws.com/svgporn.com/logos/typescript-icon.svg',
    jquery: 'http://www.webdesigncolors.com/jquery.gif',
    phonegap: 'https://onesignal.com/assets/common/platform-icons/cordova-9b984d676cd2d8d0278ded3834e741e12a1cb7eda6776cc897c125e817e85dab.svg',
    node: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Node.js_logo_2015.svg/2000px-Node.js_logo_2015.svg.png',
    express: 'https://coligo.io/images/express.svg',
    mongo: 'https://bajcmartinez.com/assets/icons/mongodb/mongodb-original-wordmark.svg'
}

window.openProject = projectName => {
    const sidePanel = document.getElementById("project-drawer")

    if (sidePanel.attributes['data-open']['value'] == "true") {
        sidePanel.attributes['data-open']['value'] = false
        sidePanel.classList.remove('open')
        window.setTimeout(_ => sidePanel.innerHTML = `` , 1000)
    } else {
        const project = data.find(x => x.name == projectName)
        sidePanel.style.backgroundColor = project.colors.brand
        sidePanel.style.color = project.colors.text

        sidePanel.attributes['data-open']['value'] = true
        sidePanel.classList.add('open')

        window.setTimeout(_ => {

            sidePanel.innerHTML = `
                <div class="main-body">
                    <div class="title">
                        <div class="">
                            <div class="exit" onclick="openProject()">CLOSE</div>
                            <h1>` + project.name + `<span>` + project.subtitle + `</span></h1>
                        </div>
                    </div>
                    <div class="hero">
                        <div class="content-wrapper" id="feature-outlet"></div>
                    </div>
                    <div class="content-wrapper text-body">
                        <article>
                            <h3>Details</h3>
                            ` + project.description + `
                        </article>
                    </div>
                </div>
                <div class="tags">
                    <div class="">
                        <div id="tags-outlet"></div>
                    </div>
                </div>
            `

            if (project.feature.type == 'video') {
                document.getElementById('feature-outlet').innerHTML = `
                    <video class="feature" autoplay="" loop="" autobuffer="" muted="" poster="` + project.thumb + `">
                        <source src="` + project.feature.href + `" type="video/mp4">
                    </video>
                `
            }

            if (project.feature.type == 'image') {
                document.getElementById('feature-outlet').innerHTML = `
                    <div class="feature-image" style="background-image: url('` + project.feature.href + `')"/>
                `
            }

            let pins = ""
            project['technologies'].forEach(tech => pins = pins + techIcons.getPin(tech))

            document.getElementById("tags-outlet").innerHTML = pins 

        }, 1000)       
    }
}