const express = require('express');
const app = express()

var session = require('express-session');
const MongoStore = require('connect-mongo');
const url = require('url');

const https = require('https')
app.set('view engine', 'ejs');
const cors = require('cors');
app.use(cors());

// const collection = require('./data.js') // for own API with 2 pokes

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({  //body parser 안에 어떤 데이터 타입을 넣으셨나요. 인코디드된거요 ㅇㅇ
    extended: true
}));


const mongoose = require('mongoose');



// session
app.use(session({
  secret: "haha", 
  resave: false, 
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost/sessionDB",
    collection: "sessions"
  })
}));





let user = {      //회원 정보
  user_id: "hong",
  user_pwd: "1111"
};


app.get('/login', (req, res) => {     
  if(req.session.logined) {
    res.render('logout', { id: req.session.user_id });
  } else {
    res.render('login.ejs');
  }
});

app.post('/login', (req, res) => {     
  if(req.body.id == user.user_id && req.body.pwd == user.user_pwd){
    req.session.logined = true;
    req.session.user_id = req.body.id;
    res.render('logout', { id: req.session.user_id });
    } else {
      res.send(`
        <h1>Who are you?</h1>
        <a href="/">Back </a>
      `);
  }
});


var conn_session = mongoose.createConnection('mongodb://localhost:27017/sessionDB');

const userSchema = mongoose.Schema({
  user_id: String,
  password: String,
  cart: [{
    pokeID: Number,
    qty: Number,
    price: Number}]
})

const User = conn_session.model('users', userSchema)  //첫 변수는 콜렉션명.. 항상 복수형


function isDuplicate(req, res, uid, upwd) {
  let parseUrl = url.parse(req.url);
  let urlPathName_ = parseUrl.pathname;
  if(urlPathName_ == '/register') {
      User.findOne({ "user_id": uid }, (err, user) => {
          if(err) return res.json(err);

          if(user) {
              console.log('user id duplicate');
              res.send(`
                  <a href="/">Back</a>
                  <h1>User id duplicate</h1>
              `);
          } else {
              User.create({ "user_id": uid, "password": upwd, "cart":[{pokeID: 1, qty: 1, price: 1}] }, (err) => {
                  if(err) return res.json(err);
                  console.log('Success');
                  res.redirect('/');
              })
          }
      })
  } else {
      User.findOne({ "user_id": uid }, (err, user) => {
          if(err) return res.json(err);

          if(user) {
              User.findOne({ "password": upwd })
                  .exec((err, user) => {
                  if(err) return res.json(err);

                  if(!user) {
                      console.log('different password');
                      res.send(`
                      <a href="/">Back</a>
                      <h1>Different password</h1>
                  `);
                  } else {
                      console.log('Welcome');
                      req.session.user_id = uid;
                      req.session.logined = true;
                      res.redirect('/');
                  }
              })
          } else {
              console.log('Cannot find user');
              res.send(`
                  <a href="/">Back</a>
                  <h1>Cannot find user</h1>
              `);
          }
      })
  }
}


app.post('/logout', (req, res) => {   
  req.session.destroy();
  res.redirect('/');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  let uid = req.body.user_id;
  let upwd = req.body.password;
  isDuplicate(req, res, uid, upwd);
});

var conn_timeline = mongoose.createConnection('mongodb://localhost:27017/timelineDB');

//stored in 'timelineDB' database
  const timelineModel = conn_timeline.model('timelines', new mongoose.Schema( //첫 변수는 콜렉션명
    {
    text: String,
    hits: Number,
    time: String,  //몽고 db에 date, 등 다양한 포맷 있을거니 확인하셈.
}));



app.get('/timeline/getAllEvents', function(req, res) {
    timelineModel.find({}, function(err, data){    //몽구스의 CRUD. find, remove, updateone, updatemany, create
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data "+ data);
        }
        res.send(data);  //나빌 비디오에선 왜 걍 스트링파이 없이 data함. 원본 데이터 따라서 맞게 해주면 될듯.
    });
  })

