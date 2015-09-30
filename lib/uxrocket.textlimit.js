/**
 * UX Rocket
 * Textlimit and remaining chars
 * @author Bilal Cinarli
 */

(function(factory) {
    'use strict';
    if(typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if(typeof exports === 'object' && typeof require === 'function') {
        // Browserify
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    'use strict';

    var ux, // local shorthand
        i = 1,
        rocketName = 'uxrTextlimit',
        defaults = {
            maxLength    : 0,
            remainingWrap: false,
            remainingText: 'Remaining Characters',
            remaining    : '.remaining',
            visible      : true,

            onReady : false,
            onLimit : false,
            onUpdate: false,
            onRemove: false
        },
        events = {
            focus : 'focus.' + rocketName,
            input : 'input.' + rocketName,
            keyup : 'keyup.' + rocketName,
            ready : 'uxrready.' + rocketName,
            limit : 'uxrlimit.' + rocketName,
            update: 'uxrupdate.' + rocketName,
            remove: 'uxrremove.' + rocketName
        },
        ns = {
            prefix : 'uxr-',
            rocket : 'uxRocket',
            data   : rocketName,
            name   : 'textlimit',
            wrap   : 'uxr-plugin-wrap',
            classes: {
                wrap         : 'wrap',
                ready        : 'ready',
                remaining    : 'remaining',
                hideremaining: 'hide-remaining'
            }
        };

    var TextLimit = function(el, options, selector) {
        this._instance = i;
        this._name = rocketName;
        this._defaults = defaults;

        this.el = el;
        this.$el = $(el);

        this.selector = selector;
        this.options = $.extend(true, {}, defaults, options, this.$el.data());
        this.options.maxLength = parseInt(this.$el.attr('maxlength')) || this.options.maxLength;

        i++;

        this.init();
    };

    TextLimit.prototype.init = function() {
        var uxrocket = this.$el.data(ns.rocket) || {};

        // register plugin data to rocket
        uxrocket[ns.data] = {hasWrapper: false, ready: utils.getClassname('ready'), selector: this.selector, options: this.options};
        this.$el.data(ns.rocket, uxrocket);

        // set plugin layout
        this.setLayout();

        this.$el.addClass(utils.getClassname('ready'));

        this.emitEvent('ready');

        this.bindUIActions();
    };

    TextLimit.prototype.handleClasses = function() {
        this.classList = this.$el.context.className.replace(utils.getClassname('ready'), '');

        if(this.selector.charAt(0) === '.') {
            this.classList = this.classList.replace(this.selector.substr(1), '');
        }

        if(!this.options.visible) {
            this.classList += utils.getClassname('hideremaining') + ' ';
        }

        this.classList += ns.wrap + ' ' + utils.getClassname('wrap') + ' ' + utils.getClassname('wrap') + '-' + this._instance;
        this.classList = $.trim(this.classList);
    };

    TextLimit.prototype.handleRemaining = function() {
        var remainingContent = this.$el.siblings(this.options.remaining),
            chars = this.options.maxLength - this.$el.val().length;

        this.$remainingContent = remainingContent;

        if(chars < 0) {
            chars = 0;
        }

        // do not show limit
        if(this.options.maxLength == 0) {
            chars = '';
        }

        if(remainingContent.length < 1) {
            this.$el.after('<span title="' + this.options.remainingText + '" class="' + utils.getClassname('remaining') + ' ' + this.options.remaining.substring(1, this.options.remaining.length) + '">' + chars + '</span>');
            this.$remainingContent = this.$el.next();

        }
        else {
            remainingContent.addClass(utils.getClassname('remaining')).attr('title', this.options.remainingText).text(chars);
        }
    };

    TextLimit.prototype.handleWrapper = function() {
        this.$el.parent().is('.' + ns.wrap) ?
        this.$el.parent().addClass(this.classList) :
        this.$el.siblings('.' + utils.getClassname('remaining')).andSelf().wrapAll('<span class="' + this.classList + '"></span>');
    };

    TextLimit.prototype.setLayout = function() {
        this.handleClasses();
        this.handleRemaining();
        this.handleWrapper();
    };

    TextLimit.prototype.bindUIActions = function() {
        var _this = this;

        this.$el
            .on(events.keyup + ' ' + events.input + ' ' + events.focus, function() {
                _this.checkLimit();
            })
            .on(events.ready, function() {
                _this.onReady();
            })
            .on(events.limit, function() {
                _this.onLimit();
            })
            .on(events.update, function() {
                _this.onUpdate();
            })
            .on(events.remove, function() {
                _this.onRemove();
            });
    };

    TextLimit.prototype.checkLimit = function() {
        var val = this.$el.val(),
            size = val.length,
            remaining = this.options.maxLength - size;

        if(remaining < 0) {
            remaining = 0;
            this.$el.val(val.substring(0, size));
            this.emitEvent('limit');
        }

        this.$remainingContent.text(remaining);
    };

    TextLimit.prototype.onReady = function() {
        utils.callback(this.options.onReady);
    };

    TextLimit.prototype.onLimit = function() {
        utils.callback(this.options.onLimit);
    };

    TextLimit.prototype.onUpdate = function() {
        utils.callback(this.options.onUpdate);
    };

    TextLimit.prototype.onRemove = function() {
        utils.callback(this.options.onRemove);
    };

    TextLimit.prototype.emitEvent = function(which) {
        this.$el.trigger('uxr' + which);
    };

    var utils = {
        callback: function(fn) {
            // if callback string is function call it directly
            if(typeof fn === 'function') {
                fn.apply(this);
            }

            // if callback defined via data-attribute, call it via new Function
            else {
                if(fn !== false) {
                    var _fn = /([a-zA-Z._$0-9]+)(\(?(.*)?\))?/.exec(fn),
                        _fn_ns = _fn[1].split('.'),
                        _args = _fn[3] ? _fn[3] : '',
                        func = _fn_ns.pop(),
                        context = _fn_ns[0] ? window[_fn_ns[0]] : window;

                    for(var i = 1; i < _fn_ns.length; i++) {
                        context = context[_fn_ns[i]];
                    }

                    return context[func](_args);
                }
            }
        },

        getStringVariable: function(str) {
            var val;
            // check if it is chained
            if(str.indexOf('.') > -1) {
                var chain = str.split('.'),
                    chainVal = window[chain[0]];

                for(var i = 1; i < chain.length; i++) {
                    chainVal = chainVal[chain[i]];
                }

                val = chainVal;
            }

            else {
                val = window[str];
            }

            return val;
        },

        getClassname: function(which) {
            return ns.prefix + ns.name + '-' + ns.classes[which];
        }
    };

    ux = $.fn.textlimit = $.fn.uxrtextlimit = $.uxrtextlimit = function(options) {
        var selector = this.selector;

        return this.each(function() {
            if($.data(this, ns.data)) {
                return;
            }

            // Bind the plugin and attach the instance to data
            $.data(this, ns.data, new TextLimit(this, options, selector));
        });
    };

// version
    ux.version = '2.0.2';

// default settings
    ux.settings = defaults;
    ux.namespace = ns;
}));