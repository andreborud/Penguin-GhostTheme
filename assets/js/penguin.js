var $container = $('#posts');
// init
$container.isotope({
    // options
    itemSelector: '.post',
    layoutMode: 'masonry'
});

$(window).scroll(function () {
    var scrolledY = $(window).scrollTop();
    var height = window.innerHeight;
    if (window.innerWidth >= 1050) $('.header-background').css('background-position', 'left ' + ((scrolledY)/2) + 'px');
    var val = scrolledY/height;
    if (val < 0.0) val = 0.0;
    else if (val > 1) val = 1;
    console.log(val);
    $('#page-navigation').css('background-color', 'rgba(51,51,51,' + val + ')');

    if ((height - scrolledY) > $( "#navigation" ).height()) {
        $( "#navigation" ).fadeOut( "slow", function() {
            // Animation complete
        });
    } else {
        $( "#navigation" ).fadeIn( "slow", function() {
            // Animation complete
        });
    }
});

function filter(filter) {
    $container.isotope({ filter: filter })
}

function goToBlog() {
    $('html, body').animate({
        scrollTop: window.innerHeight-100 + 'px'
    }, 'fast');
}

var penguinApp = angular.module('penguinApp', ['ngRoute', 'infinite-scroll']);

penguinApp.controller('scrollController', function ($scope, Penguin) {
    $scope.penguin = new Penguin();
});

penguinApp.factory('Penguin', function ($http) {
    var Penguin = function () {
        this.items = [];
        this.after = 2;
        this.busy = false;
        this.stop = false;
        this.lastString = "";
    };

    Penguin.prototype.nextPage = function () {
        if (this.busy) return;
        this.busy = true;

        var url = "/page/" + this.after;
        if (!this.stop) {
            $http.get(url).success(function (data, status, headers, config) {
                if (status === 200) {
                    //console.log(JSON.stringify(data));
                    var firstTag = '<main id="posts">';
                    var res = data.substring(data.indexOf(firstTag) + firstTag.length, data.indexOf('</main>'));
                    if (this.lastString === res) {
                        this.stop = true;
                        this.busy = false;
                        return;
                    }
                    var html = $.parseHTML( res );
                    var length = 0;
                    var elemental = [];
                    $.each( html, function( i, el ) {
                        console.log(el.nodeName);
                        if (el.nodeName === 'ARTICLE') {
                            length++;
                            elemental.push(el);
                        }
                    });
                    $container.append( elemental ).isotope( 'appended', elemental );
                    this.lastString = res;
                    if (length < 6) this.stop = true;
                    this.busy = false;
                    this.after++;
                }
            }.bind(this));
        } else {
            this.busy = false;
        }
    };

    return Penguin;
});