//어흐 우리 그럼 위아래들 또 클라단 꾸미고 ajax 겁나 해야 하잖아요.. 각각 라우터들  ajax rq에 다 담아야 하고..
// 개귀찮? ㄴㄴ 클라 구축 전 단순 테스트는 우선 postman을 써보셈ㅎㅎ 클라단 안 만들어도 이게 클라 역할 해서 ajax RQ 보내서. 서버쪽'만' 테스트 해줌.

  app.put('/timeline/insert', function(req, res) {  //put = create. post = update 뭐 http body로 쓰는 거라 어느걸 써도 상관 없는데 나빌은 post를 <html form type post>에서만 쓰고자 킵해두고 싶었음ㅋㅋ
    console.log(req.body) // postman .. bodyp parser ㄱ
    timelineModel.create({                           
        'text': req.body.text,   //schema가 빛을 발하는 순간. schema의 타입에 비추어 데이터를 가려 받음.
        'hits': req.body.hits,
        'time': req.body.time}, function(err, data){
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data "+ data); //stringfy 안하면 한줄 말고 콘솔에 json폼으로 이쁘게 뜨기도 함ㅋㅋ
        }
        // res.send(JSON.stringify(data)); 
        res.send("Insertion completed!"); 
    
    });
  })
  // mongoDB에선 insert. 몽구스에선 create



  app.get('/timeline/delete/:id', function(req, res) {  
    // console.log(req.body)  - query param 쓸거니까 무쓸모
    timelineModel.remove({
        '_id': req.params.id,
      }, function(err, data){
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data "+ data); 
        }
        res.send("Delete request was successful!"); 
    });
  })

  app.get('/timeline/increaseHits/:id', function(req, res) {  //URL 쓰니 get 고. express에 .update 없다.
    // console.log(req.body)  - query param 쓸거니까 무쓸모
    timelineModel.updateOne({  //id 쓰니까 하나만 업뎃하자
        '_id': req.params.id,
      }, {    //update는 json 오브젝트 하나 더 필요. 그 오브젝트 속은 {기준: 액션}
        $inc: {'hits': 1}
       },   
      function(err, data){
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data "+ data); 
        }
        res.send("Update request was successful!"); 
    });
  })

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

app.get('/search/db', function (req, res) {
  // res.sendFile(__dirname + "/public/search.html")
  res.json(collection["pokemons"].find(
    (poke) => poke.id == req.query["q"]))
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
            hp_ = data.stats.filter(   (obj_) => { return obj_.stat.name == "hp" }    ).map(  (k) => { return k.base_stat } );
            attack_  = data.stats.filter(   (obj_) => { return obj_.stat.name == "attack" }    ).map(  (k) => { return k.base_stat } );
            defense_  = data.stats.filter(   (obj_) => { return obj_.stat.name == "defense" }    ).map(  (k) => { return k.base_stat } );
            speed_  = data.stats.filter(   (obj_) => { return obj_.stat.name == "speed" }    ).map(  (k) => { return k.base_stat } );
            types_array = []
            for (i=0; i < data.types.length; i++) {
                types_array.push(data.types[i].type.name)
            }
            types_array_ = types_array
            console.log(hp_)
            
            res.render("profile.ejs", { //sent whole/complete html file. sendfile이랑 같아 ㅋㅋ 근데 html 뿐 아니라 variable을 그 html에 패스해줄 수 있다는 게 차이점. ejs 확장자여야 함. app.set(라인3 import도 해줘야)
                "id": req.params.id,
                "name": data.name,
                "img_path": data.sprites.other["official-artwork"].front_default,
                "hp": hp_,
                "attack": attack_,
                "defense": defense_,
                "speed": speed_,
                "types_array_": types_array
            })
        })
    })
})