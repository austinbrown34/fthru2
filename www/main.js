
// App Version number
//var appVersion = '<span style="font-size: 50%;">&nbsp;&mdash;&nbsp;v.&nbsp;0.0.0</span>';
var appVersion = '';

//networkEnabled- true when internet connection is enabled
var networkEnabled = false;

//
var currPosition = {};

// Id of authoricated user
var authUser = false;

// Native or Mobile
var PhoneGap = (window.cordova != undefined) ? true : false;

// Device DataBase object
var dbShell;
var DB = false;

// Check for support localStorage true/false
var hasLocalStorage = (function () {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}());

var needStateChangeBind = true;

//
(function (window, undefined) {
    //
    var History = window.History,
        document = window.document;

    // Check
    if (!History.enabled) {
        throw new Error('History.js is disabled');
    }

    // Prepare
    History.options.debug = false;

    // Bind to StateChange Event

    History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate
        if (needStateChangeBind) {
            var State = History.getState(); // Note: We are using History.getState() instead of event.state
            parseUrlQuery(State.url);
            engine();
        }
    });
})(window);


// Curent Date object
var date = new Date();

// Content time-out's, for read from localStorage or from Internet with API
var newsTimeOut = 3600 * 1000;
var servicesTimeOut = 3600 * 12 * 1000 * 1000000;
var bannersTimeOut = 3600 * 1000;
var locatorTimeOut = 3600 * 24 * 1000;

// Timestamp data entry in a local store
var newsWritingTime = 0;
var servicesWritingTime = 0;
var bannersWritingTime = 0;
var locatorWritingTime = 0;

// GET object. look function parseUrlQuery()
var GET = {};

// show footer on page. true/false
var showFooter = true;

var filterStr = '';
var cars = {};

// Browser capabilities
isAndroid = (/android/gi).test(navigator.appVersion);
isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);
isWP75Dev = (/MSIE/gi).test(navigator.appVersion);

var locatorEngine = "unknown";


// Redirect when Non-auth user
getUserAuth();

// iScroll objects
var myScroll;
var newsSlide;
var horScroll, horScroll2;

var carSlider = {
    oldCarOldPageX:0,
    newCarOldPageX:0,
    oldCarOldLength:0,
    newCarOldLength:0
};

