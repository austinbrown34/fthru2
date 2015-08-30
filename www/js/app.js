window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

var fb = new MobileApp();

fb.spinner = $("#spinner");
fb.spinner.toggle();

fb.slider = new PageSlider($('#container'));
fb.mapslider = new PageSlider($('#mapcontainer'));
fb.MobileRouter = Backbone.Router.extend({

    routes: {
        "":                         "welcome",
        "error":					"error",
        "me":                       "me",
        "menu":                     "menu",
        "me/friends":               "myfriends",
        "person/:id":               "person",
        "person/:id/friends":       "friends",
        "person/:id/mutualfriends": "mutualfriends",
        "me/feed":                  "myfeed",
        "person/:id/feed":          "feed",
        "revoke":                   "revoke",
        "post":                     "post",
        "postui":                   "postui"
    },

    welcome: function () {
        // Reset cached views
        fb.myView = null;
        fb.myFriendsView = null;
        var view = new fb.views.Welcome();
        fb.slider.slidePageFrom(view.$el, "left");
    },

    menu: function () {
        fb.slider.slidePageFrom(new fb.views.Menu().$el, "left");
        fb.slider.resetHistory();
    },

    me: function () {
        var self = this;
        if (fb.myView) {
            fb.slider.slidePage(fb.myView.$el);
            return;
        }
        fb.myView = new fb.views.Person({template: fb.templateLoader.get('person')});
        var slide = fb.slider.slidePage(fb.myView.$el).done(function(){
            fb.spinner.toggle();
        });
        var call = fbWrapper.api("/me");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                fb.myView.model = callResp;
                fb.myView.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.toggle();
            });
    },

    person: function (id) {
        var self = this;
        var view = new fb.views.Person({template: fb.templateLoader.get('person')});
        var slide = fb.slider.slidePage(view.$el).done(function(){
            fb.spinner.toggle();
        });
        var call = fbWrapper.api("/" + id);
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                view.model = callResp;
                view.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.toggle();
            });
    },

    myfriends: function () {
        var self = this;
        if (fb.myFriendsView) {
            fb.slider.slidePage(fb.myFriendsView.$el);
            return;
        }
        fb.myFriendsView = new fb.views.Friends({template: fb.templateLoader.get('friends')});
        var slide = fb.slider.slidePage(fb.myFriendsView.$el).done(function() {
            fb.spinner.toggle();
        });
        var call = fbWrapper.api("/me/friends?limit=100");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                fb.myFriendsView.model = callResp.data;
                fb.myFriendsView.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.toggle();
            });
    },

    friends: function (id) {
        var self = this;
        var view = new fb.views.Friends({template: fb.templateLoader.get('friends')});
        var slide = fb.slider.slidePage(view.$el).done(function() {
            fb.spinner.toggle();
        });
        var call = fbWrapper.api("/" + id + "/friends?limit=100");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                view.model = callResp.data;
                view.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.toggle();
            });
    },

    mutualfriends: function (id) {
        var self = this;
        var view = new fb.views.Friends({template: fb.templateLoader.get('friends')});
        var slide = fb.slider.slidePage(view.$el).done(function() {
            fb.spinner.toggle();
        });
        var call = fbWrapper.api("/" + id + "/mutualfriends?limit=100");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                view.model = callResp.data;
                view.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.toggle();
            });
    },

    myfeed: function (id) {
        var self = this;
        var view = new fb.views.Feed({template: fb.templateLoader.get('feed')});
        var slide = fb.slider.slidePage(view.$el).done(function() {
            fb.spinner.toggle();
        });
        var call = fbWrapper.api("/me/feed?limit=20");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                view.model = callResp.data;
                view.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.toggle();
            });
    },

    feed: function (id) {
        var self = this;
        var view = new fb.views.Feed({template: fb.templateLoader.get('feed')});
        var slide = fb.slider.slidePage(view.$el).done(function() {
            fb.spinner.toggle();
        });
        var call = fbWrapper.api("/" + id + "/feed?limit=20");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                view.model = callResp.data;
                view.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.toggle();
            });
    },

    post: function () {
        fb.slider.slidePage(new fb.views.Post({template: fb.templateLoader.get("post")}).$el);
    },

    postui: function () {
        fb.slider.slidePage(new fb.views.PostUI({template: fb.templateLoader.get("postui")}).$el);
    },

    revoke: function () {
        fb.slider.slidePage(new fb.views.Revoke({template: fb.templateLoader.get("revoke")}).$el);
    },

    error: function () {
         fb.mapslider.slidePage(new fb.views.Error().$el);
//fb.router.navigate("error", {trigger: true});
    }

});

$(document).on('ready', function () {

    fb.templateLoader.load(['menu', 'welcome', 'login', 'person', 'friends', 'feed', 'post', 'postui', 'error', 'revoke'], function () {
        fb.router = new fb.MobileRouter();
        Backbone.history.start();
        FB.init({ appId: "614062005315386", nativeInterface: CDV.FB, useCachedDialogs: false, status: true });
    });

    FB.Event.subscribe('auth.statusChange', function(event) {
        if (event.status === 'connected') {
            FB.api('/me', function (response) {
                fb.user = response; // Store the newly authenticated FB user
            });
            fb.slider.removeCurrentPage();
            fb.router.navigate("me", {trigger: true});
        } else {
            fb.user = null; // Reset current FB user
            fb.router.navigate("", {trigger: true});
        }
    });

});

$(document).on('click', '.button.back', function() {
    window.history.back();
    return false;
});

$(document).on('click', '.logout', function () {
    FB.logout();
    
        if(confirm('Are you sure you want to Log Off?')){
            var id= localStorage.getItem('id');
            //  webadd ="http://54.186.32.195/actions.php?task=logoutstatus&id="+id;

            // Call register action, which checks for unique email and SM ID (on success: load home screen, fail: display msg)
            var request = $.ajax({
                url: "http://54.186.32.195/actions.php?task=logoutstatus",
                type: "post",
                data: 'id=' + id
    });

    // callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR)
    {
        // response == 0 - Successful
       // alert(response);
        if(response == "0")
        {
            localStorage.clear();
//             window.open('index.html','_self');
            return true;
        }
        // response == 1 - Unknown error
        if(response == "1")
        {
            errorMsg("Problem with updating. Try again later.", 3000);
            return false;
        }
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown)
    {
        // log the error to the console
        console.error(
            "The following error occured: "+
                textStatus, errorThrown
        );

        errorMsg("Problem with updating. Try again later.", 3000);
        return false;

    });


}


    return false;
});

$(document).on('login', function () {
    FB.login(function(response) {
        console.log("Logged In");
    }, {scope: 'user_status,friends_status,read_stream'});
    return false;
});

$(document).on('permissions_revoked', function () {
    // Reset cached views
    fb.myView = null;
    fb.myFriendsView = null;
    return false;
});