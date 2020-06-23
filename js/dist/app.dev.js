"use strict";

var rootURL = "http://localhost/studentmanagment/api/cars";

function addDataToTableRow(Model, Name, Color, Type, Capacity, Speed) {
  var row = $.parseHTML("<tr id='" + Model + "'></tr>");
  var tdIndex = $.parseHTML("<td class='index-column'></td>");
  $(tdIndex).data("Model", Model);
  $(tdIndex).data("Name", Name);
  $(tdIndex).data("Color", Color);
  $(tdIndex).data("Type", Type);
  $(tdIndex).data("Capacity", Capacity);
  $(tdIndex).data("Speed", Speed);
  var Model1 = $.parseHTML('<td></td>');
  $(Model1).html(Model);
  var Name1 = $.parseHTML('<td></td>');
  $(Name1).html("<a href='#'>" + Name + "</a>");
  var Color1 = $.parseHTML('<td></td>');
  $(Color1).html("<a href='#'>" + Color + "</a>");
  var Type1 = $.parseHTML('<td></td>');
  $(Type1).html(Type);
  var Capacity1 = $.parseHTML('<td></td>');
  $(Capacity1).html(Capacity);
  var Speed1 = $.parseHTML('<td></td>');
  $(Speed1).html(Speed);
  var tdDelete = $.parseHTML('<td></td>');
  $(tdDelete).html("<a href='#'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></a>"); //add col to row

  $(row).append(Model1);
  $(row).append(Name1);
  $(row).append(Color1);
  $(row).append(Type1);
  $(row).append(Capacity1);
  $(row).append(Speed1);
  $(row).append(tdDelete); //add row to table

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
    "modelNumber": $('#Model').val(),
    "carName": $('#Name').val(),
    "color": $('#Color').val(),
    "carType": $('#Type').val(),
    "tankCapacity": $('#Capacity').val(),
    "topSpeed": $('#Speed').val()
  });
}

function editFormToJSON() {
  return JSON.stringify({
    "modelNumber": $('#inputEditIsbn').val(),
    "carName": $('#inputEditTitle').val(),
    "color": $('#inputEditAuthorName').val(),
    "carType": $('#inputEditPublisher').val(),
    "tankCapacity": $('#inputEditPublishingDate').val(),
    "topSpeed": $('#inputEditPrice').val()
  });
}

