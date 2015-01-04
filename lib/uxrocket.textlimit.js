/**
 * UX Rocket
 * Textlimit and remaining chars
 * @author Bilal Cinarli
 */

;(function($){

    var ux, // local shorthand

        defaults = {
            maxLength : 0,
            remaining : '.remaining',
            visible : true,

            onReady: false,
            onLimit: false
        },
        events = {
            'keyup': 'keyup.uxTextLimit'
        };


    var TextLimit = function(el,options, selector){
        var $el = $(el),
            opts = $.extend({}, defaults, options, $el.data(), {'selector': selector});

        opts.maxLength = parseInt($el.attr('maxlength'));

        $el.data('uxTextLimit', opts);

        // set plugin layout for css and additional objects
        setLayout($el);

        callback(opts.onReady);

        // bind UI actions
        bindUIActions($el);
    };

    var setLayout = function($el){
        var columns = '',
            _opts = $el.data('uxTextLimit'),
            $remaining = $el.siblings(_opts.remaining),
            chars = _opts.maxLength - $el.val().length,
            visible = '';

        columns = ' ' + $el.context.className.replace('uxitd-textlimit-ready', '');

        if(_opts.selector.charAt(0) == '.') {
            columns = columns.replace(' ' + _opts.selector.substr(1), '');
        }

        if(chars < 0){
            chars = 0;
        }

        if(_opts.visible === false){
            visible = ' uxitd-hide-remaining';
        }

        if($el.parent().is('.uxitd-plugin-wrap')){
            $el.parent().addClass('uxitd-textlimit-wrap' + columns + visible);
        }
        else {
            $el.wrap('<span class="uxitd-plugin-wrap uxitd-textlimit-wrap' + columns + visible + '"></span>');
        }

        if($remaining.length < 1){
            $el.after('<span title="Kalan karakter sayısı" class="uxitd-textlimit-remaining ' + _opts.remaining.substring(1, _opts.remaining.length) + '">' + chars + '</span>');
        }
        else {
            $remaining.addClass('uxitd-textlimit-remaining').attr('title', 'Kalan karakter sayısı');
        }
    };

    var bindUIActions = function($el){
        var remaining = $el.siblings('.uxitd-textlimit-remaining'),
            _opts = $el.data('uxTextLimit');

        $el.on(events.keyup, function(){
            return charCount($el, remaining);
        });
    };

    // global callback
    var callback = function(fn){
        // if callback string is function call it directly
        if(typeof fn === 'function'){
            call(fn);
        }

        // if callback defined via data-attribute, call it via new Function
        else {
            if(fn !== false){
                var func = new Function('return ' + fn);
                func();
            }
        }
    };

    var charCount = function($el, $remaining){
        var currentVal = $el.val(),
            currentSize = currentVal.length,
            _opts = $el.data('uxTextLimit'),
            remaining = _opts.maxLength - currentSize;

        if(remaining < 0)
        {
            $el.val(currentVal.substring(0, _opts.maxLength));
            remaining = 0;
        }

        if(remaining === 0){
            callback(_opts.onLimit);
        }

        $remaining.text(remaining);
    };

    ux = $.fn.textlimit = $.uxlimit = function(options){
        var selector = this.selector;

        return this.each(function(){
            var $el = $(this),
                uxrocket = $el.data('uxRocket') || {},
                limit;

            if($el.hasClass('uxitd-textlimit-ready') || $el.hasClass('uxitd-plugin-wrap')){
                return;
            }

            $el.addClass('uxitd-textlimit-ready');

            uxrocket['uxTextLimit'] = {'hasWrapper': true, 'wrapper': 'uxitd-textlimit-wrap', 'ready': 'uxitd-textlimit-ready', 'selector': selector, 'options': options};

            $el.data('uxRocket', uxrocket);

            // call the constructor
            limit = new TextLimit(this, options, selector);
        });
    };

    // version
    ux.version = "0.7.1a";

    // settings
    ux.settings = defaults;
})(jQuery);