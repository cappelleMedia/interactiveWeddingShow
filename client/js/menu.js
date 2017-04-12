/**
 * Created by Jens on 31-Jan-17.
 */
document.onload = menuInit();

function menuInit() {
    handleReload();
    setMenuListeners();
}

function handleReload() {
    var hashLocation = window.location.hash.split('#')[1];
    if (hashLocation && hashLocation != '' && hashLocation !== 'home') {
        var menuItem = document.getElementById(hashLocation + '-menu');
        toggleMenu(menuItem);
    }
}

function setMenuListeners() {
    $('.menu-item').on('click', function (e) {
        e.preventDefault();
        var menuItem = this.dataset.target,
            currLocation = window.location.hash.split('#')[1];
        if ((!currLocation) || menuItem !== currLocation) {
            window.location.hash = menuItem;
        } else {
            window.location.hash = 'home';
        }
        console.log(this);
        //toggleMenu(this);
    });

    $('.sub-menu-item').on('click', function (e) {
        e.preventDefault();
        toggleSubMenu(this);
    });

    $(window).on('hashchange', function () {
        var hashLocation = 'home';
        if(window.location.hash){
            hashLocation = window.location.hash.split('#')[1];
        }
        if (hashLocation == 'home') {
            var activeMenu = document.getElementsByClassName('menu-item active')[0];
            toggleMenu(activeMenu);
        } else {
            if (hashLocation && hashLocation != '' && hashLocation !== 'home') {
                var menuItem = document.getElementById(hashLocation + '-menu');
                console.log(menuItem);
                toggleMenu(menuItem);
            }
        }
    })
}

function toggleSubMenu(el) {
    var activeContent = $('.info-content.active')[0];
    $(activeContent).removeClass('active');
    var activeMenu = $('.sub-menu-item.active')[0];
    $(activeMenu).removeClass('active');

    var jqEl = $(el);
    jqEl.addClass('active');
    var target = el.dataset.target;
    if (target) {
        $('#' + target).addClass('active');
    }
}

function toggleMenu(el) {
    var jqEl = $(el);
    if (jqEl.hasClass('active')) {
        jqEl.removeClass('active');
        hideAllMenuContents();
        showMenuItems();
    } else {
        jqEl.addClass('active');
        var target = el.dataset.target;
        if (target) {
            hideMenuItems(el);
            setTimeout(function () {
                showMenuContent(target);
            }, 100);
        }
    }
}

function hideAllMenuContents() {
    _.each($('.content-box'), function (contentBox) {
        $(contentBox).slideUp('fast');
    });
}

function showMenuContent(target) {
    var jqEl = $('#' + target);
    jqEl.slideDown('fast', function () {
        jqEl.addClass('shown');
        document.getElementById('input-filter').value
    });
}

function hideMenuItems(el) {
    _.each($('.menu-item'), function (menuItem) {
        if (menuItem !== el) {
            $(menuItem).slideUp('fast', function () {

            });
        }
    });
}

function showMenuItems() {
    _.each($('.menu-item'), function (menuItem) {
        $(menuItem).slideDown('fast');
    });
}

function updateHistory(curr) {
    window.location.lasthash.push(window.location.hash);
    window.location.hash = curr;
}