var path = {
    // This scary looking regular expression parses an absolute URL or its relative
    // variants (protocol, site, document, query, and hash), into the various
    // components (protocol, host, path, query, fragment, etc that make up the
    // URL as well as some other commonly used sub-parts. When used with RegExp.exec()
    // or String.match, it parses the URL into a results array that looks like this:
    //
    //     [0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content
    //     [1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
    //     [2]: http://jblas:password@mycompany.com:8080/mail/inbox
    //     [3]: http://jblas:password@mycompany.com:8080
    //     [4]: http:
    //     [5]: //
    //     [6]: jblas:password@mycompany.com:8080
    //     [7]: jblas:password
    //     [8]: jblas
    //     [9]: password
    //    [10]: mycompany.com:8080
    //    [11]: mycompany.com
    //    [12]: 8080
    //    [13]: /mail/inbox
    //    [14]: /mail/
    //    [15]: inbox
    //    [16]: ?msg=1234&type=unread
    //    [17]: #msg-content
    //
    urlParseRE:/^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,

    //Parse a URL into a structure that allows easy access to
    //all of the URL components by name.
    parseUrl:function (url) {
        // If we're passed an object, we'll assume that it is
        // a parsed url object and just return it back to the caller.
        if ($.type(url) === "object") {
            return url;
        }

        var matches = path.urlParseRE.exec(url || "") || [];

        // Create an object that allows the caller to access the sub-matches
        // by name. Note that IE returns an empty string instead of undefined,
        // like all other browsers do, so we normalize everything so its consistent
        // no matter what browser we're running on.
        return {
            href:matches[  0 ] || "",
            hrefNoHash:matches[  1 ] || "",
            hrefNoSearch:matches[  2 ] || "",
            domain:matches[  3 ] || "",
            protocol:matches[  4 ] || "",
            doubleSlash:matches[  5 ] || "",
            authority:matches[  6 ] || "",
            username:matches[  8 ] || "",
            password:matches[  9 ] || "",
            host:matches[ 10 ] || "",
            hostname:matches[ 11 ] || "",
            port:matches[ 12 ] || "",
            pathname:matches[ 13 ] || "",
            directory:matches[ 14 ] || "",
            filename:matches[ 15 ] || "",
            search:matches[ 16 ] || "",
            hash:matches[ 17 ] || ""
        };
    },

    //Turn relPath into an asbolute path. absPath is
    //an optional absolute path which describes what
    //relPath is relative to.
    makePathAbsolute:function (relPath, absPath) {
        if (relPath && relPath.charAt(0) === "/") {
            return relPath;
        }

        relPath = relPath || "";
        absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";

        var absStack = absPath ? absPath.split("/") : [],
            relStack = relPath.split("/");
        for (var i = 0; i < relStack.length; i++) {
            var d = relStack[ i ];
            switch (d) {
                case ".":
                    break;
                case "..":
                    if (absStack.length) {
                        absStack.pop();
                    }
                    break;
                default:
                    absStack.push(d);
                    break;
            }
        }
        return "/" + absStack.join("/");
    },

    //Returns true if both urls have the same domain.
    isSameDomain:function (absUrl1, absUrl2) {
        return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
    },

    //Returns true for any relative variant.
    isRelativeUrl:function (url) {
        // All relative Url variants have one thing in common, no protocol.
        return path.parseUrl(url).protocol === "";
    },

    //Returns true for an absolute url.
    isAbsoluteUrl:function (url) {
        return path.parseUrl(url).protocol !== "";
    },

    //Turn the specified realtive URL into an absolute one. This function
    //can handle all relative variants (protocol, site, document, query, fragment).
    makeUrlAbsolute:function (relUrl, absUrl) {
        if (!path.isRelativeUrl(relUrl)) {
            return relUrl;
        }

        var relObj = path.parseUrl(relUrl),
            absObj = path.parseUrl(absUrl),
            protocol = relObj.protocol || absObj.protocol,
            doubleSlash = relObj.protocol ? relObj.doubleSlash : ( relObj.doubleSlash || absObj.doubleSlash ),
            authority = relObj.authority || absObj.authority,
            hasPath = relObj.pathname !== "",
            pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname),
            search = relObj.search || ( !hasPath && absObj.search ) || "",
            hash = relObj.hash;

        return protocol + doubleSlash + authority + pathname + search + hash;
    },

    //Add search (aka query) params to the specified url.
    addSearchParams:function (url, params) {
        var u = path.parseUrl(url),
            p = ( typeof params === "object" ) ? $.param(params) : params,
            s = u.search || "?";
        return u.hrefNoSearch + s + ( s.charAt(s.length - 1) !== "?" ? "&" : "" ) + p + ( u.hash || "" );
    },

    convertUrlToDataUrl:function (absUrl) {
        var u = path.parseUrl(absUrl);
        if (path.isEmbeddedPage(u)) {
            // For embedded pages, remove the dialog hash key as in getFilePath(),
            // otherwise the Data Url won't match the id of the embedded Page.
            return u.hash.split(dialogHashKey)[0].replace(/^#/, "");
        } else if (path.isSameDomain(u, documentBase)) {
            return u.hrefNoHash.replace(documentBase.domain, "");
        }
        return absUrl;
    },

    //get path from current hash, or from a file path
    get:function (newPath) {
        if (newPath === undefined) {
            newPath = location.hash;
        }
        return path.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, '');
    },

    //return the substring of a filepath before the sub-page key, for making a server request
    getFilePath:function (path) {
        var splitkey = '&' + $.mobile.subPageUrlKey;
        return path && path.split(splitkey)[0].split(dialogHashKey)[0];
    },

    //set location hash to path
    set:function (path) {
        location.hash = path;
    },

    //test if a given url (string) is a path
    //NOTE might be exceptionally naive
    isPath:function (url) {
        return ( /\// ).test(url);
    },

    //return a url path with the window's location protocol/hostname/pathname removed
    clean:function (url) {
        return url.replace(documentBase.domain, "");
    },

    //just return the url without an initial #
    stripHash:function (url) {
        return url.replace(/^#/, "");
    },

    //remove the preceding hash, any query params, and dialog notations
    cleanHash:function (hash) {
        return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
    },

    //check whether a url is referencing the same domain, or an external domain or different protocol
    //could be mailto, etc
    isExternal:function (url) {
        var u = path.parseUrl(url);
        return u.protocol && u.domain !== documentUrl.domain ? true : false;
    },

    hasProtocol:function (url) {
        return ( /^(:?\w+:)/ ).test(url);
    },

    //check if the specified url refers to the first page in the main application document.
    isFirstPageUrl:function (url) {
        // We only deal with absolute paths.
        var u = path.parseUrl(path.makeUrlAbsolute(url, documentBase)),

        // Does the url have the same path as the document?
            samePath = u.hrefNoHash === documentUrl.hrefNoHash || ( documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash ),

        // Get the first page element.
            fp = $.mobile.firstPage,

        // Get the id of the first page element if it has one.
            fpId = fp && fp[0] ? fp[0].id : undefined;

        // The url refers to the first page if the path matches the document and
        // it either has no hash value, or the hash is exactly equal to the id of the
        // first page element.
        return samePath && ( !u.hash || u.hash === "#" || ( fpId && u.hash.replace(/^#/, "") === fpId ) );
    },

    isEmbeddedPage:function (url) {
        var u = path.parseUrl(url);

        //if the path is absolute, then we need to compare the url against
        //both the documentUrl and the documentBase. The main reason for this
        //is that links embedded within external documents will refer to the
        //application document, whereas links embedded within the application
        //document will be resolved against the document base.
        if (u.protocol !== "") {
            return ( u.hash && ( u.hrefNoHash === documentUrl.hrefNoHash || ( documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash ) ) );
        }
        return (/^#/).test(u.href);
    }
}

// Wait for Cordova to load
function bindEvent(el, eventName, eventHandler) {
    if (el.addEventListener)
        el.addEventListener(eventName, eventHandler, false);
    else if (el.attachEvent)
        el.attachEvent('on' + eventName, eventHandler);
}
bindEvent(document, "deviceready", onDeviceReady);

//
function runApplication() {
    window.isOrientationChanged = true;
    setNetworkState();

    ShowLoader(function () {
        $.ajax({
            type:"GET",
            url:"html/popups.html",
            dataType:"html",
            async:false,
            success:function (html) {
                $("#popups").prepend(html);
                loadRootPages();
                engine();
                $('ul.fmenu li').removeClass('fnav-active');
                $("#fnav-item-" + Page).addClass('fnav-active');
                window.activeTouch.page = Page;

                 HideLoader();

                window.isOrientationChanged = false;

                InitHeaderEvents();
            }
        });
    });
}

//
$(document).ready(function () {
    if (!PhoneGap)
        runApplication();
});

// Check for compliance the current object with object database device
function isObjectDB(x) {
    if (x == null) return false;
    return {}.toString.call(x) == "[object Database]" ? true : false;
}

// On Device Ready event
function onDeviceReady() {
    dbShell = window.openDatabase("rolfDB", "1.0", "Rolf demo DB", 200000);
    DB = isObjectDB(dbShell);

    if (DB)
        dbShell.transaction(setupTable, dbErrorHandler);
    else if (!DB && hasLocalStorage) {
        newsWritingTime = parseInt(window.localStorage.getItem("newsWritingTime"));
        servicesWritingTime = parseInt(window.localStorage.getItem("servicesWritingTime"));
        bannersWritingTime = parseInt(window.localStorage.getItem("bannersWritingTime"));
        locatorWritingTime = parseInt(window.localStorage.getItem("locatorWritingTime"));
    }

    navigator.geolocation.getCurrentPosition(function (p) {
        window.currPosition = p.coords;
    });

    runApplication();
}

// Current Url object & HTML Template name
var UrlObj, Page;

/*
 * Set global variable:
 * - Page (template name)
 * - UrlObj (look path object)
 * - GET
 * Parse URL to GET object
 *
 **/
function parseUrlQuery(url) {

    url = url ? url : window.location.href;
    UrlObj = path.parseUrl(url);
    //alert(print_r(UrlObj));
    Page = UrlObj.filename != "" ? UrlObj.filename.substr(0, UrlObj.filename.indexOf(".")) : "index";

    GET = {};

    //url = url ? url : document.location.href;
    url = url.split("?")[1];

    if (!url)
        return false;

    var pair = url.split('&');
    for (var i = 0; i < pair.length; i++) {
        var param = pair[i].split('=');
        GET[param[0]] = param[1] != undefined ? param[1] : '';
    }
}
parseUrlQuery();

// Formatted output object structure
function print_r(arr, level) {
    var print_red_text = "";
    if (!level) level = 0;
    var level_padding = "";
    for (var j = 0; j < level + 1; j++) level_padding += "    ";
    if (typeof(arr) == 'object') {
        for (var item in arr) {
            var value = arr[item];
            if (typeof(value) == 'object') {
                print_red_text += level_padding + "'" + item + "' :\n";
                print_red_text += print_r(value, level + 1);
            }
            else
                print_red_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
        }
    }

    else  print_red_text = "===>" + arr + "<===(" + typeof(arr) + ")";
    return print_red_text;
}

// Get Cookie
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined
}

// Set Cookie
function setCookie(name, value, props) {
    props = props || {}
    var exp = props.expires
    if (typeof exp == "number" && exp) {
        var d = new Date()
        d.setTime(d.getTime() + exp * 1000)
        exp = props.expires = d
    }
    if (exp && exp.toUTCString) {
        props.expires = exp.toUTCString()
    }

    value = encodeURIComponent(value)
    var updatedCookie = name + "=" + value
    for (var propName in props) {
        updatedCookie += "; " + propName
        var propValue = props[propName]
        if (propValue !== true) {
            updatedCookie += "=" + propValue
        }
    }
    document.cookie = updatedCookie
}

// Delete Cookie
function deleteCookie(name) {
    setCookie(name, null, {
        expires:-1
    });
}

/*
 * PhoneGap lib DataBase
 * create table if not exists
 * onDeviceReady
 **/
function setupTable(tx) {
    //tx.executeSql('DROP TABLE IF EXISTS WRITINGTIME');
    //tx.executeSql('DROP TABLE IF EXISTS NEWS');
    //tx.executeSql('DROP TABLE IF EXISTS SERVICES');
    //tx.executeSql('DROP TABLE IF EXISTS BANNERS');
    tx.executeSql('CREATE TABLE IF NOT EXISTS WRITINGTIME (name, created)');
    tx.executeSql('insert into WRITINGTIME (name, created) values("newsWritingTime", 0)');
    tx.executeSql('insert into WRITINGTIME (name, created) values("servicesWritingTime", 0)');
    tx.executeSql('insert into WRITINGTIME (name, created) values("bannersWritingTime", 0)');
    tx.executeSql('insert into WRITINGTIME (name, created) values("locatorWritingTime", 0)');

    tx.executeSql("CREATE TABLE IF NOT EXISTS NEWS (id INTEGER, header, small_content, content, image, created INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS BANNERS (id INTEGER, header, small_content, content, image, created INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS SERVICES (id INTEGER, header, small_content, content, image, created INTEGER, on_main INTEGER)");

    tx.executeSql("select * from WRITINGTIME", [], function (tx, data) {
        var len = data.rows.length;
        if (len > 0 && len < 5) {
            for (var i = 0; i < len; i++) {
                eval(data.rows.item(i).name + ' = ' + data.rows.item(i).created);
                window[data.rows.item(i).name] = data.rows.item(i).created;
            }
        }
    }, dbErrorHandler);

}

// show DB error alert
function dbErrorHandler(err) {
    alert("DB Error: " + err.message + "\nCode=" + err.code);
}

//
function onOnline() {
    networkEnabled = true;
}

//
function onOffline() {
    networkEnabled = false;
}

// Set global variable network state
function setNetworkState() {
    networkEnabled = window.PhoneGap ? navigator.network.connection.type == 'none' || navigator.network.connection.type == 'unknown' : true;
}

//
function getUserAuth() {

    var userId = hasLocalStorage ? window.localStorage.getItem("auth_user") : getCookie('auth_user');

    authUser = userId != undefined ? userId : 0;
}

//
function setUserAuth(state, userId, userName) {
    state = state ? 1 : 0;
    if (hasLocalStorage) {
        window.localStorage.setItem("auth_user", userId);
        window.localStorage.setItem("user_name", userName);
    }
    else {
        setCookie("auth_user", userId);
        setCookie("user_name", userName);
    }
    authUser = userId;
}

//
function AuthSuccess(userId, userName) {
    setUserAuth(true, userId, userName);
    //alert(Page);
    //document.location = Page + ".html";
    window.location.reload(true);
}

//
function AuthFail(error) {
    alert(error);
}

//
function Logout() {
    if (hasLocalStorage) {
        window.localStorage.removeItem("auth_user");
        window.localStorage.removeItem("user_name");
    }
    else {
        deleteCookie("auth_user");
        deleteCookie("user_name");
    }
    window.location.reload(true);
}

function setAutoHeight() {
    $('#newcars-resultwrapper').css('height', $('#newcars-scroller').height() + 'px');
    $('#oldcars-resultwrapper').css('height', $('#oldcars-scroller').height() + 'px');
    $('#wrapper:visible').css('height', $('.carsblock:visible').outerHeight() + 'px');
}

// Get, save and return object data of banners
function LoadBanners(callback) {
    if (window.PhoneGap) {
        if (DB && new Date().getTime() < (bannersWritingTime + bannersTimeOut)) {
            dbShell.transaction(
                function (tx) {
                    tx.executeSql("select * from BANNERS",
                        [],
                        function (tx, results) {
                            var data = {};
                            for (var i = 0; i < results.rows.length; i++) {
                                data[i] = results.rows.item(i);
                            }
                            callback(data);
                        },
                        dbErrorHandler);
                },
                dbErrorHandler);
            /**/
        }
        else if (hasLocalStorage && new Date().getTime() < (bannersWritingTime + bannersTimeOut)) {
            var data = JSON.parse(window.localStorage.getItem("banners"));
            callback(data);
        } else {
            $.ajax({
                url:'http://phonegap.qulix.com/api/rolf.demo/php/feeds.php?banners&count=4&callback=?',
                dataType:'json',
                async:false,
                success:function (data) {
                    if (DB) {
                        // empty table
                        // and write new data
                        dbShell.transaction(
                            function (tx) {
                                tx.executeSql('delete from BANNERS where id > 0');
                                for (var ind in data) {
                                    tx.executeSql('insert into BANNERS (id, header, small_content, content, image, created) values(?, ?, ?, ?, ?, ?)', [data[ind].id, data[ind].header, data[ind].small_content, data[ind].content, data[ind].image, data[ind].created], function () {
                                    }, dbErrorHandler);
                                }
                                //tx.executeSql(sql, dbErrorHandler);
                                tx.executeSql(
                                    'update WRITINGTIME set created=' + new Date().getTime() + ' where name="bannersWritingTime"',
                                    [],
                                    function () {
                                        bannersWritingTime = new Date().getTime();
                                    },
                                    dbErrorHandler
                                );
                            },
                            dbErrorHandler
                        );
                    }
                    else if (hasLocalStorage) {
                        window.localStorage.setItem("banners", JSON.stringify(data));
                        window.localStorage.setItem("bannersWritingTime", new Date().getTime());
                    }
                    callback(data);
                },
                error:function () {
                    callback({});
                }
            });
        }
    } else {
        if (hasLocalStorage && new Date().getTime() < (bannersWritingTime + bannersTimeOut)) {
            var data = JSON.parse(window.localStorage.getItem("banners"));
            callback(data);
        } else {
            $.ajax({
                url:'http://phonegap.qulix.com/api/rolf.demo/php/feeds.php?banners&count=4&callback=?',
                dataType:'json',
                async:false,
                success:function (data) {
                    window.localStorage.setItem("banners", JSON.stringify(data));
                    window.localStorage.setItem("bannersWritingTime", new Date().getTime());
                    callback(data);
                },
                error:function () {
                    callback({});
                }
            });
        }
    }
}

// Get, save and return object data of Services
function LoadServices(callback) {
    if (PhoneGap) {
        if (DB && new Date().getTime() < (servicesWritingTime + servicesTimeOut)) {
            dbShell.transaction(
                function (tx) {
                    tx.executeSql("select * from SERVICES",
                        [],
                        function (tx, results) {
                            var data = {};
                            for (var i = 0; i < results.rows.length; i++) {
                                data[i] = results.rows.item(i);
                            }
                            callback(data);
                        },
                        dbErrorHandler);
                },
                dbErrorHandler);
        } else if (hasLocalStorage && new Date().getTime() < (servicesWritingTime + servicesTimeOut)) {
            var data = JSON.parse(window.localStorage.getItem("services"));
            callback(data);
        } else {
            $.ajax({
                url:'http://phonegap.qulix.com/api/rolf.demo/php/feeds.php?services&callback=?',
                dataType:'json',
                async:false,
                success:function (data) {
                    if (DB) {
                        // empty table
                        // and write new data
                        dbShell.transaction(
                            function (tx) {
                                tx.executeSql('delete from SERVICES where id > 0');
                                for (var ind in data) {
                                    tx.executeSql('insert into SERVICES (id, header, small_content, content, image, created, on_main) values(?, ?, ?, ?, ?, ?, ?)', [data[ind].id, data[ind].header, data[ind].small_content, data[ind].content, data[ind].image, data[ind].created, data[ind].on_main], function () {
                                    }, dbErrorHandler);
                                }
                                tx.executeSql(
                                    'update WRITINGTIME set created=' + new Date().getTime() + ' where name="servicesWritingTime"',
                                    [],
                                    function () {
                                        servicesWritingTime = new Date().getTime();
                                    },
                                    dbErrorHandler
                                );
                            },
                            dbErrorHandler
                        );

                    }
                    else if (hasLocalStorage) {
                        window.localStorage.setItem("services", JSON.stringify(data));
                        window.localStorage.setItem("servicesWritingTime", new Date().getTime());
                    }
                    callback(data);
                },
                error:function () {
                    callback({});
                }
            });
        }
    } else {
        if (hasLocalStorage && new Date().getTime() < (servicesWritingTime + servicesTimeOut)) {
            var data = JSON.parse(window.localStorage.getItem("services"));
            callback(data);
        } else {
            $.ajax({
                url:'http://phonegap.qulix.com/api/rolf.demo/php/feeds.php?services&callback=?',
                dataType:'json',
                async:false,
                success:function (data) {
                    window.localStorage.setItem("services", JSON.stringify(data));
                    window.localStorage.setItem("servicesWritingTime", new Date().getTime());
                    callback(data);
                }
            });
        }
    }

}

// Get, save and return object data of news
function LoadNews(callback) {
    if (PhoneGap) {
        if (DB && new Date().getTime() < (newsWritingTime + newsTimeOut)) {
            dbShell.transaction(
                function (tx) {
                    tx.executeSql("select * from NEWS",
                        [],
                        function (tx, results) {
                            var data = {};
                            for (var i = 0; i < results.rows.length; i++) {
                                data[i] = results.rows.item(i);
                            }
                            callback(data);
                        },
                        dbErrorHandler);
                },
                dbErrorHandler);
        } else if (hasLocalStorage && new Date().getTime() < (newsWritingTime + newsTimeOut)) {
            var data = JSON.parse(window.localStorage.getItem("news"));
            callback(data);
        } else {
            $.ajax({
                url:'http://phonegap.qulix.com/api/rolf.demo/php/feeds.php?news&callback=?',
                dataType:'json',
                async:false,
                success:function (data) {
                    if (DB) {
                        // empty table
                        // and write new data
                        dbShell.transaction(
                            function (tx) {
                                tx.executeSql('delete from NEWS where id > 0');
                                for (var ind in data)
                                    tx.executeSql('insert into NEWS (id, header, small_content, content, image, created) values(?, ?, ?, ?, ?, ?)', [data[ind].id, data[ind].header, data[ind].small_content, data[ind].content, data[ind].image, data[ind].created], function () {
                                    }, dbErrorHandler);
                                tx.executeSql(
                                    'update WRITINGTIME set created=' + new Date().getTime() + ' where name="newsWritingTime"',
                                    [],
                                    function () {
                                        newsWritingTime = new Date().getTime();
                                    },
                                    dbErrorHandler
                                );
                            },
                            dbErrorHandler
                        );

                    }
                    else if (hasLocalStorage) {
                        window.localStorage.setItem("news", JSON.stringify(data));
                        window.localStorage.setItem("newsWritingTime", new Date().getTime());
                    }
                    callback(data);
                },
                error:function () {
                    callback({});
                }
            });
        }
    } else {
        if (hasLocalStorage && new Date().getTime() < (newsWritingTime + newsTimeOut)) {
            var data = JSON.parse(window.localStorage.getItem("news"));
            callback(data);
        } else {
            $.ajax({
                url:'http://phonegap.qulix.com/api/rolf.demo/php/feeds.php?news&callback=?',
                dataType:'json',
                async:false,
                success:function (data) {
                    window.localStorage.setItem("news", JSON.stringify(data));
                    window.localStorage.setItem("newsWritingTime", new Date().getTime());
                    callback(data);
                },
                error:function () {
                    callback({});
                }
            });
        }
    }
}

//
function LoadLocator(callback) {
    if (PhoneGap) {
        if (hasLocalStorage && new Date().getTime() < (locatorWritingTime + locatorTimeOut)) {
            var data = JSON.parse(window.localStorage.getItem("locator"));
            callback(data);
        } else {
            $.ajax({
                url:'http://phonegap.qulix.com/api/rolf.demo/php/dealers.php?callback=?',
                dataType:'json',
                async:false,
                success:function (data) {
                    window.localStorage.setItem("locator", JSON.stringify(data));
                    window.localStorage.setItem("locatorWritingTime", new Date().getTime());
                    callback(data);
                }
            });
        }
    } else {
        if (hasLocalStorage && new Date().getTime() < (locatorWritingTime + locatorTimeOut)) {
            var data = JSON.parse(window.localStorage.getItem("locator"));
            callback(data);
        } else {
            $.ajax({
                url:'http://phonegap.qulix.com/api/rolf.demo/php/dealers.php?callback=?',
                dataType:'json',
                async:false,
                success:function (data) {
                    window.localStorage.setItem("locator", JSON.stringify(data));
                    window.localStorage.setItem("locatorWritingTime", new Date().getTime());
                    callback(data);
                }
            });
        }
    }
}

//
function LoadDealers(callback) {
    $.getJSON("http://phonegap.qulix.com/api/rolf.demo/php/dealers.php?callback=?",
        {
            user_latitude:currPosition.latitude,
            user_longitude:currPosition.longitude
        },
        function (data) {
            callback(data);
        });
}

//
function authSubmit() {
    var login = $('#popups').find('#login').val();
    var password = $('#popups').find('#password').val();

    if (login.length && password.length) {
        $.getJSON("http://phonegap.qulix.com/api/rolf.demo/php/login.php?callback=?",
            {
                user_login:login,
                user_password:password
            },
            function (data) {
                if (data.error.length != 0)
                    AuthFail(data.error);
                else {
                    AuthSuccess(data.userId, data.name);
                }
            });
    }
}

//
function InitHeaderEvents() {

    $(".header-button").live("mousedown touchstart", function () {
        $(".header-button").removeClass('pressed');

        if ($(this).find('a').hasClass('action-auth'))
            $("a.action-auth").parents('.header-button').addClass('pressed');

        if ($(this).find('a').hasClass('action-dial'))
            $("a.action-dial").parents('.header-button').addClass('pressed');

        if ($(this).hasClass('logout'))
            $(this).addClass('pressed');
    });

    $(".header-button.back").live("mousedown touchstart", function () {
        $(".header-button").removeClass('pressed');
        $(this).addClass('pressed');
    });

    $(".faction-in a").live("mousedown touchstart", function () {
        $(".faction-in a").removeClass('pressed');
        $(this).addClass('pressed');
    });

    $(".enter-btn").live('mousedown touchstart',function () {
        authSubmit();
        return false;
    }).live('click', function () {
            return false;
        });

    $(".header-button.logout").live('mousedown touchstart',function () {
        Logout();
        return false;
    }).live('click', function () {
            return false;
        });


    $(".header-button.back a").live('mousedown touchstart',function () {
        needStateChangeBind = true;
        if ($(this).parents('.header-button.back').hasClass('pressed'))
            $(this).parents('.header-button.back').removeClass('pressed');

        ShowLoader(function () {
            $("#" + Page + "_page").remove();
            History.back();
            setTimeout(function () {
                $('ul.fmenu li').removeClass('fnav-active');
                $("#fnav-item-" + Page).addClass('fnav-active');

                if (($('div').is('#' + Page + '_page') && (Page == 'locator' || Page == 'services')) ||
                    ($('div').is('#' + Page + '_page') &&
                        (Page != 'index' ? (window[Page + 'WritingTime'] + window[Page + 'TimeOut']) > new Date().getTime() : (window['bannersWritingTime'] + window['bannersTimeOut']) > new Date().getTime()))) {
                    $("[data-role='page']").toggle();
                    $('#' + Page + '_page').toggle();
                    if (Page == 'index' || Page == 'news' || Page == 'services' || Page == 'locator') showFooter = true;
                    HideLoader();
                } else
                    engine();


            }, 500);
        });

        return false;
    }).live('click', function () {
            return false;
        });
    ;

    $(".header-button.message").live('mousedown touchstart', 'a',function () {
        $('#popups .pu-auth').css('display', 'none');
        if ($('#popups .pu-message').css("display") == 'block') {
            $("a.action-dial").parents('.header-button').removeClass('pressed');
            $('#popups .pu-message').toggle();
        }
        else
            $('#popups .pu-message').toggle();
        return false;
    }).live('click', function () {
            return false;
        });
    ;

    //auth btn
    $(".header-button.profile").live('mousedown touchstart', 'a',function () {
        $('#popups .pu-message').css('display', 'none');
        if ($('#popups .pu-auth').css("display") == 'block') {
            $("a.action-auth").parents('.header-button').removeClass('pressed');
            $('#popups .pu-auth').toggle();
        }
        else
            $('#popups .pu-auth').toggle();
        return false;
    }).live('click', function () {
            return false;
        });
    ;

    $('.header-button.refresh-list').live('mousedown touchstart',function () {

        window[Page + 'WritingTime'] = 0;
        if (hasLocalStorage)
            window.localStorage.setItem(Page + 'WritingTime', 0);

        ShowLoader(function () {
            engine();
        });
        return false;
    }).live('click', function () {
            return false;
        });
    ;

    $('.body-type li a').live('mousedown touchstart',function () {
        $(this).toggleClass('selected-carbody');
        return false;
    }).live('click', function () {
            return false;
        });
    ;

    $('.br-item').live('mousedown touchstart',function () {
        $(this).toggleClass('selected-br');
        return false;
    }).live('click', function () {
            return false;
        });
    ;

    $('.new-btn').live('mousedown touchstart',function () {
        $('.new-btn').addClass('active');
        $('.old-btn').removeClass('active');
        $('#oldcars-block').toggle();
        $('#newcars-block').toggle();
        setSliderWidth();
        setAutoHeight();
        return false;
    }).live('click', function () {
            return false;
        });
    ;

    $('.old-btn').live('mousedown touchstart',function () {
        $('.old-btn').addClass('active');
        $('.new-btn').removeClass('active');
        $('#oldcars-block').toggle();
        $('#newcars-block').toggle();
        setSliderWidth();
        setAutoHeight();
        return false;
    }).live('click', function () {
            return false;
        });

    $(".filter-action").live('mousedown touchstart',function () {
        $(this).toggleClass('f-pressed');
        $('.pu-filter').fadeToggle(100);
        $('.search-action').toggle();
        return false;
    }).live('click', function () {
            return false;
        });

    $('.search-action').live('mousedown touchstart',function () {
        filterStr = createFilterStr();
        $('.filter-action').toggleClass('f-pressed');
        $('.pu-filter').fadeToggle(100);
        $(this).removeClass('pressed');
        $('.search-action').toggle();
        ShowLoader(function () {
            LoadCars(function () {
                HideLoader();
            });
        });
        return false;
    }).live('click', function () {
            return false;
        });
    ;

    $(".cancel-action").live('mousedown touchstart',function () {
        $('.filter-action').toggleClass('f-pressed');
        $('.pu-filter').fadeToggle(100);
        $(this).removeClass('pressed');
        $('.cancel-action').toggle();
        return false;
    }).live('click', function () {
            return false;
        });
    ;

}

//Load to DOM Page template
function LoadTemplate(page_id, template_url, callback, rootLoad) {
    if (rootLoad == undefined)
        rootLoad = false;

    if (!rootLoad) {
        $('div[data-role="page"]').toggle();
        if (!$('div').is('#' + page_id))
            $('body').prepend('<div data-role="page" id="' + page_id + '"></div>');

        $('#' + page_id).toggle();
        var p = $('#' + page_id);

        $.ajax({
            url:template_url,
            contentType:'application/x-www-form-urlencoded; charset=UTF-8',
            isLocal:true,
            timeout:10000,
            dataType:"html",
            async:false,
            success:function (data) {
                $(p).html(data);
                $('.header-ttl').append(window.appVersion);
                callback(p);
            }
        });
    }
    else {
        $.ajax({
            url:template_url,
            contentType:'application/x-www-form-urlencoded; charset=UTF-8',
            isLocal:true,
            timeout:10000,
            dataType:"html",
            async:false,
            success:function (data) {
                var page = $('<div data-role="page" style="display:none;" id="' + page_id + '">' + data + '</div>');
                $('body').prepend(page);
                callback(page);
            }
        });
    }
}

// Hack slider width for iScroll
function setSliderWidth() {
    if ($('div').is("#bscroll-wrapper")) {
        $(".b-content").width($(window).width() - 16);
        $("#banner-scroller").width(function () {
            return $(".b-content").width() * $(".b-content").length
        });
    }

    if ($('div').is(".result-wrapper")) {
        var carspage = $('.carsblock:visible');

        var carlistWidth = $(carspage).find(".result-wrapper").outerWidth(true);
        $(carspage).find(".cars-scroller li").css("width", carlistWidth);

        var carsitemCount = $(carspage).find(".cars-scroller li").length;
        var allcarsWidth = carlistWidth * carsitemCount;
        $(carspage).find(".cars-scroller").css("width", allcarsWidth);
    }
}

// Centers the current element relative to the parent element
jQuery.fn.center = function (parent) {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(parent).height() - this.outerHeight()) / 2) +
        $(parent).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(parent).width() - this.outerWidth()) / 2) +
        $(parent).scrollLeft()) + "px");
    return this;
}

