firstCard = undefined
secondCard = undefined

firstCardHasBeenFlipped = false




function populateCards() {

    $("#game_grid").empty()

    difficultyValue = $(this).val();
    numOfCards = Number(difficultyValue);

    for (i = 0; i < numOfCards; i++) {

        randNum = Math.floor(Math.random() * 3) + 7;
        $("#game_grid").append(
            `<div class="card">
        <img class ="front_face" src="./${randNum}.png" alt="">
        <img class ="back_face" src="./cover.png"  alt="">
    </div>`
        );
    }

    // $("#clock").html(
    //     `<span id="clock" style="width: 200px; height: 200px; font-size: 30px;">         ${formatTime(timeLeft)}        </span>     `
    // )

    // startTimer(numOfCards);
}


var time_limit_ = null;

let timePassed = 0;
let timeLeft = time_limit_;
let timerInterval = null;




function formatTime(sec) {
    const minutes = Math.floor(sec / 60);

    // Seconds are the remainder of the time divided by 60 (modulus operator)
    let seconds = sec % 60;

    // If the value of seconds is less than 10, then display seconds with a leading zero
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    // The output in MM:SS format
    return `${minutes}:${seconds}`;
}


function startTimer(timeLimit) {

    switch(timeLimit){
        case 4: time_limit_ = 3;
        break;

        case 8: time_limit_ = 6;
        break;

        case 16: time_limit_ = 10;
        break;
    }

    timerInterval = setInterval(() => {

        timePassed = timePassed += 1;
        timeLeft = time_limit_ - timePassed;

        if (timeLeft >= 0){
            $("#clock").html(`<span id="clock" style="width: 200px; height: 200px; font-size: 30px;">         ${formatTime(timeLeft)}        </span>     `)
        }
        else {
            $("#game_grid").html("GAME OVER. REFRESH PAGE")
        }
    }, 1000)
}


function changeTime() {

    timeArg = $(this).val();
    timeLimit = Number(timeArg);
    $("#clock").html(
        `<span id="clock" style="width: 200px; height: 200px; font-size: 30px;">         ${formatTime(timeLeft)}        </span>     `
    )

    startTimer(timeLimit);
}

function changeDims(){
    dimension = $(this).val();
    newDims = 100 / Number(dimension)
    $(".card").css("width", `calc(${newDims}% - 10px)`)
}


function setup() {




    $("#level_").change(changeTime);
    $("#grid_size_").change(changeDims);
    $("#card_num_").change(populateCards);


    $("body").on("click", ".card", function () {

        // $(".card").on("click", function () {
        $(this).toggleClass("flip");

        if (!firstCardHasBeenFlipped) {
            // the first card
            firstCard = $(this).find(".front_face")[0]
            // console.log(firstCard);
            firstCardHasBeenFlipped = true
        } else {
            // this is the 2nd card
            secondCard = $(this).find(".front_face")[0]
            firstCardHasBeenFlipped = false
            console.log(firstCard, secondCard);
            // check if we have match!
            if (
                $(firstCard).attr("src") ==
                $(secondCard).attr("src")
            ) {
                console.log("a match!");
                // update the game state
                // disable clicking events on these cards
                $(firstCard).parent().off("click")
                $(secondCard).parent().off("click")
            } else {
                console.log("not a match");
                // unflipping
                setTimeout(() => {
                    $(firstCard).parent().removeClass("flip")
                    $(secondCard).parent().removeClass("flip")
                }, 1000)
            }
        }
    })
}

$(document).ready(setup)