function editAuthorFormToJSON() {
  return JSON.stringify({
    "color": $('#color').val()
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
  }); //check for auth-token
  //sessionStorage.authToken = "";

  if (!sessionStorage.authToken) {
    $("#logindiv").fadeIn(1000);
    $("#navmember").hide();
    $("#loggeddiv").hide();
  } else {
    $("#logindiv").hide();
    $("#navmember").fadeIn(1000);
    $("#loggeddiv").fadeIn(1000);
    $("#tokeninfo").html("REST Authentication Token: " + sessionStorage.authToken);
    $("#username").html("Welcome " + sessionStorage.userName);
  }

  $("#formlogin").submit(function (event) {
    event.preventDefault(); //prevent redirect/page refresh

    values = loginFormToJSON();
    $.ajax({
      type: 'POST',
      cache: false,
      contentType: 'application/json',
      url: "http://localhost/studentmanagment/api/auth",
      dataType: "json",
      data: values,
      success: function success(data) {
        sessionStorage.authToken = data.token;
        sessionStorage.userName = data.name;
        $("#logindiv").hide();
        $("#navmember").fadeIn(1000);
        $("#loggeddiv").fadeIn(1000);
        $("#tokeninfo").html("REST Token: " + sessionStorage.authToken);
        $("#username").html("Welcome " + sessionStorage.userName); // (data.cars).forEach(element => {
        //   console.log(element.modelNumber);
        //   addDataToTableRow(element.modelNumber,element.carName,element.color, element.carType,element.tankCapacity,element.topSpeed);
        // });

        $("#isbn").val("");
        $("#title").val("");
        $("#author").val("");
        $("#publisher").val("");
        $("#publishdate").val("");
        $("#price").val("");
        routie('home');
      },
      error: function error() {
        alert("Anta sproblems while processing JSON file.");
      }
    });
    return false;
  });
  routie({
    '': function _() {
      //this gets called when hash == #home
      $("#wellcrud").hide();
      $("#wellhome").fadeIn(1000);
      $("#lihome").addClass("active");
      $("#licrud").removeClass("active");
      routie('');
    },
    'home': function home() {
      //this gets called when hash == #home
      $("#wellcrud").hide();
      $("#wellhome").fadeIn(1000);
      $("#lihome").addClass("active");
      $("#licrud").removeClass("active");
    },
    'crud': function crud() {
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
        success: function success(data) {
          if (!data.error) {
            for (var x in data) {
              addDataToTableRow(data[x].modelNumber, data[x].carName, data[x].color, data[x].carType, data[x].tankCapacity, data[x].topSpeed);
            }
          } else {
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
        error: function error() {
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
  }); //for delete

  $("#tbl1").on("click", "span", function () {
    //                     A        TD       TR
    var parentTR = $(this).parent().parent().parent();
    var firstTD = $(parentTR);
    var id = firstTD[0].id;
    bootbox.confirm("Are you sure?", function (answer) {
      if (answer) {
        $.ajax({
          type: 'DELETE',
          url: rootURL + '/' + id,
          dataType: "json",
          success: function success(data) {
            var status = data.deleteStatus;
            if (status == "success") $(parentTR).fadeOut("slow", "swing"); //.remove();
          },
          error: function error() {
            alert("An error occurred while processing JSON file.");
          }
        });
      }
    });
  }); //for mouseover

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
        $("#bookinfo").hide(); //$("ol").empty();
        //isbn
        //data attribute in 1st td

        var isbn = firstTD[0].innerHTML; //$("ol").append("<li>" + isbn + "</li>");

        $("#inputEditIsbn").val(isbn);
        firstTD = $(parentTR).children().eq(1).children(0); //title
        //data attribute in 1st td

        var title = firstTD[0].innerHTML; //$("ol").append("<li>" + title + "</li>");

        $("#inputEditTitle").val(title);
        firstTD = $(parentTR).children().eq(2).children(0); //author
        //data attribute in 1st td

        var author = firstTD[0].innerHTML; //$("ol").append("<li>" + author + "</li>");

        $("#inputEditAuthorName").val(author);
        firstTD = $(parentTR).children().eq(3); //publisher
        //data attribute in 1st td

        var publisher = firstTD[0].innerHTML; //$("ol").append("<li>" + publisher + "</li>");

        $("#inputEditPublisher").val(publisher);
        firstTD = $(parentTR).children().eq(4); //publishdate
        //data attribute in 1st td

        var publishdate = firstTD[0].innerHTML; //$("ol").append("<li>" + publishdate + "</li>");

        $("#inputEditPublishingDate").val(publishdate);
        firstTD = $(parentTR).children().eq(5); //price
        //data attribute in 1st td

        var price = firstTD[0].innerHTML; //$("ol").append("<li>" + price + "</li>");

        $("#inputEditPrice").val(price); //alert(isbn + "\n" + title + "\n" + author + "\n" + publisher + "\n" + publishdate + "\n" + price);

        $("#bookinfo").fadeIn(1000);
      }

    if (tdIndex == 2) //clicking author name
      {
        var authorName = $(this).children(0).html();
        var tdAuthorName = this;
        bootbox.dialog({
          title: "Edit Car Color",
          message: '<form class="form-horizontal">' + ' <div class="form-group">' + '   <label for="color" class="col-sm-2 control-label">Car Color</label>' + '   <div class="col-sm-10">' + '     <input type="text" class="form-control" id="color" name="color" value="' + authorName + '">' + '   </div>' + ' </div>' + '</form>',
          buttons: {
            success: {
              label: "Save",
              className: "btn-success",
              callback: function callback() {
                var isbn = $(firstTD).html();
                $.ajax({
                  type: 'PUT',
                  contentType: 'application/json',
                  url: rootURL + '/updatecolor/' + isbn,
                  dataType: "json",
                  data: editAuthorFormToJSON(),
                  success: function success(data) {
                    if (data.updateStatus == "success") {
                      var color = $('#color').val();
                      $(tdAuthorName).html(color);
                      $(firstTD).data("color", color);
                    }

                    location.reload();
                  },
                  error: function error() {
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
  }); //id="btnclosebookinfo"

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
      success: function success(data) {
        if (!data.error) {
          if (data.insertStatus == "success") {
            addDataToTableRow(data.modelNumber, data.carName, data.color, data.carType, data.tankCapacity, data.topSpeed);
            $("#Model").val("");
            $("#Name").val("");
            $("#Color").val("");
            $("#Type").val("");
            $("#Capacity").val("");
            $("#Speed").val("");
            bootbox.alert("New book inserted!", function () {});
          } else if (data.insertStatus == "failed") {
            bootbox.alert("REST operation error: " + data.errorMessage, function () {});
            $("#Model").val("");
            $("#Name").val("");
            $("#Color").val("");
            $("#Type").val("");
            $("#Capacity").val("");
            $("#Speed").val("");
          }
        } else {
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
      error: function error() {
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
      success: function success(data) {
        if (!data.error) {
          ///////////////////////////////////////////////
          if (data.updateStatus == "success") {
            bootbox.alert("Car Editing Success!", function () {
              location.reload();
            }); //get the tr - current ROW

            var trID = "tr" + isbn; //set data on firstTd

            var firstTD = $("#tr" + isbn).children().eq(0);
            $(firstTD).data("isbn", data.isbn);
            $(firstTD).data("title", data.title);
            $(firstTD).data("author", data.author);
            $(firstTD).data("publisher", data.publisher);
            $(firstTD).data("publishingdate", data.publishingdate);
            $(firstTD).data("price", data.price); //book title link

            var secondTD = $("#tr" + isbn).children().eq(1);
            $(secondTD).html("<a href='#'>" + $("#inputEditTitle").val() + "</a>"); //book author

            var thirdTD = $("#tr" + isbn).children().eq(2);
            $(thirdTD).html($("#inputEditAuthorName").val());
          } else if (data.updateStatus == "failed") {
            bootbox.alert("REST operation error: " + data.errorMessage, function () {});
          } ///////////////////////////////////////////////

        } else {
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
      error: function error() {
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