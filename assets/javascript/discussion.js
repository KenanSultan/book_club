
database.ref("bookOnDiscussion").once("value", function (snapshot) {
    console.log(snapshot.val())
    $("#comment-book-post").attr("src", snapshot.val().poster )
    $(".comment-book-name").html(snapshot.val().name)
    $(".comment-book-author").html(snapshot.val().author)
    $(".description").html(snapshot.val().description)
})