// type old|new
function LoadCarSlide(type, slideNum, currPage) {
    var carsData = type == 'new' ? window.cars.new_cars.data.slice(slideNum * 4, slideNum * 4 + 4) : window.cars.old_cars.data.slice(slideNum * 4, slideNum * 4 + 4);
    if (carsData.length) {
        var slide_width = horScroll.wrapperW;
        $('#' + type + 'cars-scroller').append('<li style="width:' + slide_width + 'px; "></li>');
        $('#' + type + 'cars-scroller').css('width', $('#' + type + 'cars-scroller').width() + slide_width + 'px');
        $('#' + type + 'cars-scroller li:last').setTemplateElement('tpl_cars_item');

        $('#' + type + 'cars-scroller li:last').processTemplate(carsData);
    }
}

//
function LoadCars(callback) {
    var cars_count = 0, new_count = 0, old_count = 0, new_slidesCount = 0, old_slidesCount = 0;
    filterStr = createFilterStr();

    $.ajax({
        url:'http://phonegap.qulix.com/api/rolf.demo/php/cars.php?' + (filterStr ? filterStr + '&' : '') + 'need_count=1&callback=?',
        dataType:'json',
        async:false,
        success:function (data) {
            cars_count = data.count;
            new_count = data.new_cars.count, old_count = data.old_cars.count;

            $('#newcars-block .result-count').html(new_count);
            $('#oldcars-block .result-count').html(old_count);

            new_slidesCount = Math.min(new_count / 4 + (new_count % 4 == 0 ? 0 : 1), 2);
            old_slidesCount = Math.min(old_count / 4 + (old_count % 4 == 0 ? 0 : 1), 2);
        }
    });

    $.ajax({
        url:'http://phonegap.qulix.com/api/rolf.demo/php/cars.php?' + (filterStr ? filterStr + '&' : '') + 'need_count=1&need_result=1&callback=?',
        dataType:'json',
        async:false,
        data:'',
        success:function (data) {
            window.cars = data;

            if ($('textarea').is('#tpl_cars_item')) {

                $('#newcars-scroller, #oldcars-scroller').html('');

                for (var slide_ind = 1, start = 0, end = 4; slide_ind <= new_slidesCount; slide_ind++, start = end, end = 4 * slide_ind) {
                    $('#newcars-scroller').append('<li></li>');
                    $('#newcars-scroller li:last').setTemplateElement('tpl_cars_item');
                    var newCarsData = data.new_cars.data.slice(start, end);
                    $('#newcars-scroller li:last').processTemplate(newCarsData);
                }

                for (var old_slide_ind = 1, start = 0, end = 4; old_slide_ind <= old_slidesCount; old_slide_ind++, start = end, end = 4 * old_slide_ind) {
                    $('#oldcars-scroller').append('<li></li>');
                    $('#oldcars-scroller li:last').setTemplateElement('tpl_cars_item');
                    var oldCarsData = data.old_cars.data.slice(start, end);
                    $('#oldcars-scroller li:last').processTemplate(oldCarsData);
                }

                if ($('div').is('.result-wrapper')) {

                    setTimeout(function () {
                        setSliderWidth();
                        horScroll = new iScroll('oldcars-resultwrapper', {
                            snap:true,
                            momentum:false,
                            useTransform:false,
                            checkDOMChanges:true,
                            vScroll:false,
                            vScrollbar:false,
                            onScrollEnd:function () {
                                if (this.currPageX != carSlider.oldCarOldPageX && carSlider.oldCarOldLength != this.pagesX.length) {
                                    LoadCarSlide('old', this.pagesX.length, this.currPageX);
                                    carSlider.oldCarOldPageX = this.currPageX;
                                    carSlider.oldCarOldLength = this.pagesX.length;
                                }
                            },
                            scrollbarClass:'myScrollbar'
                        });

                        horScroll2 = new iScroll('newcars-resultwrapper', {
                            snap:true,
                            momentum:false,
                            useTransform:false,
                            checkDOMChanges:true,
                            vScroll:false,
                            vScrollbar:false,
                            onScrollEnd:function () {
                                if (this.currPageX != carSlider.newCarOldPageX && carSlider.newCarOldLength != this.pagesX.length) {
                                    LoadCarSlide('new', this.pagesX.length, this.currPageX);
                                    carSlider.newCarOldPageX = this.currPageX;
                                    carSlider.newCarOldLength = this.pagesX.length;
                                }
                            },
                            scrollbarClass:'myScrollbar'
                        });

                        setAutoHeight();
                        callback();
                    }, 200);
                }
            }
        }
    });
}

