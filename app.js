var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    request = require('request'),
    cheerio = require('cheerio'),
    app = express(),
    bodyParser = require('body-parser'),
    env  = process.env;

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));

//tell express that we want to use the www folder for our static assets
app.use(express.static(path.join(__dirname, 'www')));

app.post('/scrape', function(req, res){
    res.setHeader('Content-Type', 'application/json');

    //make a new request to the URL provided in the HTTP POST request
    request(req.body.url, function (error, response, responseHtml) {
        console.log(`response is ${response}`)
        var resObj = {};
        var toggleClass = '.grey'


        var array_1 = []
        var arr_s = [".grey_bar", ".light_bar"]

        //if there was an error
        if (error) {
            res.end(JSON.stringify({error: 'There was an error of some kind'}));
            return;
        }

        //create the cheerio object
        resObj = {},
            //set a reference to the document that came back
            $ = cheerio.load(responseHtml),
            
            //console.log('this is', typeof $('.light_bar > td > a'))
            //console.log(`to je bre ovo ${ $(`${toggleClass}_bar > td > a`).length }`)
            

              arr_s.map(function(i, elem) { 
                //console.log(i, elem)
                //console.log('so each of two class:', Object.entries( $(`${i} > td > a`)) )
                array_1.push(Object.entries( $(`${i} > td > a`)))

                Object.entries( $(`${i} > td > a`)).map((el, ind) => {
                
                    console.log("sta je ovo", el[1].attribs)
                    
                })
               // array_1[i] = {
                   //  a: $(this).find("td").find('a')
                // };
              });

             // console.log(array_1.length)
              //console.log('array1', array_1)

            var storeResult1 = Object.entries( $(`.grey_bar > td > a`)      )  
            storeResult1.map((el, ind) => {
                
                //console.log("sta je ovo", el[1].attribs)
                //$Format = el[1].attribs.title.slice(0, el[1].attribs.title.indexOf('d'))
                //$HrefLink = el[1].attribs.href
            })

            //console.log("ENTRIES OBJECTS ARE:", Object.entries(   $('.light_bar > td > a')  )[0]   )

            //create a reference to the meta elements
            $title = $('head title').text(),
            $desc = $('meta[name="description"]').attr('content'),
            $kwd = $('meta[name="keywords"]').attr('content'),
            $ogTitle = $('meta[property="og:title"]').attr('content'),
            $ogImage = $('meta[property="og:image"]').attr('content'),
            $ogkeywords = $('meta[property="og:keywords"]').attr('content'),
            $images = $('img');


           // $format = 
            //$FileFormatName: 

        if ($Format) {
            resObj.format = $Format;
        }

        if ($title) {
            resObj.title = $title;
        }

        if ($desc) {
            resObj.description = $desc;
        }

        if ($kwd) {
            resObj.keywords = $kwd;
        }

        if ($ogImage && $ogImage.length){
            resObj.ogImage = $ogImage;
        }

        if ($ogTitle && $ogTitle.length){
            resObj.ogTitle = $ogTitle;
        }

        if ($ogkeywords && $ogkeywords.length){
            resObj.ogkeywords = $ogkeywords;
        }

        if ($images && $images.length){
            resObj.images = [];

            for (var i = 0; i < $images.length; i++) {
                resObj.images.push($($images[i]).attr('src'));
            }
        }

        //send the response
        res.end(JSON.stringify(resObj));
    }) ;
});

//listen for an HTTP request
app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost');

//just so we know the server is running
console.log('Navigate your brower to: http://localhost:3000');
