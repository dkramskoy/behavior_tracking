(function ($) {
    var p = {}; //TODO: Put into ready function

    function pn(n) {
        if (!p[n]) {
            p[n] = { activate: 0, time: 0, keypress: 0, timestamp: Date.now(), paste: 0, copy: 0, click: 0, tab: 0, backspace: 0, del: 0, error: 0, minvalue: 0, maxvalue: 0, changes: 0 }
        }
    }

    $.fn.trackSlider = function (fn, val) {
        var n = fn(this);
        pn(n);
        p[n].changes++;
        if (!p[n].maxvalue || val > p[n].maxvalue) {
            p[n].maxvalue = val;
        }
        if (!p[n].minvalue || val < p[n].minvalue) {
            p[n].minvalue = val;
        }
    }

    $.fn.trackError = function (fn) {
        var n = fn(this);
        pn(n);
        p[n].error++;
    }

    $.fn.behavior = function (fn, context) {

        $(context).on('focus', this.selector, function (e) {

            var n = fn(e.target);
            if (!$(e.target).is(this)) {
                return;
            }

            pn(n);
            p[n].activate++;
            p[n].timestamp = Date.now();
        });

        $(context).on('keydown', this.selector, function (e) {
            var n = fn(e.target);
            if (!$(e.target).is(this)) {
                return;
            }
            pn(n);
            if (e.keyCode == 8) {
                p[n].backspace++;
            }
            if (e.keyCode == 9) {
                p[n].tab++;
            }
            if (e.keyCode == 46) {
                p[n].del++;
            }
            p[n].keypress++;
        });

        $(context).on('focusout', this.selector, function (e) {
            var n = fn(e.target);
            if (!$(e.target).is(this)) {
                return;
            }

            pn(n);
            p[n].time = p[n].time + Date.now() - p[n].timestamp;

            var validator = $(e.target).parents('form').data('validator');
            if (!validator) {
                return;
            }

            var valid = validator.element(e.target);
            if (!valid) {
                p[n].error++;
            }
        });

        $(context).on('paste', this.selector, function (e) {
            var n = fn(e.target);
            if (!$(e.target).is(this)) {
                return;
            }
            pn(n);
            p[n].paste++;
        });

        $(context).on('copy', this.selector, function (e) {
            var n = fn(e.target);
            if (!$(e.target).is(this)) {
                return;
            }
            pn(n);
            p[n].copy++;
        });

        $(context).on('click', this.selector, function (e) {
            var n = fn(e.target);
            if (!$(e.target).is(this)) {
                return;
            }
            pn(n);
            p[n].click++;
        });

    }

    $.fn.enableBehaviorTracking = function (context) {

        $(context).on('submit', this.selector, function (e) {
            var hid = $('<input type="hidden" name="Behavior" />');
            hid.val(JSON.stringify(p));
            $(this).find('[name=Behavior]').remove();
            $(this).append(hid);
        });
    }

    $(document).on('ajaxSend', function (event, request, settings) {
        if (settings.type == 'POST' && settings.dataType != 'json') {
            if (settings.data && settings.data.indexOf("&Behavior=") == -1) {
                settings.data = settings.data + "&Behavior=" + encodeURIComponent(JSON.stringify(p));
            }
        }
    });

})(window.jQuery);