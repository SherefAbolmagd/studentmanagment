var rootURL = "http://localhost/studentmanagment/api/books";

function addDataToTableRow(isbn, title, author, publisher, publishdate, price) {

  var row = $.parseHTML("<tr id='tr" + isbn + "'></tr>");

  var tdIndex = $.parseHTML("<td class='index-column'></td>");
  $(tdIndex).data("isbn", isbn);
  $(tdIndex).data("title", title);
  $(tdIndex).data("author", author);
  $(tdIndex).data("publisher", publisher);
  $(tdIndex).data("publishdate", publishdate);
  $(tdIndex).data("price", price);

  var tdTitle = $.parseHTML('<td></td>');
  $(tdTitle).html("<a href='#'>" + title + "</a>");

  var tdAuthor = $.parseHTML('<td></td>');
  $(tdAuthor).html(author);

  var tdDelete = $.parseHTML('<td></td>');
  $(tdDelete).html("<a href='#'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></a>");

  //add col to row
  $(row).append(tdIndex);
  $(row).append(tdTitle);
  $(row).append(tdAuthor);
  $(row).append(tdDelete);

  //add row to table
  $("#tbl1 tbody").append(row);
}

function loginFormToJSON() {
  return JSON.stringify({
    "login": $('#inputLogin').val(),
    "password": $('#inputPassword').val()
  });
}

function insertFormToJSON() {
  return JSON.stringify({
    "isbn": $('#isbn').val(),
    "title": $('#title').val(),
    "author": $('#author').val(),
    "publisher": $('#publisher').val(),
    "publishdate": $('#publishdate').val(),
    "price": $('#price').val()
  });
}

function editFormToJSON() {
  return JSON.stringify({
    "isbn": $('#inputEditIsbn').val(),
    "title": $('#inputEditTitle').val(),
    "author": $('#inputEditAuthorName').val(),
    "publisher": $('#inputEditPublisher').val(),
    "publishdate": $('#inputEditPublishingDate').val(),
    "price": $('#inputEditPrice').val()
  });
}


function editAuthorFormToJSON() {
  return JSON.stringify({
    "author": $('#inputAuthorName').val()
  });
}

function getTDValue(trID, tdNumber) {
  var tr = document.getElementById(trID);
  var td = tr.childNodes[tdNumber];
  return td.innerHTML;
}

function setTDValue(trID, tdNumber, tdValue) {
  var tr = document.getElementById(trID);
  var td = tr.childNodes[tdNumber];
  td.innerHTML = tdValue;
}

