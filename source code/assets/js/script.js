var app = {};
app.currentTime = 0;
app.correctitems = 0;
app.totalItems = 7;
app.maxTime = 150000;
app.itemtime = [];

var tools = {};
tools.play = false;

$(document).ready(function () {
    console.log("ready!");

    window.view_selectuser = $("#user");
    window.view_selecttype = $("#type");
    window.view_selectfigure = $("#figure");
    window.view_startbutton = $("#start");
    window.view_SELECTIONPANEL = $("#SELECTIONPANEL");
    window.view_PAPER = $("#PAPER");
    window.view_TABLET = $("#TABLET");
    window.view_REFLEX = $("#REFLEX");
    window.view_PAPER_time = $("#time");
    window.view_PAPER_items = $("#items");
    window.view_TABLET_left = $("#TABLET_left");
    window.view_TABLET_right = $("#TABLET_right");
    window.view_REFLEX_up = $("#REFLEX_up .col-12");

    /*app.user = "p1";
    app.type = "REFLEX";
    app.figure = "camel";
    StartApp();*/

    window.view_startbutton.on("click", function () {
        StartApp();
    });

    $(document).on("click", function () {
        $("video").get(0).play();
    });


});


function StartApp() {
    console.log("start!");
    console.log(window.view_selectuser.val());
    app.user = window.view_selectuser.val();
    app.type = window.view_selecttype.val();
    app.figure = window.view_selectfigure.val();
    if (app.user == 0) {
        window.alert("Seleziona utente");
    } else if (app.type == 0) {
        window.alert("Seleziona modalità di interazione");
    } else if (app.figure == 0) {
        window.alert("Seleziona figura");
    } else {
        tools.play = true;
        window.view_SELECTIONPANEL.hide();
        $("#" + app.type).show();
        LoadItems();
        console.log(app);
        app.currentTime = 0;
        app.correctitems = 0;
        tools.timer = window.setInterval(function () {
            tickTimer();
        }, 100);
    }
}

function LoadItems() {
    if (app.type == "PAPER") {
        return null;
    } else if (app.type == "TABLET") {

        $("#green").freetrans({
            x: 25,
            y: 32,
            angle: 180
        });

        $("#yellow").freetrans({
            x: 430,
            y: 395,
            angle: 180
        });

        $("#red").freetrans({
            x: 25,
            y: 205,
            angle: 180
        });

        $("#blue").freetrans({
            x: 280,
            y: 10,
            angle: 180
        });

        $("#orange").freetrans({
            x: 350,
            y: 244,
            angle: 180
        });

        $("#purple").freetrans({
            x: 230,
            y: 425,
            angle: 180
        });

        $("#lightblue").freetrans({
            x: 25,
            y: 425,
            angle: 180
        });

        $(".ft-container").addClass("frozen");
        window.selecteditem = "";
        var img = "<img src='assets/img/" + app.figure + ".png'>";
        window.view_TABLET_right.html(img);

        $(".ft-container.frozen").on("click", function () {
            CLICK(this);

        })

        /*var b = $('.rotable').freetrans('getBounds');
        console.log(b.xmin, b.ymax, b.height, b.center.x);*/


    } else if (app.type == "REFLEX") {

        //var img = "<img src='assets/img/" + app.figure + ".svg'>";
        $(window.view_REFLEX_up).load("assets/img/" + app.figure + ".svg", function () {
            var width = window.view_REFLEX_up.innerWidth();
            window.view_REFLEX_up_svg = $("#REFLEX_up svg");
            window.view_REFLEX_up_svg.css("height", 0.9 * window.view_REFLEX_up.innerHeight());
            window.view_REFLEX_up_svg.css("margin-top", 0.05 * window.view_REFLEX_up.innerHeight());
            var imgwidth = window.view_REFLEX_up_svg.innerWidth();
            window.view_REFLEX_up_svg.css("margin-left", (width - imgwidth) / 2);

            window.reflexitems = window.view_REFLEX_up_svg.find("polygon,rect");

            window.reflexitems_selected = 0;
            REFLEX_blink();
        });

    }
}

function REFLEX_blink() {

    $(".reflex_blink").removeClass("reflex_blink");
    $(window.reflexitems[window.reflexitems_selected]).addClass("reflex_blink");

}

