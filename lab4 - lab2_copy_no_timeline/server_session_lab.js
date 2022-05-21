const express = require('express')
const app = express()

var session = require('express-session')

// Use the express's session middleware
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true
}));

users = [
    {
        username: "user1",
        password: "pass1",
        shoppingCart: [           //몽고 db에서 push하면 좋을듯. 이 콜렉션에서 지우는 건.. 뭐 있을겨.
            {
                pokeID: 25,
                quantity: 1, //일단은 db 스트럭쳐용 하드코딩ㅎㅎ        
                price: 2 //걍 pokeid로 떙겨와도 좋을듯ㅋㅋㅋ    
            }
        ]
    },

    {
        username: "user2",
        password: "pass2",
        shoppingCart: [
            {
                pokeID: 24,
                quantity: 2,   
                price: 4     
            }
        ]
    }
] //메모리에 키, 밸류 오브젝트.. DB로 대체해서 유저 정보 넣으셈 나중에.. json 오브젝트니 필터,맵 가능할듯. DB는 json object의 집합 ㅎㅎ


//글로벌 미드웨어. (로컬 미드웨어는 logger2로 칭함)
app.use(logger1) // 어디서도 콜 안하는데 뜸.. 미들웨어로 추가됬기 때문임. app.use는 다른 어떤 함수를 취함. 어떤 라우터에서도 활용됨.
//미들웨어이므로 홈 라우터 보다 먼저 콜됨. 홈라우터(/)의 콜백펑션 req 부분에서 이미 미들웨어가 콜 되고. res는 /의 콜백함수 내에서 프로세스 되는 거니까.
//그래서 중간에 벌어지는 거라 미들웨어라 하는 거임ㅎㅎ




// function logger1() {
//     console.log("logger1 executed")   //정상 작동
// }

function logger1(req, res, next) { //미들웨어 보여주기용  (step 3)
    console.log("logger1 executed")
    next() //이거 없으면 이 메시지 안 띄움. 특수함수임. 미들웨어로서 다음 함수에 던져주는 역할. 야 이거 끝났어. 다음 거 해랑 ㅎㅎ
    // 인자 3개로 쓰면 항상 등장해야 함.
}


//로컬 미드웨어. 즉 오직 한 라우터만을 위한 놈
function logger2(req, res, next) { //(step 4)
    console.log("logger2 executed")
    next() //!!! signal to next middleware to start.   still you can have code. 끝이 아님ㅋㅋㅋ 아랫줄같이 ㅋㅋ 근데 가능하면 하지 마..  /step M
    //next()로 콜될 함수가 네 함수의 진짜 마지막이면 그 뒤에 들어올 건.. 모든 future middle ware가 끝나고 돌아올 자리임.
    // console.log("logger1 function is done")
}
//M-1: 왜 필요하냐 미들웨어
//유저.. protected page, router 갈 떄 필요할 겨..app미들웨어를 매번 그 protected router, page '/' 같은 거 접속할 떄 필요하니까..
//네가 지킬 라우터가 많은데 매 라우터 시작 전에 미들웨어로 걸어주면 좋지 않을까.. 근데 user profile만 프로텍트하면 되지 않을까?
//search router에서도 카트에 넣기... 좀 그러니까 add to cart 하면 protected version of search page로 끌고 가야할듯. 서치 페이지 버젼 2개..해야할듯. 프로텍티드1, 아닌 놈2으로


//M-2: 미들웨어니까 중간에 send해버리면 크래쉬 날 거임.
function auth(req, res, next) { //(step 4)
    console.log("logger2 executed")
    if (req.session.authenticated)
        // res.send(`Hi ${req.session.user} !`)  
        next()
    else {
        res.redirect('/login') 
    }
}

app.listen(5000, function (err) {
    if (err) console.log(err);
})

// app.get('/', function (req, res) {  //홈피 가면 바로 /login으로 redirect되게 되있음.       (15줄 미들웨어 썰 관련 코드)
//     console.log("/route got accessed!")
//     if (req.session.authenticated)
//         res.send(`Hi ${req.session.user} !`)
//     else {
//         res.redirect('/login')  //이러니 다시 logger1 메시지 뜸 ㅎㅎ
//     }
// })// 여기선 홈피부터 막았는데 search라우터나 어디서부터 막든가 니 맘대롴ㅋㅋ

// app.get('/', logger2, function (req, res) { //step 5.    ,로 추가 가능..ㅋㅋ  이러면 순서가 이렇게 됨ㅎㅎ 16줄이 처음, 그리고 여기.  콜백펑션도 미들웨어라고 보면 됨..ㅎㅎ
//     console.log("/route got accessed!")
//     // if (req.session.authenticated)
//     //     res.send(`Hi ${req.session.user} !`)
//     // else {
//         res.redirect('/login') // logger1이 글로벌 미들웨어라 다시 logger1을 쏴주는겨 ㅋㅋ 모든 라우터에서 작동하는 놈이니. 무튼 근데 미들웨어는 다 ㅋ드 위쪽에 올려놓는 게 좋음.
    
// }) // 

//M-4
app.get('/userProfile/:name'), function(req, res){
    res.send(`Welcome ${req.session.name} !`)
}

// M-3
app.get('/', auth, function (req, res) { //step 5.    ,로 추가 가능..ㅋㅋ  이러면 순서가 이렇게 됨ㅎㅎ 16줄이 처음, 그리고 여기.  콜백펑션도 미들웨어라고 보면 됨..ㅎㅎ
    console.log("/route got accessed!")
    // if (req.session.authenticated)
        res.send(`Hi <a href="/userProfile/${req.session.user}" ! </a>`)  //몽고할 떄 좀 어글리할 수 있으니 1,2 같은 아이디나 뭐 그런 걸로 해볼까..?
    // else {
        res.redirect('/login') // logger1이 글로벌 미들웨어라 다시 logger1을 쏴주는겨 ㅋㅋ 모든 라우터에서 작동하는 놈이니. 무튼 근데 미들웨어는 다 ㅋ드 위쪽에 올려놓는 게 좋음.
    
}) // 

app.get('/login/', function (req, res, next) {
    res.send("Please provide the credentials through the URL")
})

app.get('/login/:user/:pass', function (req, res, next) { //url로 노출되니 이렇겐 하지 말자..ㅋㅋ.. 몽고db에서 찾규. find 메서드와 프로젝션으로..
    users.filter(user => user.username == req.params.user)[0].shoppingCart //콜백펑션을 취하지 filter()
    // 괄호속과 같은 거임. ( (user) => {return user.username == req.params.user })
    if (users.filter(user => user.username == req.params.user)[0].password == req.params.pass)
        // [req.params.user] == req.params.pass) 
        {
        req.session.authenticated = true //node js, express js 자체 db 안에 저장될거라 신경을 쓰질 마삼. express-session.
        req.session.user = req.params.user //이 2개의 글로벌 세션 variable이 어떤 라우터에서든 킵될거라 ㅋㅋ 로긴 상탠지 등등
        res.send("Successful Login!")
    } else {
        req.session.authenticated = false
        res.send("Failed Login!")
    }

})