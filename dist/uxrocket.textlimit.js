/**
 * UX Rocket
 * Textlimit and remaining chars
 * @author Bilal Cinarli
 */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object' && typeof require === 'function') {
        // Browserify
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var ux, // local shorthand
        rocketName = 'uxrTextlimit',
        i = 1,
        defaults = {
            maxLength: 0,
            remainingText: 'Remaining Characters',
            remaining: '.remaining',
            visible: true,

            onReady: false,
            onLimit: false,
            onUpdate: false,
            onRemove: false
        },
        events = {
            focus: 'focus.' + rocketName,
            input: 'input.' + rocketName,
            keyup: 'keyup.' + rocketName,
            ready: 'uxrready.' + rocketName,
            limit: 'uxrlimit.' + rocketName,
            update: 'uxrupdate.' + rocketName,
            remove: 'uxrremove.' + rocketName
        },
        ns = {
            prefix: 'uxr-',
            rocket: 'uxRocket',
            data: rocketName,
            name: 'textlimit',
            wrap: 'uxr-plugin-wrap',
            classes: {
                wrap: 'wrap',
                ready: 'ready',
                remaining: 'remaining',
                hideremaining: 'hide-remaining'
            }
        },

        utils = new uxrPluginUtils({ns: ns});

    var TextLimit = function (el, options, selector) {
        this._instance = i;
        this._name = rocketName;
        this._defaults = defaults;
        this._remainingContent = false;

        this.el = el;
        this.$el = $(el);

        this.selector = selector;
        this.options = $.extend(true, {}, defaults, options, this.$el.data());
        this.options.maxLength = parseInt(this.$el.attr('maxlength')) || this.options.maxLength;

        i++;

        this.init();
    };

    TextLimit.prototype.init = function () {
        if (this.el.id === '') {
            this.el.id = ns.data + '-' + this._instance;
        }

        this.registry();

        // add ready class
        this.decorateUI();

        this.bindUI();

        this.emitEvent('ready');
    };

    TextLimit.prototype.decorateUI = function () {
        this.addClass();
        this.wrap();
        this.addRemaining();
    };

    TextLimit.prototype.undecorateUI = function () {
        this.removeClasses();
        this.unwrap();
        this.removeRemaining();
    };

    TextLimit.prototype.addClass = function () {
        this.$el.addClass(utils.getClassname('ready'));
    };

    TextLimit.prototype.removeClasses = function () {
        this.$el.removeClass(utils.getClassname('ready'));
    };

    TextLimit.prototype.addRemaining = function () {

        var chars = this.options.maxLength - this.$el.val().length;

        this.$remainingContent = this.$el.siblings(this.options.remaining);
        this._remainingContent = this.$remainingContent.clone(); // keep the original state
        this.$parentRemainingContent  = this.$el.parent().siblings(this.options.remaining);
        this._parentRemainingContent = this.$parentRemainingContent.clone();


        if (chars < 0) {
            chars = 0;
        }

        // do not show limit
        if (this.options.maxLength === 0) {
            chars = '';
        }

        if(this.$parentRemainingContent.length > 0){
            this.$parentRemainingContent.text(chars);
            this.$parentRemainingContent.attr("class", utils.getClassname('remaining'));
            this._parentRemainingContent = true;
        }
        else if (this.$remainingContent.length < 1) {
            this.$el.after('<span title="' + this.options.remainingText + '" class="' + utils.getClassname('remaining') + ' ' + this.options.remaining.substring(1, this.options.remaining.length) + '">' + chars + '</span>');
            this.$remainingContent = this.$el.next();
            this._remainingContent = true;
        }
        else {
            this.$remainingContent.addClass(utils.getClassname('remaining')).attr('title', this.options.remainingText).text(chars);
        }

        // visible
        if (!this.options.visible) {
            this.$remainingContent.hide();
            this.$parentRemainingContent.hide();
        }

    };

    TextLimit.prototype.wrap = function () {

        if (this.$el.parent().is('span')) {
            this.$el.parent().addClass(utils.getClassname('wrap'));
        }

        else {
            this.wrapped = true;
            this.$el.wrap('<span class="' + utils.getClassname('wrap') + '"></span>');
        }
    };

    TextLimit.prototype.unwrap = function () {
        if (this.wrapped) {
            this.$el.unwrap();
        }
        else {
            this.$el.parent().removeClass(utils.getClassname('wrap') + ' ' + this.options.wrapper);
        }
    };

    TextLimit.prototype.removeRemaining = function () {

        if (this._parentRemainingContent === true) {
            this.$parentRemainingContent.remove();
        }
        // remainder added with plugin
        if (this._remainingContent === true) {
            this.$remainingContent.remove();
        }
        // already in the html, revert to original state
        else {
            this.$remainingContent.replaceWith(this._remainingContent);
        }
        //remove id
        this.$el.removeAttr("id")
    };

    TextLimit.prototype.bindUI = function () {
        var _this = this;

        this.$el
            .on(events.keyup + ' ' + events.input + ' ' + events.focus, function () {
                _this.checkLimit();

            })
            .on(events.ready, function () {
                _this.onReady();
            })
            .on(events.limit, function () {
                _this.onLimit();
            })
            .on(events.update, function () {
                _this.onUpdate();
            })
            .on(events.remove, function () {
                _this.onRemove();
            });
    };

    TextLimit.prototype.unbindUI = function () {
        this.$el.off('.' + rocketName);
    };

    TextLimit.prototype.checkLimit = function () {
        var val = this.$el.val(),
            size = val.length,
            remaining = this.options.maxLength - size;

            // no limit , char count
            if (this.options.maxLength === 0) {
                return size >= 1 ? this.$remainingContent.text(size) : this.$remainingContent.text('');
            }

            //limit count
            if (remaining < 0) {
                remaining = 0;
                this.$el.val(val.substring(0, this.options.maxLength));
            }

            if (remaining === 0) {
                this.emitEvent('limit');
            }

            if(this.$parentRemainingContent.length >= 1){
                this.$parentRemainingContent.text(remaining);
            }else{
                this.$remainingContent.text(remaining);
            }
    };

    TextLimit.prototype.onReady = function () {
        utils.callback(this.options.onReady);
    };

    TextLimit.prototype.onLimit = function () {
        utils.callback(this.options.onLimit);
    };

    TextLimit.prototype.onUpdate = function () {
        utils.callback(this.options.onUpdate);
    };

    TextLimit.prototype.onRemove = function () {
        utils.callback(this.options.onRemove);
    };

    TextLimit.prototype.onDestroy = function () {
        utils.callback(this.options.onDestroy);
    };

    TextLimit.prototype.update = function (options) {
        options = options || {};

        return ux.update(this.el, options);
    };

    TextLimit.prototype.destroy = function () {
        this.emitEvent('destroy');
        this.unbindUI();
        this.undecorateUI();
        this.$el.removeData(rocketName);
    };

    TextLimit.prototype.registry = function () {
        var uxrocket = this.$el.data(ns.rocket) || {};

        // register plugin data to rocket
        uxrocket[ns.data] = {
            hasWrapper: true,
            ready: utils.getClassname('ready'),
            selector: this.selector,
            options: this.options
        };

        this.$el.data(ns.rocket, uxrocket);
    };

    TextLimit.prototype.emitEvent = function (which) {
        this.$el.trigger('uxr' + which);
    };

    ux = $.fn.textlimit = $.fn.uxrtextlimit = $.uxrtextlimit = function (options) {
        var selector = this.selector;

        return this.each(function () {
            if ($.data(this, ns.data)) {
                return;
            }

            // Bind the plugin and attach the instance to data
            $.data(this, ns.data, new TextLimit(this, options, selector));
        });
    };

    ux.update = function (el, options) {
        var $el, opts;

        // all elements will update according to new options
        if (typeof options === 'undefined' && typeof el === 'object') {
            $el = $('.' + utils.getClassname('ready'));
            opts = el;
        }
        else {
            $el = $(el);
            opts = options;
        }

        $el.filter('textarea, input').each(function () {
            var _this = $(this),
                _instance = _this.data(ns.data),
                _opts = _instance.options;

            _opts.maxLength = parseInt(_this.attr('maxlength')) || _opts.maxLength;

            // update new options
            _instance.options = $.extend(true, {}, _opts, opts);

            // check limit
            _instance.checkLimit();

            // use onUpdate callback from original options
            _instance.emitEvent('update');
        });
    };

    ux.destroy = function (el) {

        var $el = typeof el === 'undefined' ? $('.' + utils.getClassname('ready')) : $(el);

        $el.each(function () {
            $(this).data(ns.data).destroy();
        });
    };


// version
    ux.version = '1.1.1';

// default settings
    ux.settings = defaults;
    ux.namespace = ns;
}));