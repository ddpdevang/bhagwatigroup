function revolution_slider() {
	var tpj = jQuery;
	tpj.noConflict();

	tpj(document).ready(function() {

		if (tpj.fn.cssOriginal != undefined)
			tpj.fn.css = tpj.fn.cssOriginal;

		var api = tpj('.fullwidthbanner').revolution({
			delay : 9000,
			startwidth : 1170,
			startheight : 580,

			onHoverStop : "on", // Stop Banner Timet at Hover on Slide on/off

			thumbWidth : 100, // Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
			thumbHeight : 50,
			thumbAmount : 3,

			hideThumbs : 200,
			navigationType : "none", // bullet, thumb, none
			navigationArrows : "solo", // nexttobullets, solo (old name verticalcentered), none

			navigationStyle : "round", // round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item), custom

			navigationHAlign : "center", // Vertical Align top,center,bottom
			navigationVAlign : "bottom", // Horizontal Align left,center,right
			navigationHOffset : 30,
			navigationVOffset : -40,

			soloArrowLeftHalign : "left",
			soloArrowLeftValign : "center",
			soloArrowLeftHOffset : 0,
			soloArrowLeftVOffset : 0,

			soloArrowRightHalign : "right",
			soloArrowRightValign : "center",
			soloArrowRightHOffset : 0,
			soloArrowRightVOffset : 0,

			touchenabled : "on", // Enable Swipe Function : on/off

			stopAtSlide : -1, // Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
			stopAfterLoops : -1, // Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic

			hideCaptionAtLimit : 0, // It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
			hideAllCaptionAtLilmit : 0, // Hide all The Captions if Width of Browser is less then this value
			hideSliderAtLimit : 0, // Hide the whole slider, and stop also functions if Width of Browser is less than this value

			fullWidth : "on",

			shadow : 0	//0 = no Shadow, 1,2,3 = 3 Different Art of Shadows -  (No Shadow in Fullwidth Version !)

		});

	});
}

function initialize(lat, lang, mapid) {
	var mapOptions = {
		zoom : 17,
		center : new google.maps.LatLng(lat, lang)

	};

	var map = new google.maps.Map(document.getElementById(mapid), mapOptions);

	var myLatlng = new google.maps.LatLng(lat, lang);

	var marker = new google.maps.Marker({
		position : myLatlng,
		map : map,
		title : 'Uluru (Ayers Rock)'
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, marker);
	});
}

function call_map_on_tab(tabid, mapid, lat, lang) {
	$('a[href="#' + tabid + '"]').on('shown.bs.tab', function(e) {
		initialize(lat, lang, mapid);
	});
}
function select_change() {
	$('.dropbox').change(function() {
		var data_url = $(this).find("option:selected").attr('value');
		if (data_url == "go_to_url") {
			var href = $(this).find("option:selected").attr('data-href');
			window.open(href, '_blank' // <- This is what makes it open in a new window.
			);
			$(this).prev().val($(this).find("option:selected").text());

		} else {
			$(this).prev().val($(this).find("option:selected").text());
		}

	});
}

