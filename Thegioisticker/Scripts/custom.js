/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Custom Dropdown
4. Init Page Menu
5. Init Deals Slider
6. Init Tab Lines
7. Init Tabs
8. Init Featured Slider
9. Init Favorites
10. Init ZIndex
11. Init Popular Categories Slider
12. Init Banner 2 Slider
13. Init Arrivals Slider
14. Init Arrivals Slider ZIndex
15. Init Best Sellers Slider
16. Init Trends Slider
17. Init Reviews Slider
18. Init Recently Viewed Slider
19. Init Brands Slider
20. Init Timer


******************************/

$(document).ready(function()
{
	"use strict";

	/* 

	1. Vars and Inits

	*/

	var menuActive = false;
	var header = $('.header');

	setHeader();
	initPageMenu();
	initDealsSlider();
	initTabLines();
	//initFeaturedSlider();
	featuredSliderZIndex();
	initPopularSlider();
	initBanner2Slider();

	$(".bannerSlider").slick({
		dots: false
		, autoplay: true
		, infinite: true
		, dots: false
		, slidesToShow: 1
		, slideswToScroll: 1
		, arrows: false
	});

	$(window).on('resize', function()
	{
		setHeader();
		featuredSliderZIndex();
		initTabLines();
	});

	function setHeader()
	{
		//To pin main nav to the top of the page when it's reached
		//uncomment the following

		// var controller = new ScrollMagic.Controller(
		// {
		// 	globalSceneOptions:
		// 	{
		// 		triggerHook: 'onLeave'
		// 	}
		// });

		// var pin = new ScrollMagic.Scene(
		// {
		// 	triggerElement: '.main_nav'
		// })
		// .setPin('.main_nav').addTo(controller);

		if(window.innerWidth > 991 && menuActive)
		{
			closeMenu();
		}
	}


	function initPageMenu()
	{
		if($('.page_menu').length && $('.page_menu_content').length)
		{
			var menu = $('.page_menu');
			var menuContent = $('.page_menu_content');
			var menuTrigger = $('.menu_trigger');

			//Open / close page menu
			menuTrigger.on('click', function()
			{
				if(!menuActive)
				{
					openMenu();
				}
				else
				{
					closeMenu();
				}
			});

			//Handle page menu
			if($('.page_menu_item').length)
			{
				var items = $('.page_menu_item');
				items.each(function()
				{
					var item = $(this);
					if(item.hasClass("has-children"))
					{
						item.on('click', function(evt)
						{
							evt.preventDefault();
							evt.stopPropagation();
							var subItem = item.find('> ul');
						    if(subItem.hasClass('active'))
						    {
						    	subItem.toggleClass('active');
								TweenMax.to(subItem, 0.3, {height:0});
						    }
						    else
						    {
						    	subItem.toggleClass('active');
						    	TweenMax.set(subItem, {height:"auto"});
								TweenMax.from(subItem, 0.3, {height:0});
						    }
						});
					}
				});
			}
		}
	}

	function openMenu()
	{
		var menu = $('.page_menu');
		var menuContent = $('.page_menu_content');
		TweenMax.set(menuContent, {height:"auto"});
		TweenMax.from(menuContent, 0.3, {height:0});
		menuActive = true;
	}

	function closeMenu()
	{
		var menu = $('.page_menu');
		var menuContent = $('.page_menu_content');
		TweenMax.to(menuContent, 0.3, {height:0});
		menuActive = false;
	}

	/* 

	 Init Deals Slider

	*/

	function initDealsSlider()
	{
		if($('.deals_slider').length)
		{
			var dealsSlider = $('.deals_slider');
			dealsSlider.owlCarousel(
			{
				items:1,
				loop:false,
				navClass:['deals_slider_prev', 'deals_slider_next'],
				nav:false,
				dots:false,
				smartSpeed:1200,
				margin:30,
				autoplay:false,
				autoplayTimeout:5000
			});

			if($('.deals_slider_prev').length)
			{
				var prev = $('.deals_slider_prev');
				prev.on('click', function()
				{
					dealsSlider.trigger('prev.owl.carousel');
				});	
			}

			if($('.deals_slider_next').length)
			{
				var next = $('.deals_slider_next');
				next.on('click', function()
				{
					dealsSlider.trigger('next.owl.carousel');
				});	
			}
		}
	}

	/* 

	 Init Tab Lines

	*/

	function initTabLines()
	{
		if($('.tabs').length)
		{
			var tabs = $('.tabs');

			tabs.each(function()
			{
				var tabsItem = $(this);
				var tabsLine = tabsItem.find('.tabs_line span');
				var tabGroup = tabsItem.find('ul li');

				var posX = $(tabGroup[0]).position().left;
				tabsLine.css({'left': posX, 'width': $(tabGroup[0]).width()});
				tabGroup.each(function()
				{
					var tab = $(this);
					tab.on('click', function()
					{
						if(!tab.hasClass('active'))
						{
							tabGroup.removeClass('active');
							tab.toggleClass('active');
							var tabXPos = tab.position().left;
							var tabWidth = tab.width();
							tabsLine.css({'left': tabXPos, 'width': tabWidth});
						}
					});
				});
			});
		}
	}

	/* 

	 Init Tabs

	*/

	function initTabs()
	{
		if($('.tabbed_container').length)
		{
			//Handle tabs switching

			var tabsContainers = $('.tabbed_container');
			tabsContainers.each(function()
			{
				var tabContainer = $(this);
				var tabs = tabContainer.find('.tabs ul li');
				var panels = tabContainer.find('.panel');
				var sliders = panels.find('.slider');

				tabs.each(function()
				{
					var tab = $(this);
					tab.on('click', function()
					{
						panels.removeClass('active');
						var tabIndex = tabs.index(this);
						$($(panels[tabIndex]).addClass('active'));
						sliders.slick("unslick");
						sliders.each(function()
						{
							var slider = $(this);
							// slider.slick("unslick");
							if(slider.hasClass('bestsellers_slider'))
							{
								initBSSlider(slider);
							}
							if(slider.hasClass('featured_slider'))
							{
								initFSlider(slider);
							}
							if(slider.hasClass('arrivals_slider'))
							{
								initASlider(slider);
							}
						});
					});	
				});
			});
		}
	}

	/* 

	 Init ZIndex

	*/

	function featuredSliderZIndex()
	{
		// Hide slider dots on item hover
		var items = document.getElementsByClassName('featured_slider_item');
		
		for(var x = 0; x < items.length; x++)
		{
			var item = items[x];
			item.addEventListener('mouseenter', function()
			{
				$('.featured_slider .slick-dots').css('display', "none");
			});

			item.addEventListener('mouseleave', function()
			{
				$('.featured_slider .slick-dots').css('display', "block");
			});
		}
	}

	/* 

	 Init Popular Categories Slider

	*/

	function initPopularSlider()
	{
		if($('.popular_categories_slider').length)
		{
			var popularSlider = $('.popular_categories_slider');

			popularSlider.owlCarousel(
			{
				loop:true,
				autoplay:false,
				nav:false,
				dots:false,
				responsive:
				{
					0:{items:1},
					575:{items:2},
					640:{items:3},
					768:{items:4},
					991:{items:5}
				}
			});

			if($('.popular_categories_prev').length)
			{
				var prev = $('.popular_categories_prev');
				prev.on('click', function()
				{
					popularSlider.trigger('prev.owl.carousel');
				});
			}

			if($('.popular_categories_next').length)
			{
				var next = $('.popular_categories_next');
				next.on('click', function()
				{
					popularSlider.trigger('next.owl.carousel');
				});
			}
		}
	}

	/* 

	 Init Banner 2 Slider

	*/

	function initBanner2Slider()
	{
		if($('.banner_2_slider').length)
		{
			var banner2Slider = $('.banner_2_slider');
			banner2Slider.owlCarousel(
			{
				items:1,
				loop:true,
				nav:false,
				dots: true,
			    autoplay: true,
				dotsContainer: '.banner_2_dots',
				smartSpeed:1200
			});
		}
	}
});
function showAlert(message) {
	$('.alert').html(message);
	$('.alert').show();
}
function hideAlert(message) {
	$('.alert').html('');
	$('.alert').hide();
}