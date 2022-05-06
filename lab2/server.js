const express = require('express');
const app = express()
const https = require('https')
app.set('view engine', 'ejs');


app.listen(5000, function (err) {
    if (err)
        console.log(err);
})

// app.get('/', function (req, res) {
//     res.send('GET request to homepage')
// })

app.use(express.static('./public'));

app.get('/search', function (req, res) {
    res.sendFile(__dirname + "/public/search.html")
})


app.get('/profile/:id', function (req, res) {
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

    //https 모듈
    //client(browser) talks to this server(server.js).
    // and then this https module talks to another server(pokemon API)
    //https: node.js code.. not browser.. can't make ajax rq from this code. VS you can make ajax rq only from browsers
        
     https.get(url, function (https_res) { //2번쨰 인자. fn callback: executed when I recieved response from this server.
        //https_res라 한 이유는 라인 23의 res와 구별하고자)
        data = '';
        https_res.on("data", function (chunk) {
            console.log(chunk);
            // console.log(JSON.parse(chunk)); 이게 뻑나는 이유는 pokeAPI가 한번에 json object를 한번에 안 쏘고 chunk 단위로 끊어 쏘나 봄.. 클라보고 collect them together 하라고
            data += chunk
        })
        //https 모듈의 또 다른 event 소개함. <<end event>>. mark the end of that chunk.
        https_res.on('end', function () { //end of receiving data. whenever I stop receiving this chunk, I'll parse that merged data and print.
            // console.log(data)
            data = JSON.parse(data)
            //data.stats = array
            hp_ = data.stats.filter((obj_) => {
                return obj_.stat.name == "hp"
            }).map((k) => {
                return k.base_stat
            });
            console.log(hp_)
            res.render("profile.ejs", { //sent whole/complete html file. sendfile이랑 같아 ㅋㅋ 근데 html 뿐 아니라 variable을 그 html에 패스해줄 수 있다는 게 차이점. ejs 확장자여야 함. app.set(라인3 import도 해줘야)
                "id": req.params.id,
                "name": data.name,
                "img_path": data.sprites.other["official-artwork"].front_default,
                "hp": hp_,
                "height": 1,
                "weight": 1,
                "ID": 1,
                "types": 1,
                "Abilities": 1

                // res.json(
                //     {
                //     "k1": "val1",
                //     "k2": "val2"
                //     })
            })
        })
    })
})