// ==UserScript==
// @name        HelloBank enhancements
// @namespace   camelsoft
// @description Miglioramenti a banking.hellobank.it
// @include     https://banking.hellobank.it/it/home*
// @icon        https://github.com/acavalin/hb_enhancements/raw/master/xm_icon.png
// @downloadURL https://github.com/acavalin/hb_enhancements/raw/master/hellobank.user.js
// @version     1.0.0
// @grant       none
// ==/UserScript==

// NB: queste due direttive non servono perche' c'e' gia' jQuery e sembra funzionare senza problemi
// require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
//jQuery.noConflict();

(function ($) { $(function () {
// -----------------------------------------------------------------------------
window.ads = $('.ls-row.footer').hide();

// sposta in basso il top banner
$('.ls-area.hellobank-content .ls-cmp-wrap.ls-1st').next().prependTo(window.ads);

// ridimensiona bilancio
$('iframe[src*=Financial]').on('load', function () {
  $(this).contents().
    find('.financial-state .title-wrapper').hide().
    next('.scroller-wrapper').css('margin', 'auto').css('float', 'none').
    find('.block-container').css('width', '100%');
});

(function hide_footer () {
  if ($('#footer-container').length != 0)
    $('#footer-container').hide(); // nascondi footer
  else
    setTimeout(hide_footer, 500);
})();//hide_footer

$('.hellobank-header-row').hide(); // nascondi header

// crea menu piu' semplice
$('<style>#fixed-menu a:hover { background-color: #ccc; border-radius: 0.25rem; }</style>').appendTo('html > head');
var menu_top = parseInt($('iframe[src*=Financial]').height()),
    stili = 'position: fixed; top: '+menu_top+'px; left: 0; border: 1px solid black; padding: 0.2rem; font-size: x-small; text-transform: capitalize; line-height: 1.5rem;',
    menu  = $('<div id="fixed-menu" style="'+stili+'"></div>').appendTo('body');
// cicla tra i riquadri
$('.tile.level0').hide().children('a').each(function () {
  var link = $(this);
  
  var label = link.text().trim().replace(/Le mie|I miei/, '');
  if (label.match(/trading|investimenti|Saving|PAY|Store|Bilancio/)) return;
  if (label.match(/profilo/)) label = 'Profilo/Docs';
  if (label.match(/Mutui/  )) label = 'Mutui/Prestiti';
  
  $('<a href="#" class="linked">'+label+'</a>').appendTo(menu).data('link', link);
  menu.append('<br>')
});

// click onclick sulle voci di menu reali
$('#fixed-menu').on('click', 'a.linked', function (ev) {
  ev.preventDefault();
  $(this).data('link').click();
});

// links per: num messagi non letti, logout, toggle ADS
$('iframe[src*=WelcomeBox]').on('load', function () {
  var frame_wb = $(this).contents();
  
  // aggiunta link msg non letti
  var msg_unread = frame_wb.find('.notify-box.mail span').text().trim();
  menu.find('br:last').replaceWith('<hr style="margin: 0.2rem 0; border: 0; background-color: black;">');
  $('<a href="#" class="linked"><b>'+msg_unread+'</b> unread msg</a>').appendTo(menu).
    data('link', menu.find('a:contains(messaggi)').hide().next().remove().end());
  
  // link toggle ADS
  $('<br><a href="#" onclick="window.ads.toggle(); return false;">Toggle ADS</a>').appendTo(menu);
  
  // link per il logout
  $('<br><a href="'+this.contentWindow.logoutUrl+'">Logout</a>').appendTo(menu);
});
// -----------------------------------------------------------------------------
});})(jQuery);
