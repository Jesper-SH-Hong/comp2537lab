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
        shoppingCart: [           
            {
                pokeID: 25,
                quantity: 1,    
                price: 2 
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
] 

app.use(logger1) 


function logger1(req, res, next) { 
    console.log("logger1 executed")
    next()
}


function logger2(req, res, next) { 
    console.log("logger2 executed")
    next() 
    }



function auth(req, res, next) { 
    console.log("logger2 executed")
    if (req.session.authenticated)
       
        next()
    else {
        res.redirect('/login') 
    }
}

app.listen(5000, function (err) {
    if (err) console.log(err);
})

app.get('/userProfile/:name', function(req, res){
    tmp = ''
    tmp += `Hi ${req.params.name} !`
    tmp += JSON.stringify(users.filter(user => user.username == req.params.name)[0].shoppingCart)
    res.send(tmp)
})



// M-3
app.get('/', auth, function (req, res) { 
    console.log("/route got accessed!")
        res.send(`Hi <a href="/userProfile/${req.session.user}" ! </a>`)  

        res.redirect('/login') 
}) 

app.get('/login/', function (req, res, next) {
    res.send("Please provide the credentials through the URL")
})

app.get('/login/:user/:pass', function (req, res, next) { 
    users.filter(user => user.username == req.params.user)[0].shoppingCart 
    if (users.filter(user => user.username == req.params.user)[0].password == req.params.pass)
        
        {
        req.session.authenticated = true 
        req.session.user = req.params.user
        res.redirect(`/userProfile/${req.params.user}`)
    } else {
        req.session.authenticated = false
        res.send("Failed Login!")
    }

})