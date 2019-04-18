

var config = {
    apikey: "AIzaSyAXb3Kn2gxmzUrRh1O0wlcfsNKe3uStpOM",
    authDomain: "https://bookclub-5e3c6.firebaseapp.com/",
    databaseURL: "https://bookclub-5e3c6.firebaseio.com/",
    projectID: "bookclub-5e3c6"
}
firebase.initializeApp(config)
var database = firebase.database()

$(".sign-in-btn").on("click", function () {
    alert("hfdkjds")
    $(".section2").removeClass("d-none")

    $("#sign-up").on("submit", function (e) {

        e.preventDefault()
        database.ref("/users/").push({
            name: $("#username").val(),
            password: $("#password").val()
        })
        $(".sign-in").html($("#username").val())
        $("#username").val("")
        $("#password").val("")
        $(".section2").addClass("d-none")
    })


    database.ref().on("value", function (snapshot) {
        console.log(snapshot)
    })
})
$("#book-search").on("submit", function (e) {
    e.preventDefault()
    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes",
        data: {
            q: $("#book-search-name").val()
        }
    }).then(function (resp) {
        console.log(resp)

        var isbn = resp.items[0].volumeInfo.industryIdentifiers[0].identifier

        database.ref("/books/").once("value", function (snapshot) {
            var books = snapshot.val()
            console.log(books)
            if (!books) {
                database.ref("/books/" + isbn).set({
                    name: resp.items[0].volumeInfo.title,
                    authors: resp.items[0].volumeInfo.authors[0],
                    poster: resp.items[0].volumeInfo.imageLinks.thumbnail
                })
                database.ref("/votes/" + isbn).set({
                    vote: 0
                })
            } else {
                for (i in books) {
                    if (i != isbn) {
                        database.ref("/books/" + isbn).set({
                            name: resp.items[0].volumeInfo.title,
                            authors: resp.items[0].volumeInfo.authors[0],
                            poster: resp.items[0].volumeInfo.imageLinks.thumbnail
                        })
                        database.ref("/vote/" + isbn).set({
                            vote: 0
                        })
                    }
                }
            }
        })
        database.ref("/votes/").once("value", function (snapshot) {
            var votes = snapshot.val()
            console.log(votes)
            if (!votes) {
                database.ref("/votes/" + isbn).set({
                    vote: 0
                })
            } else {
                for (i in votes) {
                    if (i != isbn) {
                        database.ref("/vote/" + isbn).set({
                            vote: 0
                        })
                    }
                }
            }
        })
        $("#book-search-name").text("")
    })

    //resp.items[i].volumeInfo.imageLinks.thumbnail


})
$("#show-all-list").on("click", function () {

    $(".section3").removeClass("d-none")
    $('html, body').animate({
        scrollTop: $(".section3").offset().top
    }, 2000)

})
//$("#bookUsersChoise").on("click", function() {})