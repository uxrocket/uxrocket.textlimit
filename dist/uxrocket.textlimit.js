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
        this._remainingContent = false;

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

    TextLimit.prototype.removeClasses = function() {
        this.$el.removeClass(utils.getClassname('ready'));
        this.$el.parent().removeClass(this.classList.replace(ns.wrap, ''));
    };

    TextLimit.prototype.handleRemaining = function() {
        var chars = this.options.maxLength - this.$el.val().length;

        this.$remainingContent = this.$el.siblings(this.options.remaining);
        this._remainingContent = this.$remainingContent.clone(); // keep the original state

        if(chars < 0) {
            chars = 0;
        }

        // do not show limit
        if(this.options.maxLength === 0) {
            chars = '';
        }

        if(this.$remainingContent.length < 1) {
            this.$el.after('<span title="' + this.options.remainingText + '" class="' + utils.getClassname('remaining') + ' ' + this.options.remaining.substring(1, this.options.remaining.length) + '">' + chars + '</span>');
            this.$remainingContent = this.$el.next();
            this._remainingContent = true;
        }
        else {
            this.$remainingContent.addClass(utils.getClassname('remaining')).attr('title', this.options.remainingText).text(chars);
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

    TextLimit.prototype.removeRemaining = function() {
        // remainder added with plugin
        if(this._remainingContent === true) {
            this.$remainingContent.remove();
        }
        // already in the html, revert to original state
        else {
            this.$remainingContent.replaceWith(this._remainingContent);
        }
    };

    TextLimit.prototype.removeLayout = function() {
        var _this = this,
            uxrocket = _this.$el.data(ns.rocket);

        // remove or reformat wrap
        if(Object.keys && Object.keys(uxrocket).length === 1) {
            _this.$el.unwrap();
        }

        else {
            _this.$el.parent().removeClass(ns.wrap);
        }
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

    TextLimit.prototype.unbindUIActions = function() {
        this.$el.off('.' + rocketName);
    };

    TextLimit.prototype.checkLimit = function() {
        var val = this.$el.val(),
            size = val.length,
            remaining = this.options.maxLength - size;

        if(remaining < 0) {
            remaining = 0;
            this.$el.val(val.substring(0, size));
        }

        if(remaining === 0) {
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

    TextLimit.prototype.update = function(options) {
        options = options || {};

        return ux.update(this.el, options);
    };

    TextLimit.prototype.destroy = function() {
        return ux.destroy(this.el);
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
                    var func = new Function('return ' + fn);
                    func();
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

    ux.update = function(el, options) {
        var $el, opts;

        // all elements will update according to new options
        if(typeof options === 'undefined' && typeof el === 'object') {
            $el = $('.' + utils.getClassname('ready'));
            opts = el;
        }
        else {
            $el = $(el);
            opts = options;
        }

        $el.filter('textarea, input').each(function() {
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

    ux.destroy = function(el) {
        var $el = el !== undefined ? $(el) : $('.' + utils.getClassname('ready'));

        $el.filter('textarea, input').each(function() {
            var _this = $(this),
                _instance = _this.data(ns.data),
                _uxrocket = _this.data(ns.rocket);

            // remove ready class
            _instance.removeClasses();

            // remove plugin events
            _instance.unbindUIActions();

            // remove Remaining
            _instance.removeRemaining();

            // remove layout
            _instance.removeLayout();

            // remove plugin data
            _this.removeData(ns.data);

            // remove uxRocket registry
            delete _uxrocket[ns.data];
            _this.data(ns.rocket, _uxrocket);

            utils.callback(_instance.options.onRemove);
        });
    };


// version
    ux.version = '1.0.0';

// default settings
    ux.settings = defaults;
    ux.namespace = ns;
}));