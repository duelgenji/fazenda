$(document).ready(function() {
    $("#cup").append('                        <svg stroke="#F00" fill-opacity="0" stroke-width="5" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 240 140" style="enable-background:new 0 0 240 140;" width="100%" height="100%"> ' +
        '<path  d="' +
        'M 10 10' +
        'H 220' +
        'C 220 70 220 130 120 130' +
        'C 10 130 10 70 10 10' +
        'z"> ' +
        '</path> ' +
        '</svg>');
    $("#cup").before('    <svg stroke-width="0" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 240 140" style="enable-background:new 0 0 240 140;" width="100%" height="100%"> ' +
        '<defs><clipPath id="cl" transform="translate(8 8)"><path d="M 10 10H 220C 220 70 220 130 120 130C 10 130 10 70 10 10z"></path></clipPath></defs></svg>');
    // $("#cl").append('                    <path d="'+
    // 'M 10 10' +
    // 'H 220' +
    // 'C 220 70 220 130 120 130' +
    // 'C 10 130 10 70 10 10' +
    // 'z"> ' +
    // '</path> ')
    $('.pour') //Pour Me Another Drink, Bartender!
        .delay(2000)
        .animate({
            height: '360px'
        }, 1500)
        .delay(1600)
        .animate({
            height: '0',
            top: '360px'
        }, 1500);

    $('#liquid') // I Said Fill 'Er Up!
        .delay(3400)
        .animate({
            height: '90px'
        }, 2500);

    $('.beer-foam') // Keep that Foam Rollin' Toward the Top! Yahooo!
        .delay(3400)
        .animate({
            bottom: '200px'
        }, 2500);
});
