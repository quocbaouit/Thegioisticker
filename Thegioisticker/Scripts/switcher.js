// Change color website
jQuery(".color1").on("click", function() {
    jQuery("#colors").attr("href", "css/colors/color-green.css");
});

jQuery(".color2").on("click", function() {
    jQuery("#colors").attr("href", "css/colors/color-black.css");
});

jQuery(".color3").on("click", function() {
    jQuery("#colors").attr("href", "css/colors/color-gray.css");
});

jQuery(".color4").on("click", function() {
    jQuery("#colors").attr("href", "css/colors/color-lavender.css");
});

jQuery(".color5").on("click", function() {
    jQuery("#colors").attr("href", "css/colors/color-orange.css");
});

$(".switcher-cog").on("click", function() {
    $('#switcher').toggleClass("show");
});