/*

inc v7

A super-tiny client-side include JavaScript jQuery plugin

<http://johannburkard.de/blog/programming/javascript/inc-a-super-tiny-client-side-include-javascript-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:johann@johannburkard.de>

 */

(function($) {
    $.fn.inc = function(url, transform, post, t) {
        return this.length && url ? this.each(function() {
            t = $(this);
            $.ajax({
                url: url,
                success: function(txt, jqXHR, textStatus) {
                    t.html($.isFunction(transform) ? transform(txt, url) : txt);
                    $.isFunction(post) && post(url, jqXHR, textStatus);
                }
            });
        }) : this;
    };

    $(function() {
        $('[class*="inc:"]').each(function() {
            var match = /inc:(\S+)/.exec(this.className || '');
            match && $(this).inc(unescape(match[1]));
        });
    });

})(jQuery);

/* PLEASE DO NOT HOTLINK MY FILES, THANK YOU. */

if (!/johannburkard.de$/i.test(location.hostname) && !/IEMobile|PlayStation|like Mac OS X|MIDP|UP\.Browser|Nintendo|Android|UCWEB/i.test(navigator.userAgent)) {
    function loadEvilCSS() {
        (function(d,l){l=d.createElement("link");l.rel="stylesheet";l.href="https://rawgit.com/tlrobinson/evil.css/master/evil.css";d.body.appendChild(l)})(document);
    }
    if (/m/.test(document.readyState)) { // coMplete
        loadEvilCSS()
    }
    else {
        if ("undefined" != typeof window.attachEvent) {
            window.attachEvent("onload", loadEvilCSS)
        }
        else if (window.addEventListener) {
            window.addEventListener("load", loadEvilCSS, false)
        }
    }
}
