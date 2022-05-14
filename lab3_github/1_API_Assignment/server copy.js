const express = require('express')
const app = express()
app.set('view engine', 'ejs');


app.listen(5000, function (err) {
    if (err) 
        console.log(err);
})

// app.get('/', function (req, res) {
//     res.send('GET request to homepage')
// })

app.use(express.static('./public'));
//app.use is a method that will enable a middleware
//라우터 100개 필요 없이 걍 public 폴더에 있는 건 라우터 명시 없어도 띄워주게)

// function f_1() {
//     console.log("dummy middel ware")
// }

// app.use(f_1)
// execute this middleware(f_1) for each rq

app.get('/profile/:id', function (req, res) {
    // console.log(req)
    // req.params.id;
    // res.send(`<h1> Hi there. This pokemon has the id: ${req.params.id}`)
    // req.body.id <- https post RQ

    // res.render("profile.ejs", {  //sent whole/complete html file. sendfile이랑 같아 ㅋㅋ 근데 html 뿐 아니라 variable을 그 html에 패스해줄 수 있다는 게 차이점. ejs 확장자여야 함. app.set(라인3 import도 해줘야)
    // "id": req.params.id


    res.json(
        {
        "k1": "val1",
        
        "k2": "val2"
        }
    )
    // });


    
});