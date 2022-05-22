function showInDiv(data) {


    data += `<br> Long time no see!`
    $("#userinfo").html(data)
}

function displayUserInfo() {
    $.ajax({
        type: "get",
        url: "https://dry-plateau-70570.herokuapp.com/getuserinfo",
        success: showInDiv
    })
}





function setup() {
    displayUserInfo();



}

$(document).ready(setup);