function REFLEX_block() {

    $(window.reflexitems[window.reflexitems_selected]).addClass("reflex_block");
    if (window.reflexitems_selected == 6) {
        window.reflexitems_selected = 0;
    } else {
        window.reflexitems_selected++;
    }
    REFLEX_blink();
}

function CLICK(thiss) {
    console.log("AHIA!!!");
    if (window.selecteditem == "") {
        window.selecteditem = $(thiss).find("img").attr("id");
        $(thiss).removeClass("frozen");
    } else {
        console.log("non puoi, item è " + window.selecteditem);
    }
}

function tickTimer() {
    app.currentTime += 100;
    window.view_PAPER_time.text(app.currentTime / 1000);
    if (app.currentTime == app.maxTime) {
        StopApp("time");
    }
}

function StopApp(why) {
    app.whystop = why;
    console.log("stop: " + why, app.itemtime);
    clearInterval(tools.timer);
    tools.play = false;

    var data = {
        "request": "logSession",
        "email": "reflex@reflex.com",
        "token": "reflex",
        "data": {
            "app_id": "APP_REFLX2",
            "activity_id": "ReflexStudioF&A",
            "server_id": "Micol/Leonardo",
            "client_id": window.app.user,
            "start_configuration": window.app.type,
            "live_configuration": window.app.figure,
            "notes": JSON.stringify(window.app),
            "data": JSON.stringify(window.app.itemtime)
        }
    };


    window.api_url = "http://abilia.org/api/";
    $.ajax({
        url: window.api_url,
        type: "POST",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data),

        success: function (data) {
            console.log(data);

            window.setTimeout(function () {
                window.alert('Ho salvato i dati di ' + app.user + ' in ' + app.type + ' della figura ' + app.figure);
                window.location.reload();

            }, 3000);

        },
        error: function (request, error) {
            alert('An error occurred ' + error);
            console.log(request, error);
        }
    });
}

window.onkeydown = function (e) {
    e.preventDefault();
    $("video").get(0).play();
}

$(document).on("contextmenu", function () {
    return false;
});

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    console.log("Key Pressed: " + key);
    //window.alert(key);
    if (key == 116) {
        if (tools.play) {
            if (app.type == "PAPER") {
                increaseCorrectItems();
            } else if (app.type == "TABLET") {
                window.lastitem = window.selecteditem;
                $(".ft-container").find("#" + window.selecteditem).parent().addClass("final").off("click");
                window.selecteditem = "";
                console.log("annullo item");
                increaseCorrectItems();
            } else if (app.type == "REFLEX") {
                REFLEX_block();

                $("#video_happy").show();
                $("audio").attr("src", "assets/sound/" + getRandomInt(3) + ".mp3");
                $("audio").get(0).play();
                window.setTimeout(function () {
                    $("#video_happy").hide();
                }, 3000);
                increaseCorrectItems();
            }
        }
    }

    if (key == 66) {
        if (tools.play) {
            if (app.type == "PAPER") {
                decreaseCorrectItems();
            } else if (app.type == "TABLET") {
                decreaseCorrectItems();
                window.selecteditem = window.lastitem;
                $(".ft-container").find("#" + window.selecteditem).parent().removeClass("final").on("click", function () {
                    CLICK(this);
                })
            }

        }
    }

    if (key == 34) {
        if (tools.play) {
            if (app.type == "REFLEX") {

                if (window.reflexitems_selected == 6) {
                    window.reflexitems_selected = 0;
                } else {
                    window.reflexitems_selected++;
                }
                REFLEX_blink();

            }
        }
    }

    if (key == 33) {
        if (tools.play) {
            if (app.type == "REFLEX") {

                if (window.reflexitems_selected == 0) {
                    window.reflexitems_selected = 6;
                } else {
                    window.reflexitems_selected--;
                }
                REFLEX_blink();

            }
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function increaseCorrectItems() {
    app.correctitems++;
    app.itemtime.push(app.currentTime / 1000);
    window.view_PAPER_items.text(app.correctitems + "/7");
    if (app.correctitems >= app.totalItems) {
        StopApp("items");

        /*$("audio").attr("src", "assets/sound/happy.mp3");
        $("audio").get(0).play();*/

    }
}

function decreaseCorrectItems() {
    if (app.correctitems != 0) {
        app.correctitems--;
        app.itemtime.pop();
        window.view_PAPER_items.text(app.correctitems + "/7");
    }

}