// Hide Footer
function hideFooter() {
    $('#footer').toggle();
    var headerH = $('#' + Page + '_page .header').height();
    var wrapperH = window.innerHeight - headerH;
    $('#' + Page + '_page #wrapper').height(wrapperH + 'px');
}

//
function createFilterStr() {
    var filters = [];

    filters.push('price=' + $('#price_from').val() + '-' + $('#price_to').val());

    var brands_filter = [];
    $('ul.brands a.selected-br').each(function () {
        brands_filter.push($(this).attr('data-brand'));
    });

    if (brands_filter.length > 0)
        filters.push('brands=' + brands_filter.join('|'));

    return filters.join('&');
}

//
function engine(rootLoad, page_for_load) {
    if (rootLoad == undefined)
        rootLoad = false;
    if (page_for_load == undefined)
        page_for_load = Page;

    if (hasLocalStorage) {
        newsWritingTime = parseInt(window.localStorage.getItem("newsWritingTime"));
        servicesWritingTime = parseInt(window.localStorage.getItem("servicesWritingTime"));
        bannersWritingTime = parseInt(window.localStorage.getItem("bannersWritingTime"));
        locatorWritingTime = parseInt(window.localStorage.getItem("locatorWritingTime"));
    }

    if (Page == "locator" && GET.engine !== undefined && !rootLoad)
        Page = "locator_inner";

    if (!rootLoad)
        page_for_load = Page;

    LoadTemplate(page_for_load + '_page', authUser != 0 ? 'html/' + page_for_load + '.html' : 'html/' + page_for_load + '_noauth.html', function (page) {
        //setNetworkState();
        setToolBars();
        switch (page_for_load) {

            case "index" :

                showFooter = true;
                LoadBanners(function (data) {
                    if (data.length) {
                        for (var ind in data) {
                            data[ind].created = new Date(data[ind].created * 1000).toLocaleDateString();
                        }

                        if ($(page).find('textarea').is('#tpl-index-banner')) {
                            $(page).find('#banner-scroller').setTemplateElement('tpl-index-banner');
                            $(page).find('#banner-scroller').processTemplate(data);
                        }

                        var newsCount = $(page).find(".banner-item").length;
                        if (newsCount) {
                            for (var i = 0; i < newsCount; i++)
                                $(page).find("ul#indicate").append('<li class=""></li> ');

                            $(page).find("ul#indicate li:first").addClass('active-nav-point');

                            // banners slider
                            newsSlide = new iScroll('bscroll-wrapper', {
                                snap:true,
                                momentum:false,
                                hScrollbar:false,
                                useTransform:false,
                                checkDOMChanges:true,
                                onTouchEnd:function () {
                                    if ($('#indicate > li:nth-child(' + (this.currPageX + 1) + ')').length > 0) {
                                        document.querySelector('#indicate > li.active-nav-point').className = '';
                                        document.querySelector('#indicate > li:nth-child(' + (this.currPageX + 1) + ')').className = 'active-nav-point';
                                    }
                                }
                            });
                            setSliderWidth();
                        }

                        if (!rootLoad)
                            HideLoader();
                    } else
                        HideLoader();
                });
                break;

            case "service_item":

                showFooter = false;
                LoadServices(function (data) {
                    if (data.length) {
                        var item = null;

                        for (var ind in data)
                            if (data[ind].id == GET['id']) {
                                data[ind].created = new Date(data[ind].created * 1000).toLocaleDateString();
                                item = data[ind];
                                break;
                            }

                        if (!item)
                            return false;

                        if ($(page).find('textarea').is('#tpl-service-item')) {
                            $(page).find('#service_item').setTemplateElement('tpl-service-item');
                            $(page).find('#service_item').processTemplate(item);
                        }
                    }

                    HideLoader();

                });

                break;

            case "services" :

                showFooter = true;
                if (!rootLoad)
                    HideLoader();

                break;

            case "news_item":

                showFooter = false;
                LoadNews(function (data) {
                    if (data.length) {
                        var item = null;

                        for (var ind in data) {
                            if (PhoneGap && !networkEnabled) {
                                data[ind].image = 'images/cap_292x158.png';
                            }
                            if (data[ind].id == GET['id']) {
                                data[ind].created = new Date(data[ind].created * 1000).toLocaleDateString();
                                item = data[ind];
                                break;
                            }
                        }

                        if (!item)
                            return false;

                        if ($(page).find('textarea').is('#tpl-news-item')) {
                            $(page).find('#news_item').setTemplateElement('tpl-news-item');
                            $(page).find('#news_item').processTemplate(item);
                        }
                    }
                    HideLoader();
                });

                break;

            case "news" :

                showFooter = true;


                LoadNews(function (data) {
                    if (data.length) {
                        for (var ind in data) {
                            if (PhoneGap && !networkEnabled) {
                                data[ind].image = 'images/cap_138x147.png';
                            }
                            data[ind].created = new Date(data[ind].created * 1000).toLocaleDateString();
                        }
                        if ($(page).find('textarea').is('#tpl-news')) {
                            $(page).find('.news-list ul').setTemplateElement('tpl-news');
                            $(page).find('.news-list ul').processTemplate(data);
                        }

                        if (!rootLoad) {
                            HideLoader();
                        }
                    } else
                        HideLoader();
                });

                break;

            case "auto" :
                showFooter = false;
                if (authUser) {
                    LoadCars(function () {
                        HideLoader();
                    });
                }
                else
                    HideLoader();

                break;

            case "locator_inner":

                locatorEngine = GET.engine;
                //  getScript('http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0');

                showFooter = false;

                if (networkEnabled) {

                    // var mapJsUrl = locatorEngine == "yandex" ? 'http://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU'
                    // : 'https://maps.googleapis.com/maps/api/js?sensor=false';


                    // $.getScript(mapJsUrl, function () {

                    LoadLocator(function (data) {
                        LocatorDealersData = data;
                        if (GET.engine == 'yandex') {
                            if (!window.mapsLoadedY) {
                                $.getScript('http://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU', function () {
                                    window.mapsLoadedY = 1;
                                    InitLocatorMaps();
                                });
                            }
                            else
                                InitLocatorMaps();
                        }
                        else if (GET.engine == 'google') {
                            if (!window.mapsLoadedG)
                                $.getScript('https://maps.googleapis.com/maps/api/js?sensor=false&callback=initMapsG');
                            else
                                InitLocatorMaps();
                        }
                        /*
                         else {
                         var map = new Microsoft.Maps.Map(document.getElementById("map"),
                         {
                         credentials: "AiPmIXE5sZGoScFbhSiPpcIrokPbEGrvQl_vku0MekEIs18rT5Z3IxViwsk2nHN6",
                         center: new Microsoft.Maps.Location(
                         currPosition.latitude,
                         currPosition.longitude),
                         mapTypeId: Microsoft.Maps.MapTypeId.road,
                         zoom: 7
                         });
                         }
                         /**/

                        //setTimeout(function () {
                        //    HideLoader();
                        //}, 200)
                    });

                    //  });
                } else
                    HideLoader();

                break;

            case "purchase":

                showFooter = false;
                if (networkEnabled) {

                    LoadDealers(function (data) {
                        if (data.length) {
                            if ($(page).find('textarea').is('#tpl-dealers')) {
                                $(page).find('#dealers').setTemplateElement('tpl-dealers');
                                $(page).find('#dealers').processTemplate(data);
                            }

                            $('#purchase_page .services-list a').click(function () {
                                return false;
                            });
                        }

                        HideLoader();
                    });

                }
                else HideLoader();

                break;

            case "accessories":
                showFooter = false;
                $('#accessories_page .services-list a').click(function () {
                    return false;
                });
                HideLoader();

                break;

            case "technical":
                showFooter = false;
                HideLoader();

                break;

            case "locator":

                showFooter = true;
                if (!rootLoad) {
                    HideLoader();
                }

                break;

            default:
                HideLoader();
        }
    }, rootLoad);
}

