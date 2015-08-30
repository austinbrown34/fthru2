var HeaderHeight = 47;

var ANDROID_DEVICE = 1;
var IOS_DEVICE = 2;
var UNKNOWN_DEVICE = 3;

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    }
}

function DetectDevice() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("android") > -1)
        return ANDROID_DEVICE;
    else if (ua.indexOf('ip') > -1)
        return IOS_DEVICE;

    return UNKNOWN_DEVICE;
}
var DevicePlatform = DetectDevice();

var isOrientationChanged = false;

var BODY_HEIGHT = 0;

//
function hideURLbar(callback) {
    if (!window.PhoneGap)
        $('#setHeight').toggle();

    setTimeout(function () {
        window.scrollTo(0, DevicePlatform == ANDROID_DEVICE ? 1 : 0);
        setTimeout(function () {
            window.BODY_HEIGHT = Math.max($(window).height(), window.innerHeight);
            if (callback != undefined)
               callback();
        }, window.isOrientationChanged ? 500 : 500);
    }, 100);
}

function ShowLoader(callback) {

    if (!$('div').is('#preloader')) {
        $('body').append('<div id="preloader"><div id="preloader-img"></div>');
        $('#preloader').css('height', (window.screen.height + (DevicePlatform == ANDROID_DEVICE ? 60 : 0)) + 'px');
        //.css('background-color', '#FFFFFF');

        var opts = {
            lines:12, // The number of lines to draw
            length:4, // The length of each line
            width:2, // The line thickness
            radius:5, // The radius of the inner circle
            rotate:0, // The rotation offset
            color:'#000', // #rgb or #rrggbb
            speed:1, // Rounds per second
            trail:21, // Afterglow percentage
            shadow:false, // Whether to render a shadow
            hwaccel:false, // Whether to use hardware acceleration
            className:'spinner', // The CSS class to assign to the spinner
            zIndex:2e9, // The z-index (defaults to 2000000000)
            top:'auto', // Top position relative to parent in px
            left:'auto' // Left position relative to parent in px
        };
        var target = window.document.getElementById('preloader-img');
        var spinner = new Spinner(opts).spin(target);
        $('#preloader-img').center($('#preloader'));

    } else {
        //var headerH = window.document.getElementById('header').offsetHeight;
        var headerH = $('#' + Page + '_page .header').height();
        var footerH = window.document.getElementById('footer').offsetHeight;
        var wrapperH = window.innerHeight - headerH - footerH;
        //height(window.BODY_HEIGHT - headerH - footerH)
        $('#preloader').height(window.BODY_HEIGHT - headerH - footerH).css('top', headerH + 'px').css('bottom', footerH + 'px');
        $('#preloader-img').center($('#preloader'));
    }

    $('#preloader').toggle();

    hideURLbar(function () {
        callback();
    });
}


var needLoadImages = true;
//
function HideLoader() {

    if (window.PhoneGap && !window.networkEnabled) needLoadImages = false;
    if (needLoadImages) {
        var qLimages = [];
        var qLimageContainer;
        var qLimageCounter = qLdone = 0;
        var qLdestroyed = false;

        var findImageInElement = function (element) {
            var url = "";

            if ($(element).css("background-image") != "initial") {
                if ($(element).css("background-image") != "none")
                    var url = $(element).css("background-image");

            } else if (typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img")
                var url = $(element).attr("src");

            if (url.indexOf("gradient") == -1) {
                url = url.replace(/url\(\"/g, "");
                url = url.replace(/url\(\'/g, "");
                url = url.replace(/url\(/g, "");
                url = url.replace(/\"\)/g, "");
                url = url.replace(/\'\)/g, "");
                url = url.replace(/\)/g, "");

                var urls = url.split(", ");

                for (var i = 0; i < urls.length; i++) {
                    if (urls[i].length > 0 && qLimages.indexOf(urls[i]) == -1) {
                        var extra = "";
                        if ($.browser.msie && $.browser.version < 9)
                            extra = "?" + Math.floor(Math.random() * 3000);

                        qLimages.push(urls[i] + extra);
                    }
                }
            }
        }

        var createPreloadContainer = function () {
            qLimageContainer = $("<div></div>").appendTo("body").css({
                display:"none",
                width:0,
                height:0,
                overflow:"hidden"
            });
            //alert(print_r(qLimages));
            for (var i = 0; qLimages.length > i; i++) {
                $.ajax({
                    url:qLimages[i],
                    type:'HEAD',
                    success:function (data) {
                        if (!qLdestroyed) {
                            qLimageCounter++;
                            addImageForPreload(this['url']);
                        }
                    }
                });
            }
        };

        var addImageForPreload = function (url) {
            var image = $("<img />").attr("src", url).bind("load",function () {
                if (++qLdone == qLimageCounter) {
                    $(qLimageContainer).remove();
                    qLdestroyed = true;

                    //setToolBars();
                    
                    setTimeout(
                        function () {
                            activeTouch.touch = 0;
                            activeTouch.page = '';
                            $('#setHeight').toggle();
                            $('#preloader').toggle()
                        },
                        30
                    );
                }
            }).appendTo(qLimageContainer);
        };


        $("*:not(script)").each(function () {
            findImageInElement(this);
        });
        createPreloadContainer();

        needLoadImages = false;

    }
    else {
        //setToolBars();
        
        setTimeout(
            function () {
                window.activeTouch.touch = 0;
                window.activeTouch.page = '';
                $('#setHeight').toggle();
                $('#preloader').toggle()
            },
            50
        );
    }

    initScroll();
}