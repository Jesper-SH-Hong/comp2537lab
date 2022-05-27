function showInDiv(data) {
console.log(data)


if (data.role == "admin") {
    $('#manage_user').show()
    $("#userinfo").html(`<b>${data.user_id}</b>`)
}
else{

    data += `<br> Long time no see!`
    $("#userinfo").html(`<b>${data.user_id}</b>`)
}
}

async function displayUserInfo() {
    await $.ajax({
        type: "get",
        url: "http://localhost:5000/getuserinfo",
        success: showInDiv
    })
}





function setup() {
    displayUserInfo();

    $('#manage_user').hide()

}

$(document).ready(setup);