var LocatorDealersData = null;

function initMapsG() {
    window.mapsLoadedG = 1;
    InitLocatorMaps();
}

var mapsLoadedY = 0;
var mapsLoadedG = 0;

function InitLocatorMaps() {

    showFooter = false;
    if (locatorEngine == "yandex") {

        // Ðº ÑÑ‚Ð¾Ð¼Ñƒ Ð¼Ð¾Ð¼ÐµÐ½Ñ‚Ñƒ Ð°Ð¿Ð¸ Ð·Ð°Ð³Ñ€ÑƒÐ·Ð¸Ð»ÑÑ
        ymaps.ready(function () {
            // Ðº ÑÑ‚Ð¾Ð¼Ñƒ Ð¼Ð¾Ð¼ÐµÐ½Ñ‚Ñƒ Ð°Ð¿Ð¸ Ð¿Ñ€Ð¾Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð»ÑÑ

            $('.ymaps-map').remove();

            if (!window.currPosition.latitude && !window.currPosition.longitude) {
                window.currPosition.latitude = 55.76;
                window.currPosition.longitude = 37.64;
            }
            var myMap = new ymaps.Map('map', {
                center:[window.currPosition.latitude, window.currPosition.longitude],
                zoom:12
            });
            var myPlacemark = new ymaps.Placemark([window.currPosition.latitude, window.currPosition.longitude], {
                balloonContent:'Ð¢ÐµÐºÑƒÑ‰ÐµÐµ Ð¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ.'
            }, {
                iconImageHref:'images/current_location_icon.png', // ÐºÐ°Ñ€Ñ‚Ð¸Ð½ÐºÐ° Ð¸ÐºÐ¾Ð½ÐºÐ¸
                iconImageSize:[22, 40], // Ñ€Ð°Ð·Ð¼ÐµÑ€Ñ‹ ÐºÐ°Ñ€Ñ‚Ð¸Ð½ÐºÐ¸
                iconImageOffset:[-11, -20] // ÑÐ¼ÐµÑ‰ÐµÐ½Ð¸Ðµ ÐºÐ°Ñ€Ñ‚Ð¸Ð½ÐºÐ¸
            });
            myMap.geoObjects.add(myPlacemark);

            $.each(LocatorDealersData, function (i, marker) {
                myMap.geoObjects.add(new ymaps.Placemark(
                    [marker.coords.lat, marker.coords.lon],
                    {
                        // Ð¡Ð²Ð¾Ð¹ÑÑ‚Ð²Ð°
                        //iconContent: 'Ð©ÐµÐ»ÐºÐ½Ð¸ Ð¿Ð¾ Ð¼Ð½Ðµ',
                        balloonContentHeader:'<h1>' + marker.name + '</h1>',
                        balloonContentBody:'<p>' + marker.address + ' (' + marker.phone + ')' + '</p>',
                        balloonContentFooter:'<p>Ð Ð°ÑÑÑ‚Ð¾ÑÐ½Ð¸Ðµ: ' + marker.distance + ' Ð¼ÐµÑ‚Ñ€Ð¾Ð²' + '</p>'
                    }, {
                        // ÐžÐ¿Ñ†Ð¸Ð¸
                        preset:'twirl#blueStretchyIcon' // Ð¸ÐºÐ¾Ð½ÐºÐ° Ñ€Ð°ÑÑ‚ÑÐ³Ð¸Ð²Ð°ÐµÑ‚ÑÑ Ð¿Ð¾Ð´ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚
                    }));
            });

            myMap.controls.add('zoomControl').add('mapTools');
            /*
             myMap.controls.add('zoomControl').add('typeSelector').add('smallZoomControl', {
             right:5,
             top:75
             }).add('mapTools');
             myMap.controls.add(new ymaps.control.ScaleLine()).add(new ymaps.control.MiniMap({
             type:'yandex#publicMap'
             }));
             */
            HideLoader();
        });
    }
    else if (locatorEngine == "google") {
        var map;
        var cPos = new google.maps.LatLng(
            currPosition.latitude,
            currPosition.longitude);
        var mapOptions = {
            zoom:12,
            center:cPos,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map'),
            mapOptions);

        var cMarker = new google.maps.Marker({
            position:cPos,
            map:map,
            icon:'images/current_location_icon.png'
        });

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);

        var windows = {};
        var oldWindow = null;

        $.each(LocatorDealersData, function (i, marker) {

            var dPos = new google.maps.LatLng(marker.coords.lat,
                marker.coords.lon);

            var dMarker = new google.maps.Marker({
                position:dPos,
                map:map,
                title:marker.content
            });

            google.maps.event.addListener(dMarker, 'click', function () {

                var request = {
                    origin:cPos,
                    destination:dPos,
                    travelMode:google.maps.DirectionsTravelMode.DRIVING
                };

                var distance = 0;

                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        distance = response.routes[0].legs[0].distance.value;

                        if (oldWindow != null)
                            oldWindow.close();

                        oldWindow = new google.maps.InfoWindow({
                            content:'<div class="dealer-info"' +
                                '<h1>' + marker.name + '</h1>' +
                                '<p>' + marker.address + ' (' + marker.phone + ')' + '</p>' +
                                '<p>Ð Ð°ÑÑÑ‚Ð¾ÑÐ½Ð¸Ðµ: ' + distance + ' Ð¼ÐµÑ‚Ñ€Ð¾Ð²' + '</p>' +
                                '</div>'
                        });
                        oldWindow.open(map, dMarker);
                    }
                });


            });
        });
        HideLoader();
    }
}

