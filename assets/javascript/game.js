

var config = {
    apikey: "AIzaSyAXb3Kn2gxmzUrRh1O0wlcfsNKe3uStpOM",
    authDomain: "https://bookclub-5e3c6.firebaseapp.com/",
    databaseURL: "https://bookclub-5e3c6.firebaseio.com/",
    projectID: "bookclub-5e3c6"
}
firebase.initializeApp(config)
var database = firebase.database()

$(".sign-in-btn").on("click", function () {

    $(".section2").removeClass("d-none")
    $('html, body').animate({
        'scrollTop': $(".section2").offset().top - 60
    },3000)

    $("#sign-up").on("submit", function (e) {

        e.preventDefault()
        database.ref("/users/").push({
            name: $("#username").val(),
            password: $("#password").val()
        })

        $("#username").val("")
        $("#password").val("")
        $(".section2").addClass("d-none")
    })


    database.ref().on("value", function (snapshot) {
        console.log(snapshot)
    })
})
$("#book-search").on("submit", function(e) {
    e.preventDefault()
    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes",
        data: {
            q: $("#book-search-name").val()
        }
    }).then(function (resp) {
        console.log(resp)
        $("#search-btn-book-image").empty() 
        for (let i = 0; i<5; i++ ) {

            var bookUsersChoise = $("<img>")
            bookUsersChoise.attr("id","bookUsersChoise")
            bookUsersChoise.attr("src", resp.items[i].volumeInfo.imageLinks.thumbnail)
            var searchImageHolder = $("<div>")
            searchImageHolder.addClass("col")
            searchImageHolder.append(bookUsersChoise)
            $("#search-btn-book-image").append(searchImageHolder)
        }
    })
})

//$("#bookUsersChoise").on("click", function() {})