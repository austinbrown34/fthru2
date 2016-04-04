;(function($)
{var defaults={duration:1000,clickHandler:null}
function startHandler(event)
{var $elem=jQuery(this);settings=jQuery.extend({},defaults,event.data);if(typeof $elem.data("events")!="undefined"&&typeof $elem.data("events").click!="undefined")
{for(var c in $elem.data("events").click)
{if($elem.data("events").click[c].namespace=="")
{var handler=$elem.data("events").click[c].handler
$elem.data("taphold_click_handler",handler);$elem.unbind("click",handler);break;}}}
else if(typeof settings.clickHandler=="function")
{$elem.data("taphold_click_handler",settings.clickHandler);}
$elem.data("taphold_triggered",false);$elem.data("taphold_clicked",false);$elem.data("taphold_cancelled",false);$elem.data("taphold_timer",setTimeout(function()
{if(!$elem.data("taphold_cancelled")&&!$elem.data("taphold_clicked"))
{$elem.trigger(jQuery.extend(event,jQuery.Event("taphold")));$elem.data("taphold_triggered",true);}},settings.duration));}
function stopHandler(event)
{var $elem=jQuery(this);if($elem.data("taphold_cancelled")){return;}
clearTimeout($elem.data("taphold_timer"));if(!$elem.data("taphold_triggered")&&!$elem.data("taphold_clicked"))
{if(typeof $elem.data("taphold_click_handler")=="function")
{$elem.data("taphold_click_handler")(jQuery.extend(event,jQuery.Event("click")));}
$elem.data("taphold_clicked",true);}}
function leaveHandler(event)
{$(this).data("taphold_cancelled",true);}
var touchSupported=("ontouchstart"in window)||("onmsgesturechange"in window);var taphold=$.event.special.taphold={setup:function(data)
{$(this).bind((touchSupported?"touchstart":"mousedown"),data,startHandler).bind((touchSupported?"touchend":"mouseup"),stopHandler).bind((touchSupported?"touchmove touchcancel":"mouseleave"),leaveHandler);},teardown:function(namespaces)
{$(this).unbind((touchSupported?"touchstart":"mousedown"),startHandler).unbind((touchSupported?"touchend":"mouseup"),stopHandler).unbind((touchSupported?"touchmove touchcancel":"mouseleave"),leaveHandler);}};})(jQuery);