//
function setToolBars() {
    showFooter = (Page == 'index' || Page == 'news' || Page == 'services' || Page == 'locator') ? true : false;
    var footerH = 0;
    var headerH = $('#' + Page + '_page .header').height();

    if ($('div').is('.filter-block') && Page == 'auto') {
        var fH = $('.filter-block').height();
        headerH = headerH + fH;
        $('#wrapper').css('top', headerH + 'px');
    }

    if ($('.footer').is(':visible') && showFooter)
        $('.footer').toggle();
    else if ($('.footer').is(":visible") && !showFooter)
        $('.footer').toggle();

    if (showFooter) {
        $('.footer').toggle();
        footerH = $('#footer').height();
        $('.footer').css('top', (window.BODY_HEIGHT - footerH) + 'px');
    }

    $('body').height(window.BODY_HEIGHT);
    $(".map-wr").height(window.BODY_HEIGHT - headerH - footerH);
    $('.content-wrap').height(window.BODY_HEIGHT - headerH - footerH);
}

//
function setHeight() {
    hideURLbar(function () {
            setToolBars();
            setTimeout(function () {
                $('#setHeight').toggle();
                setSliderWidth();

                window.isOrientationChanged = false;
            }, 500);
        }
    );

    $('#newcars-resultwrapper').css('height', $('#newcars-scroller').height() + 'px');
}