function select_tab() {
	$('.dropbox').on('change', function() {
		var value = $(this).val();
		$('#mahaavir-height li:eq(' + value + ') a').tab('show');
		$('.big-img').hide();
		$('.project-inner-img').show();
	});

}
function select_tab() {
	$('.dropbox').on('change', function() {
		var value = $(this).val();
		$('.tab_structure li:eq(' + value + ') a').tab('show');
		$('.big-img').hide();
		$('.project-inner-img').show();
	});
}
function projects_tab() {
  $(".projects_list li a").click(function(){
  		$(".projects_list li a").removeClass("active");
  		$(this).addClass("active");
  })
}
function projects_tab_open() {
  $(".projects_list li a.ongoing_project").click(function(){
  		$('#upcoming').hide();
  		$('#ongoing').show();
  })
  
  $(".projects_list li a.upcoming_project").click(function(){
  		$('#ongoing').hide();
  		$('#upcoming').show();
  		
  })
}
function call_gallery() {
	var initPhotoSwipeFromDOM = function(gallerySelector) {
		// parse slide data (url, title, size ...) from DOM elements
		// (children of gallerySelector)
		var parseThumbnailElements = function(el) {
			var thumbElements = el.childNodes,
			    numNodes = thumbElements.length,
			    items = [],
			    figureEl,
			    linkEl,
			    size,
			    item;

			for (var i = 0; i < numNodes; i++) {

				figureEl = thumbElements[i];
				// <figure> element

				// include only element nodes
				if (figureEl.nodeType !== 1) {
					continue;
				}

				linkEl = figureEl.children[0];
				// <a> element

				size = linkEl.getAttribute('data-size').split('x');

				// create slide object
				item = {
					src : linkEl.getAttribute('href'),
					w : parseInt(size[0], 10),
					h : parseInt(size[1], 10)
				};

				if (figureEl.children.length > 1) {
					// <figcaption> content
					item.title = figureEl.children[1].innerHTML;
				}

				if (linkEl.children.length > 0) {
					// <img> thumbnail element, retrieving thumbnail url
					item.msrc = linkEl.children[0].getAttribute('src');
				}

				item.el = figureEl;
				// save link to element for getThumbBoundsFn
				items.push(item);
			}

			return items;
		};

		// find nearest parent element
		var closest = function closest(el, fn) {
			return el && (fn(el) ? el : closest(el.parentNode, fn) );
		};

		// triggers when user clicks on thumbnail
		var onThumbnailsClick = function(e) {
			e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;

			var eTarget = e.target || e.srcElement;

			// find root element of slide
			var clickedListItem = closest(eTarget, function(el) {
				return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
			});

			if (!clickedListItem) {
				return;
			}

			// find index of clicked item by looping through all child nodes
			// alternatively, you may define index via data- attribute
			var clickedGallery = clickedListItem.parentNode,
			    childNodes = clickedListItem.parentNode.childNodes,
			    numChildNodes = childNodes.length,
			    nodeIndex = 0,
			    index;

			for (var i = 0; i < numChildNodes; i++) {
				if (childNodes[i].nodeType !== 1) {
					continue;
				}

				if (childNodes[i] === clickedListItem) {
					index = nodeIndex;
					break;
				}
				nodeIndex++;
			}

			if (index >= 0) {
				// open PhotoSwipe if valid index found
				openPhotoSwipe(index, clickedGallery);
			}
			return false;
		};

		// parse picture index and gallery index from URL (#&pid=1&gid=2)
		var photoswipeParseHash = function() {
			var hash = window.location.hash.substring(1),
			    params = {};

			if (hash.length < 5) {
				return params;
			}

			var vars = hash.split('&');
			for (var i = 0; i < vars.length; i++) {
				if (!vars[i]) {
					continue;
				}
				var pair = vars[i].split('=');
				if (pair.length < 2) {
					continue;
				}
				params[pair[0]] = pair[1];
			}

			if (params.gid) {
				params.gid = parseInt(params.gid, 10);
			}

			return params;
		};

		var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
			var pswpElement = document.querySelectorAll('.pswp')[0],
			    gallery,
			    options,
			    items;

			items = parseThumbnailElements(galleryElement);

			// define options (if needed)
			options = {

				// define gallery index (for URL)
				galleryUID : galleryElement.getAttribute('data-pswp-uid'),

				getThumbBoundsFn : function(index) {
					// See Options -> getThumbBoundsFn section of documentation for more info
					var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
					    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					    rect = thumbnail.getBoundingClientRect();

					return {
						x : rect.left,
						y : rect.top + pageYScroll,
						w : rect.width
					};
				}
			};

			// PhotoSwipe opened from URL
			if (fromURL) {
				if (options.galleryPIDs) {
					// parse real index when custom PIDs are used
					// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
					for (var j = 0; j < items.length; j++) {
						if (items[j].pid == index) {
							options.index = j;
							break;
						}
					}
				} else {
					// in URL indexes start from 1
					options.index = parseInt(index, 10) - 1;
				}
			} else {
				options.index = parseInt(index, 10);
			}

			// exit if index not found
			if (isNaN(options.index)) {
				return;
			}

			if (disableAnimation) {
				options.showAnimationDuration = 0;
			}

			// Pass data to PhotoSwipe and initialize it
			gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
			gallery.init();
		};

		// loop through all gallery elements and bind events
		var galleryElements = document.querySelectorAll(gallerySelector);

		for (var i = 0,
		    l = galleryElements.length; i < l; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i + 1);
			galleryElements[i].onclick = onThumbnailsClick;
		}

		// Parse URL and open gallery if it contains #&pid=3&gid=1
		var hashData = photoswipeParseHash();
		if (hashData.pid && hashData.gid) {
			openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
		}
	};

	// execute above function
	initPhotoSwipeFromDOM('.my-gallery');
}


$('document').ready(function() {
	revolution_slider();
	select_change();
	select_tab();
	select_tab();
	projects_tab();
	projects_tab_open();
	call_gallery();
	
	/*------------JS For google Map------------*/
	call_map_on_tab('location_map', 'googleMap', 19.120502, 72.991469);
	call_map_on_tab('bay_bills_location_map', 'googleMap', 18.971767, 73.016939);
	call_map_on_tab('imperia_location_map', 'googleMap', 18.971767, 73.016939);
	call_map_on_tab('bella_vista_location_map', 'googleMap', 18.976900, 73.032485);
	call_map_on_tab('Kharghar_location_map', 'googleMap', 19.052807, 73.066706);
	

})
