function showInDiv(data) {


    data += `<br> Long time no see!`
    $("#userinfo").html(data)
}

function displayUserInfo() {
    $.ajax({
        type: "get",
        url: "http://localhost:5000/getuserinfo",
        success: showInDiv
    })
}





function setup() {
    displayUserInfo();



}

$(document).ready(setup);