//
bindEvent(window, 'onorientationchange' in window ? 'orientationchange' : 'resize', orientationChange);
function orientationChange() {
    window.isOrientationChanged = true;
    setHeight();
}

//
var activeTouch = {
    touch:0,
    page:''
};

function initScroll() {
    /**/

    $('.iscroll-scroll-wr, .iscroll-scroll').remove();

    //if (!window.PhoneGap)
    if (window.Page != 'locator_inner') {
        delete window[Page + '_scroll'];
        window[Page + '_scroll'] = new iScroll($('#' + Page + '_page #wrapper')[0], {
            hideScrollbar:true,
        });
    }

    /**/
}

//
function loadRootPages() {
    var pages = ['index', 'services', 'news', 'locator'];
    for (var i = 0; i < pages.length; i++)
        engine(true, pages[i]);

}

//
$("ul.fmenu li").live("touchstart mousedown", function (event) {
    needStateChangeBind = false;
    event.preventDefault();
    event.stopPropagation();

    var link = this;

    // Reset circle indicator to first active position
    $('#indicate li').removeClass('active-nav-point');
    $('#indicate li:first-child').addClass('active-nav-point');

    window.activeTouch.page = $(this).attr('id').substr($(this).attr('id').lastIndexOf("-") + 1);

    if (!window.activeTouch.touch && Page != window.activeTouch.page) {
        window.activeTouch.touch = 1;

        $('ul.fmenu li.fnav-active').removeClass('fnav-active');
        $(link).addClass('fnav-active');

        Page = window.activeTouch.page;

        setNetworkState();
        History.pushState({}, Page, Page + ".html");

        // reset popup if open
        $('.header-button').removeClass('pressed');
        $('#popups .pu-message').toggle();
        $('#popups .pu-auth').toggle();

        /**/
        if (hasLocalStorage)
            window[Page + 'WritingTime'] = parseInt(window.localStorage.getItem(Page + "WritingTime"));


        var needEngine = true;
        var nowTime = new Date().getTime();

        if ($('#' + Page + '_page').length > 0) {

            if (Page == 'locator' || Page == 'services')
                needEngine = false;

            var needTime = Page == 'index' ? bannersWritingTime + bannersTimeOut : window[Page + 'WritingTime'] + window[Page + 'TimeOut'];

            needEngine = needTime < nowTime;
        }


        if (!needEngine) {
            $("[data-role='page']").toggle();
            $('#' + Page + '_page').toggle();
            HideLoader();
        } else
            ShowLoader(function () {
                engine();
            });
    }
});
$("ul.fmenu li").live('click', function () {
    return false;
});

