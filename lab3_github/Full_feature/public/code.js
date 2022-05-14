to_add = ''

function processPokeResp(data) {
    // 3 - process the response and extract the img
    to_add += `<div class="image_container"> 
                <a href="/profile/${data.id}">
                <img src="${data.sprites.other["official-artwork"].front_default}">
                </a>
                </div>`
}

async function loadNineImages() {
    for (i = 1; i <= 9; i++) { // 9 times <-> three times and another nested for loop 3 
        
        if (i % 3 == 1) {
            to_add += `<div class="images_col">`
        }


        // 1 - generate random numbers using js. random은 소수점 제너레이트 함.
        x = Math.floor(Math.random() * 1183) + 1
        if (x >= 900 && x <=10000)
            x = Math.floor(Math.random() * 227) + 10001


        // 2 - init AJAX rq to pkeapi.co
        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${x}/`,
            success: processPokeResp
        })

//wait until await done.
//async: convert asynchrnous code to synchronous.
//ajax is.. async.....
// it willgo to i $ 3 == 0 line after await ends

        if (i % 3 == 0) {
            to_add += `</div>`
        }
    }
    $("main").html(to_add)
}


function setup() {
    loadNineImages();

}


$(document).ready(setup)
//whenever document is ready, it will trigger setup.