$(function () {

  $.ajaxPrefilter(function (options, oriOptions, jqXHR) {
    jqXHR.setRequestHeader("AUTH-TOKEN", sessionStorage.authToken);
  });

  //check for auth-token
  //sessionStorage.authToken = "";
  if (!sessionStorage.authToken) {
    $("#logindiv").fadeIn(1000);
    $("#navmember").hide();
    $("#loggeddiv").hide();
  }
  else {
    $("#logindiv").hide();
    $("#navmember").fadeIn(1000);
    $("#loggeddiv").fadeIn(1000);
    $("#tokeninfo").html("REST Authentication Token: " + sessionStorage.authToken);
    $("#username").html("Welcome " + sessionStorage.userName);
  }

  $("#formlogin").submit(function (event) {
    event.preventDefault(); //prevent redirect/page refresh

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: "http://localhost/studentmanagment/api/auth",
      dataType: "json",
      data: loginFormToJSON(),
      success: function (data) {
        sessionStorage.authToken = data.token;
        sessionStorage.userName = data.name;
        $("#logindiv").hide();
        $("#navmember").fadeIn(1000);
        $("#loggeddiv").fadeIn(1000);
        $("#tokeninfo").html("REST Token: " + sessionStorage.authToken);
        $("#username").html("Welcome " + sessionStorage.userName);

        $("#isbn").val("");
        $("#title").val("");
        $("#author").val("");
        $("#publisher").val("");
        $("#publishdate").val("");
        $("#price").val("");

        routie('home');
      },
      error: function () {
        alert("bla  bla while processing JSON file.");
      }
    });

    return false;
  });

  routie({
    '': function () {
      //this gets called when hash == #home
      $("#wellcrud").hide();
      $("#wellhome").fadeIn(1000);
      $("#lihome").addClass("active");
      $("#licrud").removeClass("active");
      routie('');
    },
    'home': function () {
      //this gets called when hash == #home
      $("#wellcrud").hide();
      $("#wellhome").fadeIn(1000);
      $("#lihome").addClass("active");
      $("#licrud").removeClass("active");
    },
    'crud': function () {
      //this gets called when hash == #crud
      $("#wellhome").hide();
      $("#wellcrud").fadeIn(1000);
      $("#licrud").addClass('active');
      $("#lihome").removeClass('active');

      $("#isbn").val("");
      $("#title").val("");
      $("#author").val("");
      $("#publisher").val("");
      $("#publishdate").val("");
      $("#price").val("");

      $("#tbl1 tbody").empty();
      $.ajax({
        //headers: {'AUTH-TOKEN': sessionStorage.authToken},
        type: "GET",
        url: rootURL,
        dataType: "json",
        success: function (data) {
          if (!data.error) {
            for (var x in data) {
              addDataToTableRow(data[x].isbn, data[x].title, data[x].author, data[x].publisher, data[x].publishdate, data[x].price);
            }
          }
          else {
            bootbox.alert("Authentication Token Invalid!", function () {
              $("#logindiv").fadeIn(1000);
              $("#navmember").hide();
              $("#loggeddiv").hide();
              sessionStorage.removeItem('authToken');
              sessionStorage.removeItem('userName');
              routie('');
            });
          }
        },
        error: function () {
          alert("An error occurred while processing JSON file. MAIN ERROR!!!!");
        }
      });

    }
  });


  $("#crud").click(function () {
    $("#wellhome").hide();
    $("#wellcrud").fadeIn(1000);
    $("#licrud").addClass('active');
    $("#lihome").removeClass('active');
    routie('crud');
  });

  $("#home").click(function () {
    $("#wellcrud").hide();
    $("#wellhome").fadeIn(1000);
    $("#lihome").addClass("active");
    $("#licrud").removeClass("active");
    routie('home');
  });

  $("#mainlink").click(function () {
    $("#wellcrud").hide();
    $("#wellhome").fadeIn(1000);
    $("#lihome").addClass("active");
    $("#licrud").removeClass("active");
    routie('home');
  });

  $("#btnhide").click(function () {
    bootbox.confirm("Are you sure want to hide Hello?", function (result) {
      if (result) {
        $("#hello").fadeOut(1000);
      }
    });
  });

  $("#btnshow").click(function () {
    bootbox.confirm("Are you sure want to show Hello?", function (result) {
      if (result) {
        $("#hello").fadeIn(1000);
      }
    });
  });

  //for delete
  $("#tbl1").on("click", "span", function () {
    //                     A        TD       TR
    var parentTR = $(this).parent().parent().parent();
    var firstTD = $(parentTR).children().eq(0);
    var isbn = $(firstTD).data("isbn");

    bootbox.confirm("Are you sure?", function (answer) {
      if (answer) {

        $.ajax({
          type: 'DELETE',
          url: rootURL + '/' + isbn,
          dataType: "json",
          success: function (data) {
            var status = data.deleteStatus;

            if (status == "success")
              $(parentTR).fadeOut("slow", "swing"); //.remove();
          },
          error: function () {
            alert("An error occurred while processing JSON file.");
          }
        });
      }
    });
  });

  //for mouseover
  $("#tbl1").on("mouseenter", "td", function (e) {
    var tdIndex = $(this).index();
    if (tdIndex == 2) {
      $(this).css('cursor', 'pointer');
      $(this).css('font-weight', 'bold');
    }
  }).on("mouseleave", "td", function () {
    var tdIndex = $(this).index();
    if (tdIndex == 2) {
      $(this).css('cursor', 'default');
      $(this).css('font-weight', 'normal');
    }
  });

  $("#tbl1").on("click", "td", function (e) {

    var tdIndex = $(this).index();

    var parentTR = $(this).parent();
    var firstTD = $(parentTR).children().eq(0);

    if (tdIndex == 1) //clicking title link - popup view/edit all data
    {
      $("#bookinfo").hide();
      //$("ol").empty();

      //isbn
      //data attribute in 1st td
      var isbn = $(firstTD).data("isbn");
      //$("ol").append("<li>" + isbn + "</li>");
      $("#inputEditIsbn").val(isbn);


      //title
      //data attribute in 1st td
      var title = $(firstTD).data("title");
      //$("ol").append("<li>" + title + "</li>");
      $("#inputEditTitle").val(title);

      //author
      //data attribute in 1st td
      var author = $(firstTD).data("author");
      //$("ol").append("<li>" + author + "</li>");
      $("#inputEditAuthorName").val(author);

      //publisher
      //data attribute in 1st td
      var publisher = $(firstTD).data("publisher");
      //$("ol").append("<li>" + publisher + "</li>");
      $("#inputEditPublisher").val(publisher);

      //publishdate
      //data attribute in 1st td
      var publishdate = $(firstTD).data("publishdate");
      //$("ol").append("<li>" + publishdate + "</li>");
      $("#inputEditPublishingDate").val(publishdate);

      //price
      //data attribute in 1st td
      var price = $(firstTD).data("price");
      //$("ol").append("<li>" + price + "</li>");
      $("#inputEditPrice").val(price);

      //alert(isbn + "\n" + title + "\n" + author + "\n" + publisher + "\n" + publishdate + "\n" + price);
      $("#bookinfo").fadeIn(1000);
    }

    if (tdIndex == 2) //clicking author name
    {
      var authorName = $(this).html();
      var tdAuthorName = this;

      bootbox.dialog({
        title: "Edit Author Name",
        message: '<form class="form-horizontal">' +

          ' <div class="form-group">' +
          '   <label for="inputAuthorName" class="col-sm-2 control-label">Author Name</label>' +
          '   <div class="col-sm-10">' +
          '     <input type="text" class="form-control" id="inputAuthorName" name="inputAuthorName" value="' + authorName + '">' +
          '   </div>' +
          ' </div>' +

          '</form>',
        buttons: {
          success: {
            label: "Save",
            className: "btn-success",
            callback: function () {

              var isbn = $(firstTD).data("isbn");

              $.ajax({
                type: 'PUT',
                contentType: 'application/json',
                url: rootURL + '/updateauthor/' + isbn,
                dataType: "json",
                data: editAuthorFormToJSON(),
                success: function (data) {

                  if (data.updateStatus == "success") {
                    var aName = $('#inputAuthorName').val();
                    $(tdAuthorName).html(aName);

                    $(firstTD).data("author", aName);
                  }
                },
                error: function () {
                  alert("An error occurred while processing JSON file.");
                }
              });
            }
          }
        }
      });
    }

    e.preventDefault();
    return false; // prevent default click action from happening!
  });

  //id="btnclosebookinfo"
  $("#btnclosebookinfo").click(function (e) {
    $("#bookinfo").fadeOut(1000);
    e.preventDefault();
    return false; // prevent default click action from happening!
  });

  $("#form1").submit(function (event) {
    event.preventDefault(); //prevent redirect/page refresh

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: rootURL,
      dataType: "json",
      data: insertFormToJSON(),
      success: function (data) {

        if (!data.error) {
          if (data.insertStatus == "success") {
            addDataToTableRow(data.isbn, data.title, data.author, data.publisher, data.publishdate, data.price);

            $("#isbn").val("");
            $("#title").val("");
            $("#author").val("");
            $("#publisher").val("");
            $("#publishdate").val("");
            $("#price").val("");

            bootbox.alert("New book inserted!", function () {
            });
          }
          else if (data.insertStatus == "failed") {
            bootbox.alert("REST operation error: " + data.errorMessage, function () {
            });

            $("#isbn").val("");
            $("#title").val("");
            $("#author").val("");
            $("#publisher").val("");
            $("#publishdate").val("");
            $("#price").val("");
          }
        }
        else {
          bootbox.alert("Authentication Token Invalid!", function () {
            $("#logindiv").fadeIn(1000);
            $("#navmember").hide();
            $("#loggeddiv").hide();
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('userName');
            routie('');
          });
        }
      },
      error: function () {
        alert("An error occurred while processing JSON file.");
      }
    });
  });


  $("#frmedit").submit(function (event) {
    event.preventDefault(); //prevent redirect/page refresh

    var isbn = $("#inputEditIsbn").val();

    $.ajax({
      type: 'PUT',
      contentType: 'application/json',
      url: rootURL + '/' + isbn,
      dataType: "json",
      data: editFormToJSON(),
      success: function (data) {
        if (!data.error) {
          ///////////////////////////////////////////////
          if (data.updateStatus == "success") {
            bootbox.alert("Book Editing Success!", function () {
            });

            //get the tr - current ROW
            var trID = "tr" + isbn;

            //set data on firstTd
            var firstTD = $("#tr" + isbn).children().eq(0);
            $(firstTD).data("isbn", data.isbn);
            $(firstTD).data("title", data.title);
            $(firstTD).data("author", data.author);
            $(firstTD).data("publisher", data.publisher);
            $(firstTD).data("publishingdate", data.publishingdate);
            $(firstTD).data("price", data.price);

            //book title link
            var secondTD = $("#tr" + isbn).children().eq(1);
            $(secondTD).html("<a href='#'>" + $("#inputEditTitle").val() + "</a>");

            //book author
            var thirdTD = $("#tr" + isbn).children().eq(2);
            $(thirdTD).html($("#inputEditAuthorName").val());
          }
          else if (data.updateStatus == "failed") {
            bootbox.alert("REST operation error: " + data.errorMessage, function () {
            });
          }
          ///////////////////////////////////////////////
        }
        else {
          bootbox.alert("Authentication Token Invalid!", function () {
            $("#logindiv").fadeIn(1000);
            $("#navmember").hide();
            $("#loggeddiv").hide();
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('userName');
            routie('');
          });
        }
      },
      error: function () {
        alert("An error occurred while processing JSON file.");
      }
    });
  });

  $("#hreflogout").click(function () {
    $("#logindiv").fadeIn(1000);
    $("#navmember").hide();
    $("#loggeddiv").hide();
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    routie('');
  });
});
