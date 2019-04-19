
database.ref("bookOnDiscussion").once("value", function (snapshot) {
    console.log(snapshot.val())
    isbn = snapshot.val().isbn
    $("#comment-book-post").attr("src", snapshot.val().poster)
    $(".comment-book-name").html(snapshot.val().name)
    $(".comment-book-author").html(snapshot.val().author)
    $(".description").html(snapshot.val().description)
})


$("#comment-submit-btn").on("submit", function (e) {
    e.preventDefault()

    if (enter == true) {
        database.ref("/books/" + isbn + "/comments").push({
            username: user_name,
            comment: $("comment-placeholder").val()
        })
    } else {
        var alertSpace = $("<div>")
        alertSpace.attr("id", "comment-user-name")
        alertSpace.html("sign in first, please")
    }
})


database.ref("/books/" + isbn + "comments").on("value", function (snapshot) {

    var comment = snapshot.val()

    for (i in comment) {
        var nameholder = $("<div>")
        nameholder.attr("id", "comment-user-name")
        nameholder.html(coment[i].username)
        $(".name-comment-div").append(nameholder)
        var commentholder = $("<div>")
        commentholder.addClass("users-comments")
        commentholder.html(comment[i].comment)
        $(".name-comment-div").append(commentholder)
    }
})