//
$(".content-wrap ul:not(.cars-scroller) li").live("mousedown touchstart", function () {
    needStateChangeBind = true;
    $('.content-wrap ul:not(.cars-scroller) li').removeClass('active').removeClass('active-for-click');
    //$(this).addClass('active').addClass('active-for-click');
    $(this).addClass('active-for-click');
});
$(".content-wrap ul:not(.cars-scroller) li").live('click', function () {
    needStateChangeBind = true;
    $(this).addClass('active');
    if ($(this).hasClass('active-for-click')) {

        $(".content-wrap ul:not(.cars-scroller) li").removeClass('active').removeClass('active-for-click');
        setNetworkState();

        var href = $(this).find('a').attr('href');
        parseUrlQuery(href);

        // reset popup if open
        $('.header-button').removeClass('pressed');
        $('#popups .pu-message').toggle();
        $('#popups .pu-auth').toggle();

        ShowLoader(function () {
            setTimeout(function () {
                History.pushState({}, Page, href);
            }, 0);
        })
    }
    return false;
});

//
if (!window.PhoneGap) {
    if (window.navigator != null) {
        var geoloc = window.navigator.geolocation;
        if (geoloc != null) {
            geoloc.getCurrentPosition(
                function (p) {
                    window.currPosition = p.coords;
                },
                function (err) {
                    //alert(err.message);
                });
        }
    }
}