$(document).ready(function() {

    var profile_path = 'files/profile_cup.html';

    var vessel = $($('#template_vessel').html());
    vessel.find('g').load(profile_path);
    vessel.find('clipPath').load(profile_path);
    // $("#vessel").append(vessel);

    // $('.pour') //Pour Me Another Drink, Bartender!
    //     .delay(2000)
    //     .animate({
    //         height: '360px'
    //     }, 1500)
    //     .delay(1600)
    //     .animate({
    //         height: '0',
    //         top: '360px'
    //     }, 1500);
    //
    // $('#liquid') // I Said Fill 'Er Up!
    //     .delay(500)
    //     .animate({
    //         height: '90px'
    //     }, 2500);
    //
    // $('.beer-foam') // Keep that Foam Rollin' Toward the Top! Yahooo!
    //     .delay(3400)
    //     .animate({
    //         bottom: '200px'
    //     }, 2500);
});
