(function ($) {
	"use strict";
	
	// This case is important when theme is not active
	if (typeof qodef !== 'object') {
		window.qodef = {};
	}
	
	window.qodefCore = {};
	qodefCore.shortcodes = {};
	qodefCore.listShortcodesScripts = {
		qodefSwiper: qodef.qodefSwiper,
		qodefPagination: qodef.qodefPagination,
		qodefFilter: qodef.qodefFilter,
		qodefMasonryLayout: qodef.qodefMasonryLayout,
		qodefJustifiedGallery: qodef.qodefJustifiedGallery,
	};

	qodefCore.body = $('body');
	qodefCore.html = $('html');
	qodefCore.windowWidth = $(window).width();
	qodefCore.windowHeight = $(window).height();
	qodefCore.scroll = 0;

	$(document).ready(function () {
		qodefCore.scroll = $(window).scrollTop();
		qodefInlinePageStyle.init();
	});

	$(window).resize(function () {
		qodefCore.windowWidth = $(window).width();
		qodefCore.windowHeight = $(window).height();
	});

	$(window).scroll(function () {
		qodefCore.scroll = $(window).scrollTop();
	});

	var qodefScroll = {
		disable: function(){
			if (window.addEventListener) {
				window.addEventListener('wheel', qodefScroll.preventDefaultValue, {passive: false});
			}

			// window.onmousewheel = document.onmousewheel = qodefScroll.preventDefaultValue;
			document.onkeydown = qodefScroll.keyDown;
		},
		enable: function(){
			if (window.removeEventListener) {
				window.removeEventListener('wheel', qodefScroll.preventDefaultValue, {passive: false});
			}
			window.onmousewheel = document.onmousewheel = document.onkeydown = null;
		},
		preventDefaultValue: function(e){
			e = e || window.event;
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.returnValue = false;
		},
		keyDown: function(e) {
			var keys = [37, 38, 39, 40];
			for (var i = keys.length; i--;) {
				if (e.keyCode === keys[i]) {
					qodefScroll.preventDefaultValue(e);
					return;
				}
			}
		}
	};

	qodefCore.qodefScroll = qodefScroll;

	var qodefPerfectScrollbar = {
		init: function ($holder) {
			if ($holder.length) {
				qodefPerfectScrollbar.qodefInitScroll($holder);
			}
		},
		qodefInitScroll: function ($holder) {
			var $defaultParams = {
				wheelSpeed: 0.6,
				suppressScrollX: true
			};

			var $ps = new PerfectScrollbar($holder[0], $defaultParams);
			$(window).resize(function () {
				$ps.update();
			});
		}
	};

	qodefCore.qodefPerfectScrollbar = qodefPerfectScrollbar;

	var qodefInlinePageStyle = {
		init: function () {
			this.holder = $('#hendon-core-page-inline-style');

			if (this.holder.length) {
				var style = this.holder.data('style');

				if (style.length) {
					$('head').append('<style type="text/css">' + style + '</style>');
				}
			}
		}
	};

})(jQuery);
(function ($) {
	"use strict";
	
	$(document).ready(function () {
		qodefAgeVerificationModal.init();
	});
	
	var qodefAgeVerificationModal = {
		init: function () {
			this.holder = $('#qodef-age-verification-modal');
			
			if (this.holder.length) {
				var $preventHolder = this.holder.find('.qodef-m-content-prevent');
				
				if ($preventHolder.length) {
					var $preventYesButton = $preventHolder.find('.qodef-prevent--yes');
					
					$preventYesButton.on('click', function () {
						var cname = 'disabledAgeVerification';
						var cvalue = 'Yes';
						var exdays = 7;
						var d = new Date();
						
						d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
						var expires = "expires=" + d.toUTCString();
						document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
						
						qodefAgeVerificationModal.handleClassAndScroll('remove');
					});
				}
			}
		},
		
		handleClassAndScroll: function (option) {
			if (option === 'remove') {
				qodefCore.body.removeClass('qodef-age-verification--opened');
				qodefCore.qodefScroll.enable();
			}
			if (option === 'add') {
				qodefCore.body.addClass('qodef-age-verification--opened');
				qodefCore.qodefScroll.disable();
			}
		},
	};
	
})(jQuery);
(function ($) {
    "use strict";

    $(document).ready(function () {
        qodefBackToTop.init();
    });

    var qodefBackToTop = {
        init: function () {
            this.holder = $('#qodef-back-to-top');

            if (this.holder.length) {
                // Scroll To Top
                this.holder.on('click', function (e) {
                    e.preventDefault();
                    qodefBackToTop.animateScrollToTop();
                });

                qodefBackToTop.showHideBackToTop();
            }
        },
        animateScrollToTop: function () {
            var startPos = qodef.scroll,
                newPos = qodef.scroll,
                step = .9,
                animationFrameId;

            var startAnimation = function () {
                if (newPos === 0) return;
                newPos < 0.0001 ? newPos = 0 : null;
                var ease = qodefBackToTop.easingFunction((startPos - newPos) / startPos);
                $('html, body').scrollTop(startPos - (startPos - newPos) * ease);
                newPos = newPos * step;

                animationFrameId = requestAnimationFrame(startAnimation)
            }
            startAnimation();
            $('html, body').one('wheel touchstart', function () {
                cancelAnimationFrame(animationFrameId);
            });
        },
        easingFunction: function (n) {
            return 0 == n ? 0 : Math.pow(1024, n - 1);
        },
        showHideBackToTop: function () {
            $(window).scroll(function () {
                var $thisItem = $(this),
                    b = $thisItem.scrollTop(),
                    c = $thisItem.height(),
                    d;

                if (b > 0) {
                    d = b + c / 2;
                } else {
                    d = 1;
                }

                if (d < 1e3) {
                    qodefBackToTop.addClass('off');
                } else {
                    qodefBackToTop.addClass('on');
                }
            });
        },
        addClass: function (a) {
            this.holder.removeClass('qodef--off qodef--on');

            if (a === 'on') {
                this.holder.addClass('qodef--on');
            } else {
                this.holder.addClass('qodef--off');
            }
        }
    };

})(jQuery);

(function ($) {
	"use strict";
	
	$(window).on('load', function () {
		qodefUncoverFooter.init();
	});
	
	var qodefUncoverFooter = {
		holder: '',
		init: function () {
			this.holder = $('#qodef-page-footer.qodef--uncover');
			
			if (this.holder.length && !qodefCore.html.hasClass('touchevents')) {
				qodefUncoverFooter.addClass();
				qodefUncoverFooter.setHeight(this.holder);
				
				$(window).resize(function () {
                    qodefUncoverFooter.setHeight(qodefUncoverFooter.holder);
				});
			}
		},
        setHeight: function ($holder) {
	        $holder.css('height', 'auto');
	        
            var footerHeight = $holder.outerHeight();
            
            if (footerHeight > 0) {
                $('#qodef-page-outer').css({'margin-bottom': footerHeight, 'background-color': qodefCore.body.css('backgroundColor')});
                $holder.css('height', footerHeight);
            }
        },
		addClass: function () {
			qodefCore.body.addClass('qodef-page-footer--uncover');
		}
	};
	
})(jQuery);

(function ($) {
	"use strict";
	
	$(document).ready(function () {
		qodefFullscreenMenu.init();
	});
	
	var qodefFullscreenMenu = {
		init: function () {
			var $fullscreenMenuOpener = $('a.qodef-fullscreen-menu-opener'),
				$menuItems = $('#qodef-fullscreen-area nav ul li a');
			
			// Open popup menu
			$fullscreenMenuOpener.on('click', function (e) {
				e.preventDefault();
				
				if (!qodefCore.body.hasClass('qodef-fullscreen-menu--opened')) {
					qodefFullscreenMenu.openFullscreen();
					$(document).keyup(function (e) {
						if (e.keyCode === 27) {
							qodefFullscreenMenu.closeFullscreen();
						}
					});
				} else {
					qodefFullscreenMenu.closeFullscreen();
				}
			});
			
			//open dropdowns
			$menuItems.on('tap click', function (e) {
				var $thisItem = $(this);
				if ($thisItem.parent().hasClass('menu-item-has-children')) {
					e.preventDefault();
					qodefFullscreenMenu.clickItemWithChild($thisItem);
				} else if (($(this).attr('href') !== "http://#") && ($(this).attr('href') !== "#")) {
					qodefFullscreenMenu.closeFullscreen();
				}
			});
		},
		openFullscreen: function () {
			qodefCore.body.removeClass('qodef-fullscreen-menu-animate--out').addClass('qodef-fullscreen-menu--opened qodef-fullscreen-menu-animate--in');
			qodefCore.qodefScroll.disable();
		},
		closeFullscreen: function () {
			qodefCore.body.removeClass('qodef-fullscreen-menu--opened qodef-fullscreen-menu-animate--in').addClass('qodef-fullscreen-menu-animate--out');
			qodefCore.qodefScroll.enable();
			$("nav.qodef-fullscreen-menu ul.sub_menu").slideUp(200);
		},
		clickItemWithChild: function (thisItem) {
			var $thisItemParent = thisItem.parent(),
				$thisItemSubMenu = $thisItemParent.find('.sub-menu').first();
			
			if ($thisItemSubMenu.is(':visible')) {
				$thisItemSubMenu.slideUp(300);
			} else {
				$thisItemSubMenu.slideDown(300);
				$thisItemParent.siblings().find('.sub-menu').slideUp(400);
			}
		}
	};
	
})(jQuery);
(function ($) {
	"use strict";
	
	$(document).ready(function () {
		qodefHeaderScrollAppearance.init();
	});
	
	var qodefHeaderScrollAppearance = {
		appearanceType: function () {
			return qodefCore.body.attr('class').indexOf('qodef-header-appearance--') !== -1 ? qodefCore.body.attr('class').match(/qodef-header-appearance--([\w]+)/)[1] : '';
		},
		init: function () {
			var appearanceType = this.appearanceType();
			
			if (appearanceType !== '' && appearanceType !== 'none') {
                qodefCore[appearanceType + "HeaderAppearance"]();
			}
		}
	};
	
})(jQuery);

(function ($) {
    "use strict";

    $(document).ready(function () {
        qodefMobileHeaderAppearance.init();
    });

    /*
     **	Init mobile header functionality
     */
    var qodefMobileHeaderAppearance = {
        init: function () {
            if (qodefCore.body.hasClass('qodef-mobile-header-appearance--sticky')) {

                var docYScroll1 = qodefCore.scroll,
                    displayAmount = qodefGlobal.vars.mobileHeaderHeight + qodefGlobal.vars.adminBarHeight,
                    $pageOuter = $('#qodef-page-outer');

                qodefMobileHeaderAppearance.showHideMobileHeader(docYScroll1, displayAmount, $pageOuter);
                $(window).scroll(function () {
                    qodefMobileHeaderAppearance.showHideMobileHeader(docYScroll1, displayAmount, $pageOuter);
                    docYScroll1 = qodefCore.scroll;
                });

                $(window).resize(function () {
                    $pageOuter.css('padding-top', 0);
                    qodefMobileHeaderAppearance.showHideMobileHeader(docYScroll1, displayAmount, $pageOuter);
                });
            }
        },
        showHideMobileHeader: function(docYScroll1, displayAmount,$pageOuter){
            if(qodefCore.windowWidth <= 1024) {
                if (qodefCore.scroll > displayAmount * 2) {
                    //set header to be fixed
                    qodefCore.body.addClass('qodef-mobile-header--sticky');

                    //add transition to it
                    setTimeout(function () {
                        qodefCore.body.addClass('qodef-mobile-header--sticky-animation');
                    }, 300); //300 is duration of sticky header animation

                    //add padding to content so there is no 'jumping'
                    $pageOuter.css('padding-top', qodefGlobal.vars.mobileHeaderHeight);
                } else {
                    //unset fixed header
                    qodefCore.body.removeClass('qodef-mobile-header--sticky');

                    //remove transition
                    setTimeout(function () {
                        qodefCore.body.removeClass('qodef-mobile-header--sticky-animation');
                    }, 300); //300 is duration of sticky header animation

                    //remove padding from content since header is not fixed anymore
                    $pageOuter.css('padding-top', 0);
                }

                if ((qodefCore.scroll > docYScroll1 && qodefCore.scroll > displayAmount) || (qodefCore.scroll < displayAmount * 3)) {
                    //show sticky header
                    qodefCore.body.removeClass('qodef-mobile-header--sticky-display');
                } else {
                    //hide sticky header
                    qodefCore.body.addClass('qodef-mobile-header--sticky-display');
                }
            }
        }
    };

})(jQuery);
(function ($) {
	"use strict";

	$(document).ready(function () {
		qodefNavMenu.init();
	});

	var qodefNavMenu = {
		init: function () {
			qodefNavMenu.dropdownBehavior();
			qodefNavMenu.wideDropdownPosition();
			qodefNavMenu.dropdownPosition();
		},
		dropdownBehavior: function () {
			var $menuItems = $('.qodef-header-navigation > ul > li');

			$menuItems.each(function () {
				var $thisItem = $(this);

				if ($thisItem.find('.qodef-drop-down-second').length) {
					$thisItem.waitForImages(function () {
						var $dropdownHolder = $thisItem.find('.qodef-drop-down-second'),
							$dropdownMenuItem = $dropdownHolder.find('.qodef-drop-down-second-inner ul'),
							dropDownHolderHeight = $dropdownMenuItem.outerHeight();

						if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
							$thisItem.on("touchstart mouseenter", function () {
								$dropdownHolder.css({
									'height': dropDownHolderHeight,
									'overflow': 'visible',
									'visibility': 'visible',
									'opacity': '1'
								});
							}).on("mouseleave", function () {
								$dropdownHolder.css({
									'height': '0px',
									'overflow': 'hidden',
									'visibility': 'hidden',
									'opacity': '0'
								});
							});
						} else {
							if (qodefCore.body.hasClass('qodef-drop-down-second--animate-height')) {
								var animateConfig = {
									interval: 0,
									over: function () {
										setTimeout(function () {
											$dropdownHolder.addClass('qodef-drop-down--start').css({
												'visibility': 'visible',
												'height': '0',
												'opacity': '1'
											});
											$dropdownHolder.stop().animate({
												'height': dropDownHolderHeight
											}, 400, 'easeInOutQuint', function () {
												$dropdownHolder.css('overflow', 'visible');
											});
										}, 100);
									},
									timeout: 100,
									out: function () {
										$dropdownHolder.stop().animate({
											'height': '0',
											'opacity': 0
										}, 100, function () {
											$dropdownHolder.css({
												'overflow': 'hidden',
												'visibility': 'hidden'
											});
										});

										$dropdownHolder.removeClass('qodef-drop-down--start');
									}
								};

								$thisItem.hoverIntent(animateConfig);
							} else {
								var config = {
									interval: 0,
									over: function () {
										setTimeout(function () {
											$dropdownHolder.addClass('qodef-drop-down--start').stop().css({ 'height': dropDownHolderHeight });
										}, 150);
									},
									timeout: 150,
									out: function () {
										$dropdownHolder.stop().css({ 'height': '0' }).removeClass('qodef-drop-down--start');
									}
								};

								$thisItem.hoverIntent(config);
							}
						}
					});
				}
			});
		},
		wideDropdownPosition: function () {
			var $menuItems = $(".qodef-header-navigation > ul > li.qodef-menu-item--wide");

			if ($menuItems.length) {
				$menuItems.each(function () {
					var $menuItem = $(this);
					var $menuItemSubMenu = $menuItem.find('.qodef-drop-down-second');

					if ($menuItemSubMenu.length) {
						$menuItemSubMenu.css('left', 0);

						var leftPosition = $menuItemSubMenu.offset().left;

						if (qodefCore.body.hasClass('qodef--boxed')) {
							//boxed layout case
							var boxedWidth = $('.qodef--boxed #qodef-page-wrapper').outerWidth();
							leftPosition = leftPosition - (qodefCore.windowWidth - boxedWidth) / 2;
							$menuItemSubMenu.css({ 'left': -leftPosition, 'width': boxedWidth });

						} else if (qodefCore.body.hasClass('qodef-drop-down-second--full-width')) {
							//wide dropdown full width case
							$menuItemSubMenu.css({ 'left': -leftPosition });
						}
						else {
							//wide dropdown in grid case
							$menuItemSubMenu.css({ 'left': -leftPosition + (qodefCore.windowWidth - $menuItemSubMenu.width()) / 2 });
						}
					}
				});
			}
		},
		dropdownPosition: function () {
			var $menuItems = $('.qodef-header-navigation > ul > li.qodef-menu-item--narrow.menu-item-has-children');

			if ($menuItems.length) {
				$menuItems.each(function () {
					var $thisItem = $(this),
						menuItemPosition = $thisItem.offset().left,
						$dropdownHolder = $thisItem.find('.qodef-drop-down-second'),
						$dropdownMenuItem = $dropdownHolder.find('.qodef-drop-down-second-inner ul'),
						dropdownMenuWidth = $dropdownMenuItem.outerWidth(),
						menuItemFromLeft = $(window).width() - menuItemPosition;

					if (qodef.body.hasClass('qodef--boxed')) {
						//boxed layout case
						var boxedWidth = $('.qodef--boxed #qodef-page-wrapper').outerWidth();
						menuItemFromLeft = boxedWidth - menuItemPosition;
					}

					var dropDownMenuFromLeft;

					if ($thisItem.find('li.menu-item-has-children').length > 0) {
						dropDownMenuFromLeft = menuItemFromLeft - dropdownMenuWidth;
					}

					$dropdownHolder.removeClass('qodef-drop-down--right');
					$dropdownMenuItem.removeClass('qodef-drop-down--right');
					if (menuItemFromLeft < dropdownMenuWidth || dropDownMenuFromLeft < dropdownMenuWidth) {
						$dropdownHolder.addClass('qodef-drop-down--right');
						$dropdownMenuItem.addClass('qodef-drop-down--right');
					}
				});
			}
		}
	};

})(jQuery);
(function ($) {
    "use strict";

    $(window).on('load', function () {
        qodefParallaxBackground.init();
    });

    /**
     * Init global parallax background functionality
     */
    var qodefParallaxBackground = {
        init: function (settings) {
            this.$sections = $('.qodef-parallax');

            // Allow overriding the default config
            $.extend(this.$sections, settings);

            var isSupported = !qodef.windowWidth < 1024 && !qodefCore.body.hasClass('qodef-browser--edge') && !qodefCore.body.hasClass('qodef-browser--ms-explorer');

            if (this.$sections.length && isSupported) {
                this.$sections.each(function () {
                    qodefParallaxBackground.ready($(this));
                });
            }
        },
        ready: function ($section) {
            $section.$imgHolder = $section.find('.qodef-parallax-img-holder');
            $section.$imgWrapper = $section.find('.qodef-parallax-img-wrapper');
            $section.$img = $section.find('img');

            var h = $section.outerHeight(),
                imgWrapperH = $section.$imgWrapper.height();

            $section.movement = 300 * (imgWrapperH - h) / h / 2; //percentage (divided by 2 due to absolute img centering in CSS)

            $section.buffer = window.pageYOffset;
            $section.scrollBuffer = null;


            //calc and init loop
            requestAnimationFrame(function () {
                $section.$imgHolder.animate({opacity: 1}, 100);
                qodefParallaxBackground.calc($section);
                qodefParallaxBackground.loop($section);
            });

            //recalc
            $(window).on('resize', function () {
                qodefParallaxBackground.calc($section);
            });
        },
        calc: function ($section) {
            var wH = $section.$imgWrapper.height(),
                wW = $section.$imgWrapper.width();

            if ($section.$img.width() < wW) {
                $section.$img.css({
                    'width': '100%',
                    'height': 'auto'
                });
            }

            if ($section.$img.height() < wH) {
                $section.$img.css({
                    'height': '100%',
                    'width': 'auto',
                    'max-width': 'unset'
                });
            }
        },
        loop: function ($section) {
            if ($section.scrollBuffer === Math.round(window.pageYOffset)) {
                requestAnimationFrame(function () {
                    qodefParallaxBackground.loop($section);
                }); //repeat loop
                return false; //same scroll value, do nothing
            } else {
                $section.scrollBuffer = Math.round(window.pageYOffset);
            }

            var wH = window.outerHeight,
                sTop = $section.offset().top,
                sH = $section.outerHeight();

            if ($section.scrollBuffer + wH * 1.2 > sTop && $section.scrollBuffer < sTop + sH) {
                var delta = (Math.abs($section.scrollBuffer + wH - sTop) / (wH + sH)).toFixed(4), //coeff between 0 and 1 based on scroll amount
                    yVal = (delta * $section.movement).toFixed(4);

                if ($section.buffer !== delta) {
                    $section.$imgWrapper.css('transform', 'translate3d(0,' + yVal + '%, 0)');
                }

                $section.buffer = delta;
            }

            requestAnimationFrame(function () {
                qodefParallaxBackground.loop($section);
            }); //repeat loop
        }
    };

    qodefCore.qodefParallaxBackground = qodefParallaxBackground;

})(jQuery);
(function ($) {
	"use strict";
	
	$(document).ready(function () {
		qodefReview.init();
	});
	
	var qodefReview = {
		init: function () {
			var ratingHolder = $('#qodef-page-comments-form .qodef-rating-inner');
			
			var addActive = function (stars, ratingValue) {
				for (var i = 0; i < stars.length; i++) {
					var star = stars[i];
					if (i < ratingValue) {
						$(star).addClass('active');
					} else {
						$(star).removeClass('active');
					}
				}
			};
			
			ratingHolder.each(function () {
				var thisHolder = $(this),
					ratingInput = thisHolder.find('.qodef-rating'),
					ratingValue = ratingInput.val(),
					stars = thisHolder.find('.qodef-star-rating');
				
				addActive(stars, ratingValue);
				
				stars.on('click', function () {
					ratingInput.val($(this).data('value')).trigger('change');
				});
				
				ratingInput.change(function () {
					ratingValue = ratingInput.val();
					addActive(stars, ratingValue);
				});
			});
		}
	}
})(jQuery);
(function ($) {
	"use strict";
	
	$(document).ready(function () {
		qodefSideArea.init();
	});
	
	var qodefSideArea = {
		init: function () {
			var $sideAreaOpener = $('a.qodef-side-area-opener'),
				$sideAreaClose = $('#qodef-side-area-close'),
				$sideArea = $('#qodef-side-area');
				qodefSideArea.openerHoverColor($sideAreaOpener);
			// Open Side Area
			$sideAreaOpener.on('click', function (e) {
				e.preventDefault();
				
				if (!qodefCore.body.hasClass('qodef-side-area--opened')) {
					qodefSideArea.openSideArea();
					
					$(document).keyup(function (e) {
						if (e.keyCode === 27) {
							qodefSideArea.closeSideArea();
						}
					});
				} else {
					qodefSideArea.closeSideArea();
				}
			});
			
			$sideAreaClose.on('click', function (e) {
				e.preventDefault();
				qodefSideArea.closeSideArea();
			});
			
			if ($sideArea.length && typeof qodefCore.qodefPerfectScrollbar === 'object') {
				qodefCore.qodefPerfectScrollbar.init($sideArea);
			}
		},
		openSideArea: function () {
			var $wrapper = $('#qodef-page-wrapper');
			var currentScroll = $(window).scrollTop();

			$('.qodef-side-area-cover').remove();
			$wrapper.prepend('<div class="qodef-side-area-cover"/>');
			qodefCore.body.removeClass('qodef-side-area-animate--out').addClass('qodef-side-area--opened qodef-side-area-animate--in');

			$('.qodef-side-area-cover').on('click', function (e) {
				e.preventDefault();
				qodefSideArea.closeSideArea();
			});

			$(window).scroll(function () {
				if (Math.abs(qodefCore.scroll - currentScroll) > 400) {
					qodefSideArea.closeSideArea();
				}
			});

		},
		closeSideArea: function () {
			qodefCore.body.removeClass('qodef-side-area--opened qodef-side-area-animate--in').addClass('qodef-side-area-animate--out');
		},
		openerHoverColor: function ($opener) {
			if (typeof $opener.data('hover-color') !== 'undefined') {
				var hoverColor = $opener.data('hover-color');
				var originalColor = $opener.css('color');
				
				$opener.on('mouseenter', function () {
					$opener.css('color', hoverColor);
				}).on('mouseleave', function () {
					$opener.css('color', originalColor);
				});
			}
		}
	};
	
})(jQuery);

(function ($) {
	"use strict";

	$(document).ready(function () {
		qodefSpinner.init();
	});

	var qodefSpinner = {
		init: function () {
			this.holder = $('#qodef-page-spinner:not(.qodef-layout--hendon)');

			if (this.holder.length) {
				qodefSpinner.animateSpinner(this.holder);
			}
		},
		animateSpinner: function ($holder) {
			$(window).on('load', function () {
				qodefSpinner.fadeOutLoader($holder);
			});

			if (window.elementorFrontend) {
				qodefSpinner.fadeOutLoader($holder);
			}
		},
		fadeOutLoader: function ($holder, speed, delay, easing) {
			speed = speed ? speed : 600;
			delay = delay ? delay : 0;
			easing = easing ? easing : 'swing';

			$holder.delay(delay).fadeOut(speed, easing);

			$(window).on('bind', 'pageshow', function (event) {
				if (event.originalEvent.persisted) {
					$holder.fadeOut(speed, easing);
				}
			});
		}
	}

})(jQuery);
(function ($) {
    "use strict";

    $(window).on('load', function () {
        qodefSubscribeModal.init();
    });

    var qodefSubscribeModal = {
        init: function () {
            this.holder = $('#qodef-subscribe-popup-modal');

            if (this.holder.length) {
                var $preventHolder = this.holder.find('.qodef-sp-prevent'),
                    $modalClose = $('.qodef-sp-close'),
                    disabledPopup = 'no';

                if ($preventHolder.length) {
                    var isLocalStorage = this.holder.hasClass('qodef-sp-prevent-cookies'),
                        $preventInput = $preventHolder.find('.qodef-sp-prevent-input'),
                        preventValue = $preventInput.data('value');

                    if (isLocalStorage) {
                        disabledPopup = localStorage.getItem('disabledPopup');
                        sessionStorage.removeItem('disabledPopup');
                    } else {
                        disabledPopup = sessionStorage.getItem('disabledPopup');
                        localStorage.removeItem('disabledPopup');
                    }

                    $preventHolder.children().on('click', function (e) {
                        if (preventValue !== 'yes') {
                            preventValue = 'yes';
                            $preventInput.addClass('qodef-sp-prevent-clicked').data('value', 'yes');
                        } else {
                            preventValue = 'no';
                            $preventInput.removeClass('qodef-sp-prevent-clicked').data('value', 'no');
                        }

                        if (preventValue === 'yes') {
                            if (isLocalStorage) {
                                localStorage.setItem('disabledPopup', 'yes');
                            } else {
                                sessionStorage.setItem('disabledPopup', 'yes');
                            }
                        } else {
                            if (isLocalStorage) {
                                localStorage.setItem('disabledPopup', 'no');
                            } else {
                                sessionStorage.setItem('disabledPopup', 'no');
                            }
                        }
                    });
                }

                if (disabledPopup !== 'yes') {
                    if (qodefCore.body.hasClass('qodef-sp-opened')) {
                        qodefSubscribeModal.handleClassAndScroll('remove');
                    } else {
                        qodefSubscribeModal.handleClassAndScroll('add');
                    }

                    $modalClose.on('click', function (e) {
                        e.preventDefault();

                        qodefSubscribeModal.handleClassAndScroll('remove');
                    });

                    // Close on escape
                    $(document).keyup(function (e) {
                        if (e.keyCode === 27) { // KeyCode for ESC button is 27
                            qodefSubscribeModal.handleClassAndScroll('remove');
                        }
                    });
                }
            }
        },

        handleClassAndScroll: function (option) {
            if (option === 'remove') {
                qodefCore.body.removeClass('qodef-sp-opened');
                qodefCore.qodefScroll.enable();
            }
            if (option === 'add') {
                qodefCore.body.addClass('qodef-sp-opened');
                qodefCore.qodefScroll.disable();
            }
        },
    };

})(jQuery);
(function ($) {
	"use strict";

	qodefCore.shortcodes.hendon_core_accordion = {};

	$(document).ready(function () {
		qodefAccordion.init();
	});
	
	var qodefAccordion = {
		init: function () {
			this.holder = $('.qodef-accordion');
			
			if (this.holder.length) {
				this.holder.each(function () {
					var $thisHolder = $(this);
					
					if ($thisHolder.hasClass('qodef-behavior--accordion')) {
						qodefAccordion.initAccordion($thisHolder);
					}
					
					if ($thisHolder.hasClass('qodef-behavior--toggle')) {
						qodefAccordion.initToggle($thisHolder);
					}
					
					$thisHolder.addClass('qodef--init');
				});
			}
		},
		initAccordion: function ($accordion) {
			$accordion.accordion({
				animate: "swing",
				collapsible: true,
				active: 0,
				icons: "",
				heightStyle: "content"
			});
		},
		initToggle: function ($toggle) {
			var $toggleAccordionTitle = $toggle.find('.qodef-accordion-title'),
				$toggleAccordionContent = $toggleAccordionTitle.next();
			
			$toggle.addClass("accordion ui-accordion ui-accordion-icons ui-widget ui-helper-reset");
			$toggleAccordionTitle.addClass("ui-accordion-header ui-state-default ui-corner-top ui-corner-bottom");
			$toggleAccordionContent.addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").hide();
			
			$toggleAccordionTitle.each(function () {
				var $thisTitle = $(this);
				
				$thisTitle.hover(function () {
					$thisTitle.toggleClass("ui-state-hover");
				});
				
				$thisTitle.on('click', function () {
					$thisTitle.toggleClass('ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom');
					$thisTitle.next().toggleClass('ui-accordion-content-active').slideToggle(400);
				});
			});
		}
	};

	qodefCore.shortcodes.hendon_core_accordion.qodefAccordion = qodefAccordion;

})(jQuery);
(function ($) {
	"use strict";

	qodefCore.shortcodes.hendon_core_button = {};

	$(document).ready(function () {
		qodefButton.init();
	});

	var qodefButton = {
		init: function () {
			this.buttons = $('.qodef-button');

			if (this.buttons.length) {
				this.buttons.each(function () {
					var $thisButton = $(this);

					qodefButton.buttonHoverColor($thisButton);
					qodefButton.buttonHoverBgColor($thisButton);
					qodefButton.buttonHoverBorderColor($thisButton);
					qodefButton.buttonBordersAnimation($thisButton);
				});
			}
		},
		buttonHoverColor: function ($button) {
			if (typeof $button.data('hover-color') !== 'undefined') {
				var hoverColor = $button.data('hover-color');
				var originalColor = $button.css('color');

				$button.on('mouseenter', function () {
					qodefButton.changeColor($button, 'color', hoverColor);
				});
				$button.on('mouseleave', function () {
					qodefButton.changeColor($button, 'color', originalColor);
				});
			}
		},
		buttonHoverBgColor: function ($button) {
			if (typeof $button.data('hover-background-color') !== 'undefined') {
				var hoverBackgroundColor = $button.data('hover-background-color');
				var originalBackgroundColor = $button.css('background-color');

				$button.on('mouseenter', function () {
					qodefButton.changeColor($button, 'background-color', hoverBackgroundColor);
				});
				$button.on('mouseleave', function () {
					qodefButton.changeColor($button, 'background-color', originalBackgroundColor);
				});
			}
		},
		buttonHoverBorderColor: function ($button) {
			if (typeof $button.data('hover-border-color') !== 'undefined' && !$button.hasClass('qodef-layout--outlined') && !$button.hasClass('qodef-layout--filled')) {
				var hoverBorderColor = $button.data('hover-border-color');
				var originalBorderColor = $button.css('borderTopColor');

				$button.on('mouseenter', function () {
					qodefButton.changeColor($button, 'border-color', hoverBorderColor);
				});
				$button.on('mouseleave', function () {
					qodefButton.changeColor($button, 'border-color', originalBorderColor);
				});
			}
		},
		changeColor: function ($button, cssProperty, color) {
			$button.css(cssProperty, color);
		},
		buttonBordersAnimation: function ($button) {
			if ($button.hasClass('qodef-layout--outlined') || $button.hasClass('qodef-layout--filled') || $button.hasClass('qodef-type--filled')) {
				var borderColor = $button.data('border-color'),
					borderHoverColor = $button.data('hover-border-color');

				qodefButton.appendBorders($button);

				setTimeout(function () {
					$button.find('.qodef-border-holder').css('border-color', borderColor);
					$button.find('.qodef-border-holder span').css('background-color', borderHoverColor);
					$button.addClass('qodef-layout--borders-animated');
				}, 10);
			}
		},
		appendBorders: function ($element) {
			$element.prepend('<span class="qodef-border-holder"><span class="qodef-top-border"></span><span class="qodef-right-border"></span><span class="qodef-bottom-border"></span><span class="qodef-left-border"></span></span>');
		}
	};

	qodefCore.shortcodes.hendon_core_button.qodefButton = qodefButton;


})(jQuery);
(function ($) {
	"use strict";

	qodefCore.shortcodes.hendon_core_cards_gallery = {};

	$(document).ready(function () {
		qodefCardsGallery.init();
	});
	
	var qodefCardsGallery = {
		init: function () {
			this.holder = $('.qodef-cards-gallery');
			
			if (this.holder.length) {
				this.holder.each(function () {
					var $thisHolder = $(this);
					qodefCardsGallery.initCards( $thisHolder );
					qodefCardsGallery.initBundle( $thisHolder );
				});
			}
		},
		initCards: function ($holder) {
			var $cards = $holder.find('.qodef-m-card');
			$cards.each(function () {
				var $card = $(this);
				
				$card.on('click', function () {
					if (!$cards.last().is($card)) {
						$card.addClass('qodef-out qodef-animating').siblings().addClass('qodef-animating-siblings');
						$card.detach();
						$card.insertAfter($cards.last());
						
						setTimeout(function () {
							$card.removeClass('qodef-out');
						}, 200);
						
						setTimeout(function () {
							$card.removeClass('qodef-animating').siblings().removeClass('qodef-animating-siblings');
						}, 1200);
						
						$cards = $holder.find('.qodef-m-card');
						
						return false;
					}
				});
				
				
			});
		},
		initBundle: function($holder) {
			if ($holder.hasClass('qodef-animation--bundle') && !qodefCore.html.hasClass('touchevents')) {
				$holder.appear(function () {
					$holder.addClass('qodef-appeared');
					$holder.find('img').one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
						$(this).addClass('qodef-animation-done');
					});
				}, {accX: 0, accY: -100});
			}
		}
	};

	qodefCore.shortcodes.hendon_core_cards_gallery.qodefCardsGallery  = qodefCardsGallery;
	
})(jQuery);
(function ($) {
	"use strict";

	qodefCore.shortcodes.hendon_core_countdown = {};

	$(document).ready(function () {
		qodefCountdown.init();
	});
	
	var qodefCountdown = {
		init: function () {
			this.countdowns = $('.qodef-countdown');
			
			if (this.countdowns.length) {
				this.countdowns.each(function () {
					var $thisCountdown = $(this),
						$countdownElement = $thisCountdown.find('.qodef-m-date'),
						options = qodefCountdown.generateOptions($thisCountdown);
					
					qodefCountdown.initCountdown($countdownElement, options);
				});
			}
		},
		generateOptions: function($countdown) {
			var options = {};
			options.date = typeof $countdown.data('date') !== 'undefined' ? $countdown.data('date') : null;
			
			options.weekLabel = typeof $countdown.data('week-label') !== 'undefined' ? $countdown.data('week-label') : '';
			options.weekLabelPlural = typeof $countdown.data('week-label-plural') !== 'undefined' ? $countdown.data('week-label-plural') : '';
			
			options.dayLabel = typeof $countdown.data('day-label') !== 'undefined' ? $countdown.data('day-label') : '';
			options.dayLabelPlural = typeof $countdown.data('day-label-plural') !== 'undefined' ? $countdown.data('day-label-plural') : '';
			
			options.hourLabel = typeof $countdown.data('hour-label') !== 'undefined' ? $countdown.data('hour-label') : '';
			options.hourLabelPlural = typeof $countdown.data('hour-label-plural') !== 'undefined' ? $countdown.data('hour-label-plural') : '';
			
			options.minuteLabel = typeof $countdown.data('minute-label') !== 'undefined' ? $countdown.data('minute-label') : '';
			options.minuteLabelPlural = typeof $countdown.data('minute-label-plural') !== 'undefined' ? $countdown.data('minute-label-plural') : '';
			
			options.secondLabel = typeof $countdown.data('second-label') !== 'undefined' ? $countdown.data('second-label') : '';
			options.secondLabelPlural = typeof $countdown.data('second-label-plural') !== 'undefined' ? $countdown.data('second-label-plural') : '';
			
			return options;
		},
		initCountdown: function ($countdownElement, options) {
			var $weekHTML = '<span class="qodef-digit-wrapper"><span class="qodef-digit">%w</span><span class="qodef-label">' + '%!w:' + options.weekLabel + ',' + options.weekLabelPlural + ';</span></span>';
			var $dayHTML = '<span class="qodef-digit-wrapper"><span class="qodef-digit">%d</span><span class="qodef-label">' + '%!d:' + options.dayLabel + ',' + options.dayLabelPlural + ';</span></span>';
			var $hourHTML = '<span class="qodef-digit-wrapper"><span class="qodef-digit">%H</span><span class="qodef-label">' + '%!H:' + options.hourLabel + ',' + options.hourLabelPlural + ';</span></span>';
			var $minuteHTML = '<span class="qodef-digit-wrapper"><span class="qodef-digit">%M</span><span class="qodef-label">' + '%!M:' + options.minuteLabel + ',' + options.minuteLabelPlural + ';</span></span>';
			var $secondHTML = '<span class="qodef-digit-wrapper"><span class="qodef-digit">%S</span><span class="qodef-label">' + '%!S:' + options.secondLabel + ',' + options.secondLabelPlural + ';</span></span>';
			
			$countdownElement.countdown(options.date, function(event) {
				$(this).html(event.strftime($weekHTML + $dayHTML + $hourHTML + $minuteHTML + $secondHTML));
			});
		}
	};

	qodefCore.shortcodes.hendon_core_countdown.qodefCountdown  = qodefCountdown;


})(jQuery);
(function ($) {
	"use strict";

	qodefCore.shortcodes.hendon_core_counter = {};

	$(document).ready(function () {
		qodefCounter.init();
	});

	var qodefCounter = {
		init: function () {
			this.counters = $('.qodef-counter');

			if (this.counters.length) {
				this.counters.each(function () {
					var $thisCounter = $(this),
						$counterElement = $thisCounter.find('.qodef-m-digit'),
						options = qodefCounter.generateOptions($thisCounter);

					qodefCounter.counterScript($thisCounter, $counterElement, options);
				});
			}
		},
		generateOptions: function ($counter) {
			var options = {};
			options.start = typeof $counter.data('start-digit') !== 'undefined' && $counter.data('start-digit') !== '' ? $counter.data('start-digit') : 0;
			options.end = typeof $counter.data('end-digit') !== 'undefined' && $counter.data('end-digit') !== '' ? $counter.data('end-digit') : null;
			options.step = typeof $counter.data('step-digit') !== 'undefined' && $counter.data('step-digit') !== '' ? $counter.data('step-digit') : 1;
			options.delay = typeof $counter.data('step-delay') !== 'undefined' && $counter.data('step-delay') !== '' ? parseInt($counter.data('step-delay'), 10) : 100;
			options.txt = typeof $counter.data('digit-label') !== 'undefined' && $counter.data('digit-label') !== '' ? $counter.data('digit-label') : '';

			return options;
		},
		counterScript: function ($thisCounter, $counterElement, options) {
			var defaults = {
				start: 0,
				end: null,
				step: 1,
				delay: 100,
				txt: ""
			};

			var settings = $.extend(defaults, options || {});
			var nb_start = settings.start;
			var nb_end = settings.end;

			$counterElement.text(nb_start + settings.txt);

			var counter = function () {
				// Definition of conditions of arrest
				if (nb_end !== null && nb_start >= nb_end) {
					return;
				}
				// incrementation
				nb_start = nb_start + settings.step;

				if (nb_start >= nb_end) {
					nb_start = nb_end;
				}
				// display
				$counterElement.text(nb_start + settings.txt);
			};

			// Timer - launches every "settings.delay"
			if ($thisCounter.hasClass('qodef-layout--simple')) {
				var appearOffsetY = 400;
				$counterElement.text(nb_end);
				qodef.qodefSplitTextToSpans.init($counterElement);
				$counterElement.find('span').css({ 'display': 'inline-block', 'opacity': 0 });
				if ($counterElement.offset().top > qodef.windowHeight * .8 && $counterElement.offset().top < qodef.windowHeight * 2) {
					appearOffsetY = -50;
				}
				$counterElement.appear(function () {
					setTimeout(function () {
						qodefCounter.animateSimpleCounter($counterElement.find('span'));
					}, qodef.qodefGetRandomIntegerInRange.init(0, 600));
				}, { accX: 0, accY: appearOffsetY });
			} else {
				$counterElement.appear(function () {
					setInterval(counter, settings.delay);
				}, { accX: 0, accY: 0 });
			}
		},
		animateSimpleCounter: function ($element) {
			TweenMax.staggerFromTo($element, 1, {
				opacity: 0,
				y: function (index) { return index % 2 === 0 ? -15 : 15 }
			}, {
				opacity: 1,
				y: 0,
				ease: Power3.easeOut
			}, .3);
		}
	};

	qodefCore.shortcodes.hendon_core_counter.qodefCounter = qodefCounter;

})(jQuery);
(function ( $ ) {
	'use strict';

	qodefCore.shortcodes.hendon_core_google_map = {};

	$( document ).on(
		'qodefGoogleMapsCallbackEvent',
		function () {
			qodefGoogleMap.init();
		}
	);

	var qodefGoogleMap = {
		init: function () {
			this.holder = $( '.qodef-google-map' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefGoogleMap.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( typeof window.qodefGoogleMap !== 'undefined' ) {
				window.qodefGoogleMap.init( $currentItem.find( '.qodef-m-map' ) );
			}
		},
	};

	qodefCore.shortcodes.hendon_core_google_map.qodefGoogleMap = qodefGoogleMap;

})( jQuery );

(function ($) {
    "use strict";

	qodefCore.shortcodes.hendon_core_icon = {};

    $(document).ready(function () {
        qodefIcon.init();
    });

    var qodefIcon = {
        init: function () {
            this.icons = $('.qodef-icon-holder');

            if (this.icons.length) {
                this.icons.each(function () {
                    var $thisIcon = $(this);

                    qodefIcon.iconHoverColor($thisIcon);
                    qodefIcon.iconHoverBgColor($thisIcon);
                    qodefIcon.iconHoverBorderColor($thisIcon);
                });
            }
        },
        iconHoverColor: function ($iconHolder) {
            if (typeof $iconHolder.data('hover-color') !== 'undefined') {
                var spanHolder = $iconHolder.find('span');
                var originalColor = spanHolder.css('color');
                var hoverColor = $iconHolder.data('hover-color');

                $iconHolder.on('mouseenter', function () {
                    qodefIcon.changeColor(spanHolder, 'color', hoverColor);
                });
                $iconHolder.on('mouseleave', function () {
                    qodefIcon.changeColor(spanHolder, 'color', originalColor);
                });
            }
        },
        iconHoverBgColor: function ($iconHolder) {
            if (typeof $iconHolder.data('hover-background-color') !== 'undefined') {
                var hoverBackgroundColor = $iconHolder.data('hover-background-color');
                var originalBackgroundColor = $iconHolder.css('background-color');

                $iconHolder.on('mouseenter', function () {
                    qodefIcon.changeColor($iconHolder, 'background-color', hoverBackgroundColor);
                });
                $iconHolder.on('mouseleave', function () {
                    qodefIcon.changeColor($iconHolder, 'background-color', originalBackgroundColor);
                });
            }
        },
        iconHoverBorderColor: function ($iconHolder) {
            if (typeof $iconHolder.data('hover-border-color') !== 'undefined') {
                var hoverBorderColor = $iconHolder.data('hover-border-color');
                var originalBorderColor = $iconHolder.css('borderTopColor');

                $iconHolder.on('mouseenter', function () {
                    qodefIcon.changeColor($iconHolder, 'border-color', hoverBorderColor);
                });
                $iconHolder.on('mouseleave', function () {
                    qodefIcon.changeColor($iconHolder, 'border-color', originalBorderColor);
                });
            }
        },
        changeColor: function (iconElement, cssProperty, color) {
            iconElement.css(cssProperty, color);
        }
    };

	qodefCore.shortcodes.hendon_core_icon.qodefIcon = qodefIcon;

})(jQuery);
(function ($) {
    "use strict";

    qodefCore.shortcodes.hendon_core_icon_with_text = {};

    $(document).ready(function () {
        qodefIconWithTextBox.init();
        qodefIconWithTextCircle.init();
    });

    var qodefIconWithTextBox = {
        init: function () {
            this.icons = $('.qodef-icon-with-text.qodef-layout--content-in-box');

            if (this.icons.length) {
                this.icons.each(function () {
                    var $thisIconBox = $(this);

                    qodefIconWithTextBox.iconBoxBgColor($thisIconBox);
                });
            }
        },

        iconBoxBgColor: function ($iconBox) {
            if (typeof $iconBox.data('hover-background-color') !== 'undefined') {
                var hoverBackgroundColor = $iconBox.data('hover-background-color');
                var originalBackgroundColor = $iconBox.css('background-color');

                $iconBox.on('mouseenter', function () {
                    qodefIconWithTextBox.changeColor($iconBox, 'background-color', hoverBackgroundColor);
                });
                $iconBox.on('mouseleave', function () {
                    qodefIconWithTextBox.changeColor($iconBox, 'background-color', originalBackgroundColor);
                });
            }
        },

        changeColor: function ($iconBox, cssProperty, color) {
            $iconBox.css(cssProperty, color);
        }
    };

    var qodefIconWithTextCircle = {
        init: function () {
            var $holder = $('.qodef-icon-with-text.qodef--circle-frame-enabled');

            if ($holder.length) {
                $holder.each(function () {
                    var $thisHolder = $(this),
                        circleColor = $thisHolder.data('circle-color'),
                        circleHoverColor = $thisHolder.data('circle-hover-color');

                    $thisHolder.find('.qodef-svg-circle circle:nth-child(1)').css('stroke', circleColor);
                    $thisHolder.find('.qodef-svg-circle circle:nth-child(2)').css('stroke', circleHoverColor);
                });
            }
        }
    }

    qodefCore.shortcodes.hendon_core_icon_with_text.qodefIconWithTextBox = qodefIconWithTextBox;
    qodefCore.shortcodes.hendon_core_icon_with_text.qodefIconWithTextCircle = qodefIconWithTextCircle;

})(jQuery);
(function ($) {
    "use strict";
	qodefCore.shortcodes.hendon_core_image_gallery = {};
	qodefCore.shortcodes.hendon_core_image_gallery.qodefSwiper = qodef.qodefSwiper;
	qodefCore.shortcodes.hendon_core_image_gallery.qodefMasonryLayout = qodef.qodefMasonryLayout;

})(jQuery);
(function ($) {
    "use strict";

    $(document).ready(function () {
        qodefNumberedCarousel.init();
    });

    var qodefNumberedCarousel = {

        init: function () {
            var setup = function (carousel) {
                var swiper = new Swiper(carousel[0], {
                    speed: 300,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    allowTouchMove: false,
                    init: false
                });

                var holder = carousel.closest('.qodef-numbered-carousel'),
                    bgItems = holder.find('.qodef-m-bg-item'),
                    indicators = holder.find('.qodef-m-indicator'),
                    gridTrigger = holder.find('.qodef-m-grid-line:last-child');

                swiper.on('init', function () {
                    holder.data('items', bgItems.length);

                    iterate(holder, carousel, bgItems, indicators, carousel.find('.swiper-wrapper'));
                    changeActiveSlide(holder, swiper);

                    //initial animation
                    carousel
                        .addClass('qodef-show')
                        .one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function () {
                            holder.addClass('qodef-initialized');
                            gridTrigger.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function () {
                                holder.data('idle', true);
                            });
                        });
                });

                swiper.on('slideChangeTransitionEnd', function () {
                    iterate(holder, carousel, bgItems, indicators, carousel.find('.swiper-wrapper'));

                    //wait for last item to unmask
                    holder.removeClass('qodef-mask');
                    gridTrigger.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function () {
                        holder.data('idle', true);
                    });
                });

                //initialize swiper
                carousel.waitForImages(function () {
                    swiper.init()
                });
            }

            //toggle on every slide iteration
            var iterate = function (holder, carousel, bgItems, indicators, wrapper) {
                setActiveIndex(holder, carousel);
                changeActiveItem(holder, bgItems);
                changeActiveItem(holder, indicators);
            }

            //fix swiper calcs for center layout type
            var roundTransformVal = function (wrapper) {
                var val = Math.round(wrapper.css('transform').split(',')[4]);

                wrapper.css('transform', 'matrix(1, 0, 0, 1, ' + val + ', 0)');
            }

            //sets active index to holder element
            var setActiveIndex = function (holder, carousel) {
                var activeIndex = carousel.find('.swiper-slide-active').data('index');
                holder.data('active-index', activeIndex);
            }

            //change css class
            var changeClass = function (holder, cssClass) {
                holder
                    .removeClass('qodef-next qodef-prev')
                    .addClass(cssClass);
            }

            //declarative item change - bg item, indicators
            var changeActiveItem = function (holder, items) {
                var activeItem = items.filter(function () {
                    return $(this).data("index") == holder.data('active-index')
                });

                items.removeClass('qodef-active');
                activeItem.addClass('qodef-active');

                items.removeClass('qodef-prev');
                activeItem.prev().addClass('qodef-prev');

                items.removeClass('qodef-next');
                activeItem.next().addClass('qodef-next');
            }

            //declarative slide change
            var changeActiveSlide = function (holder, swiper) {
                var delay = 0,
                    speed = 800;

                var slideTo = function (holder, swiper, direction) {
                    changeClass(holder, 'qodef-' + direction);

                    holder.data('idle', false);
                    holder.addClass('qodef-mask');

                    if (direction == 'next') {
                        setTimeout(function () {
                            swiper.slideNext(speed);
                        }, delay);
                    } else {
                        //fade before transition
                        holder.addClass('qodef-fade-prev-content');
                        setTimeout(function () {
                            holder.removeClass('qodef-fade-prev-content');
                            swiper.slidePrev(speed);
                        }, delay * 1.5);
                    }
                }

                var clickHandler = function (e) {
                    var item = $(e.currentTarget);

                    if (item.hasClass('swiper-slide-next')) {
                        holder.data('idle') && slideTo(holder, swiper, 'next');
                    } else if (item.hasClass('swiper-slide-prev')) {
                        holder.data('idle') && slideTo(holder, swiper, 'prev');
                    }
                }

                var wheelHandler = function (e) {
                    if (holder.data('idle')) {
                        var direction = e.deltaY > 0 ? 'next' : 'prev',
                            activeIndex = holder.data('active-index');

                        if (direction == 'next' && activeIndex < holder.data('items') ||
                            direction == 'prev' && activeIndex > 1) {
                            slideTo(holder, swiper, direction);
                        }
                    }
                }

                var touchStart = function (e) {
                    holder.data('touch-start', parseInt(e.changedTouches[0].clientX));
                }

                var touchMove = function (e) {
                    holder.data('touch-move', parseInt(e.changedTouches[0].clientX));

                    var delta = holder.data('touch-move') - holder.data('touch-start');

                    if (holder.data('idle')) {
                        var direction = delta < 0 ? 'next' : 'prev',
                            activeIndex = holder.data('active-index');

                        if (direction == 'next' && activeIndex < holder.data('items') ||
                            direction == 'prev' && activeIndex > 1) {
                            slideTo(holder, swiper, direction);
                        }
                    }
                }

                holder.on('click', '.swiper-slide', clickHandler);
                if (holder.hasClass('qodef-change-on-scroll')) {
                    holder[0].addEventListener('wheel', wheelHandler);
                    Modernizr.touch && holder[0].addEventListener('touchstart', touchStart);
                    Modernizr.touch && holder[0].addEventListener('touchmove', touchMove);
                }

                var indicator = holder.find('.qodef-m-indicator');
                indicator.on('click', function () {
                    var indicatorIndex = $(this).data('index'),
                        activeIndicatorIndex = holder.find('.qodef-m-indicator.qodef-active').data('index');

                    if (indicatorIndex < activeIndicatorIndex && indicatorIndex === activeIndicatorIndex - 1) {
                        slideTo(holder, swiper, 'prev');
                    }

                    if (indicatorIndex > activeIndicatorIndex && indicatorIndex === activeIndicatorIndex + 1) {
                        slideTo(holder, swiper, 'next');
                    }
                });

                if (qodef.windowWidth < 1025) {
                    var dragEvent = {
                        down: 'touchstart',
                        up: 'touchend',
                        target: 'srcElement',
                    }

                    var getXPos = function (e) {
                        return e.originalEvent.changedTouches[0].clientX;
                    }

                    var touchScrolling = function (oldEvent, newEvent) {
                        var oldY = oldEvent.originalEvent.changedTouches[0].clientY,
                            newY = newEvent.originalEvent.changedTouches[0].clientY;

                        if (Math.abs(newY - oldY) > 100) { // 100 is drag sensitivity
                            return true;
                        };
                        return false;
                    }

                    var mouseDown = false;
                    holder.on(dragEvent.down, function (e) {
                        if (!mouseDown && !$(e[dragEvent.target]).is('a, span')) {
                            var oldEvent = e,
                                xPos = getXPos(e);
                            mouseDown = true;

                            holder.one(dragEvent.up, function (e) {
                                var xPosNew = getXPos(e);
                                if (Math.abs(xPos - xPosNew) > 10 && !touchScrolling(oldEvent, e)) {
                                    var activeIndex = holder.data('active-index');
                                    if (xPos > xPosNew) {
                                        activeIndex < holder.data('items') && slideTo(holder, swiper, 'next');
                                    } else {
                                        activeIndex > 1 && slideTo(holder, swiper, 'prev');
                                    }
                                }
                                mouseDown = false;
                            });
                        }
                    });
                }
            }

            var carousels = $('.qodef-numbered-carousel');
            if (carousels.length) {
                carousels.each(function () {
                    var carousel = $(this).find('.swiper-container');
                    setup(carousel);
                });
            }
        }

    };

    qodefCore.shortcodes.hendon_core_numered_carousel = qodefNumberedCarousel;

})(jQuery);
(function ($) {
    'use strict';

    qodefCore.shortcodes.hendon_core_progress_bar = {};

    $(document).ready(function () {
        qodefProgressBar.init();
    });

    /**
     * Init progress bar shortcode functionality
     */
    var qodefProgressBar = {
        init: function () {
            this.holder = $('.qodef-progress-bar');

            if (this.holder.length) {
                this.holder.each(function () {
                    var $thisHolder = $(this),
                        layout = $thisHolder.data('layout');

                    $thisHolder.appear(function () {
                        $thisHolder.addClass('qodef--init');

                        var $container = $thisHolder.find('.qodef-m-canvas'),
                            data = qodefProgressBar.generateBarData($thisHolder, layout),
                            number = $thisHolder.data('number') / 100;

                        switch (layout) {
                            case 'circle':
                                qodefProgressBar.initCircleBar($container, data, number);
                                break;
                            case 'semi-circle':
                                qodefProgressBar.initSemiCircleBar($container, data, number);
                                break;
                            case 'line':
                                data = qodefProgressBar.generateLineData($thisHolder, number);
                                qodefProgressBar.initLineBar($container, data);
                                break;
                            case 'custom':
                                qodefProgressBar.initCustomBar($container, data, number);
                                break;
                        }
                    });
                });
            }
        },
        generateBarData: function (thisBar, layout) {
            var activeWidth = thisBar.data('active-line-width');
            var activeColor = thisBar.data('active-line-color');
            var inactiveWidth = thisBar.data('inactive-line-width');
            var inactiveColor = thisBar.data('inactive-line-color');
            var easing = 'linear';
            var duration = typeof thisBar.data('duration') !== 'undefined' && thisBar.data('duration') !== '' ? parseInt(thisBar.data('duration'), 10) : 1600;
            var textColor = thisBar.data('text-color');

            return {
                strokeWidth: activeWidth,
                color: activeColor,
                trailWidth: inactiveWidth,
                trailColor: inactiveColor,
                easing: easing,
                duration: duration,
                svgStyle: {
                    width: '100%',
                    height: '100%'
                },
                text: {
                    style: {
                        color: textColor
                    },
                    autoStyleContainer: false
                },
                from: {
                    color: inactiveColor
                },
                to: {
                    color: activeColor
                },
                step: function (state, bar) {
                    if (layout !== 'custom') {
                        bar.setText(Math.round(bar.value() * 100) + '%');
                    }
                }
            };
        },
        generateLineData: function (thisBar, number) {
            var height = thisBar.data('active-line-width');
            var activeColor = thisBar.data('active-line-color');
            var inactiveHeight = thisBar.data('inactive-line-width');
            var inactiveColor = thisBar.data('inactive-line-color');
            var duration = typeof thisBar.data('duration') !== 'undefined' && thisBar.data('duration') !== '' ? parseInt(thisBar.data('duration'), 10) : 1600;
            var textColor = thisBar.data('text-color');

            return {
                percentage: number * 100,
                duration: duration,
                fillBackgroundColor: activeColor,
                backgroundColor: inactiveColor,
                height: height,
                inactiveHeight: inactiveHeight,
                followText: thisBar.hasClass('qodef-percentage--floating'),
                textColor: textColor
            };
        },
        initCircleBar: function ($container, data, number) {
            if (qodefProgressBar.checkBar($container)) {
                var $bar = new ProgressBar.Circle($container[0], data);

                $bar.animate(number);
            }
        },
        initSemiCircleBar: function ($container, data, number) {
            if (qodefProgressBar.checkBar($container)) {
                var $bar = new ProgressBar.SemiCircle($container[0], data);

                $bar.animate(number);
            }
        },
        initCustomBar: function ($container, data, number) {
            if (qodefProgressBar.checkBar($container)) {
                var $bar = new ProgressBar.Path($container[0], data);

                $bar.set(0);
                $bar.animate(number);
            }
        },
        initLineBar: function ($container, data) {
            $container.LineProgressbar(data);
        },
        checkBar: function ($container) {
            // check if svg is already in container, elementor fix
            if ($container.find('svg').length) {
                return false;
            }

            return true;
        }
    };

    qodefCore.shortcodes.hendon_core_progress_bar.qodefProgressBar = qodefProgressBar;

})(jQuery);
(function ($) {
	"use strict";

	qodefCore.shortcodes.hendon_core_stacked_images = {};

	$(document).ready(function () {
		qodefStackedImages.init();
	});

	var qodefStackedImages = {
		init: function () {
			var $holder = $('.qodef-stacked-images');

			if ($holder.length) {
				$holder.each(function () {
					var $thisHolder = $(this);

					qodefStackedImages.animateAppear($thisHolder);
					qodefStackedImages.animateOnScroll();
				});
			}
		},
		animateAppear: function ($holder) {
			$holder.appear(function () {
				$holder.addClass('qodef--appear');
			}, { accX: 0, accY: -200 });
		},
		animateOnScroll: function () {
			var itemSelectors = [
				{
					selector: '.qodef-stacked-images .qodef-m-images img',
					modifier: 'translateY',
					modifierUnit: '%',
					startValue: 50,
					endValue: 0,
				},
				{
					selector: '.qodef-stack-image-img-holder',
					modifier: 'translateY',
					modifierUnit: '%',
					startValue: 100,
					endValue: 0,
				},
				{
					selector: '.qodef-image-with-text.qodef-layout--text-below.qodef-image-outline-top-right',
					modifier: 'translateY',
					modifierUnit: '%',
					startValue: 50,
					endValue: 0,
				},
			];

			if (qodef.windowWidth > 1024) {
				itemSelectors.forEach(function (item) {
					var $items = $(item.selector);

					if ($items.length) {
						$items.each(function () {
							var $thisItem = $(this),
								thisItemTop = $thisItem.offset().top,
								thisItemHeight = $thisItem.outerHeight(),
								thisItemBottom = thisItemTop + thisItemHeight,
								progressVal = 0,
								scrollOffsetY = -1 * qodef.windowHeight * 1.2;

							// Set init css value
							if (thisItemTop > qodef.windowHeight * .5) {
								$thisItem.css('transform', item.modifier + '(' + item.startValue + item.modifierUnit + ')');
							}
							$thisItem.css('transition', 'transform 1.5s cubic-bezier(0.07, 0.83, 0.25, 1)');

							$(window).on('scroll', function () {
								if (qodef.scroll > thisItemTop + scrollOffsetY) progressVal = 1;
								if (qodef.scroll > thisItemTop + scrollOffsetY && qodef.scroll < thisItemBottom + scrollOffsetY) {
									if (progressVal !== 1) {
										progressVal = Math.abs(qodef.scroll - thisItemTop - scrollOffsetY) / thisItemHeight;
									}
								}
								$thisItem.css('transform', item.modifier + '(' + (item.endValue + (1 - (progressVal * 1) * 1) * Math.abs(1 - item.startValue)) + item.modifierUnit + ')');
							});
						});
					}
				});
			}
		}
	};

	qodefCore.shortcodes.hendon_core_stacked_images.qodefStackedImages = qodefStackedImages;

})(jQuery);
(function ($) {
	"use strict";

	qodefCore.shortcodes.hendon_core_swapping_image_gallery = {};

	$(document).ready(function () {
		qodefSwappingImageGallery.init();
	});
	
	var qodefSwappingImageGallery = {
		init: function () {
			this.holder = $('.qodef-swapping-image-gallery');
			
			if (this.holder.length) {
				this.holder.each(function () {
					var $thisHolder = $(this);
					qodefSwappingImageGallery.createSlider($thisHolder);
				});
			}
		},
		createSlider: function ($holder) {
			var $swiperHolder = $holder.find('.qodef-m-image-holder');
			var $paginationHolder = $holder.find('.qodef-m-thumbnails-holder .qodef-grid-inner');
			var spaceBetween = 0;
			var slidesPerView = 1;
			var centeredSlides = false;
			var loop = false;
			var autoplay = false;
			var speed = 800;
			
			var $swiper = new Swiper($swiperHolder[0], {
				slidesPerView: slidesPerView,
				centeredSlides: centeredSlides,
				spaceBetween: spaceBetween,
				autoplay: autoplay,
				loop: loop,
				speed: speed,
				pagination: {
					el: $paginationHolder[0],
					type: 'custom',
					clickable: true,
					bulletClass: 'qodef-m-thumbnail'
				},
				on: {
					init: function () {
						$swiperHolder.addClass('qodef-swiper--initialized');
						$paginationHolder.find('.qodef-m-thumbnail').eq(0).addClass('qodef--active');
					},
					slideChange: function slideChange() {
						var swiper = this;
						var activeIndex = swiper.activeIndex;
						$paginationHolder.find('.qodef--active').removeClass('qodef--active');
						$paginationHolder.find('.qodef-m-thumbnail').eq(activeIndex).addClass('qodef--active');
					}
				}
			});
		}
	};

	qodefCore.shortcodes.hendon_core_swapping_image_gallery.qodefSwappingImageGallery = qodefSwappingImageGallery;

})(jQuery);
(function ($) {
	"use strict";

	qodefCore.shortcodes.hendon_core_tabs = {};

	$(document).ready(function () {
		qodefTabs.init();
	});
	
	var qodefTabs = {
		init: function () {
			this.holder = $('.qodef-tabs');
			
			if (this.holder.length) {
				this.holder.each(function () {
					qodefTabs.initTabs($(this));
				});
			}
		},
		initTabs: function ($tabs) {
			$tabs.children('.qodef-tabs-content').each(function (index) {
				index = index + 1;
				
				var $that = $(this),
					link = $that.attr('id'),
					$navItem = $that.parent().find('.qodef-tabs-navigation li:nth-child(' + index + ') a'),
					navLink = $navItem.attr('href');
				
				link = '#' + link;
				
				if (link.indexOf(navLink) > -1) {
					$navItem.attr('href', link);
				}
			});
			
			$tabs.addClass('qodef--init').tabs();
		}
	};

	qodefCore.shortcodes.hendon_core_tabs.qodefTabs = qodefTabs;

})(jQuery);
(function ($) {
	"use strict";

	qodefCore.shortcodes.hendon_core_text_marquee = {};

	$(document).ready(function () {
		qodefTextMarquee.init();
	});
	
	var qodefTextMarquee = {
		init: function () {
			this.holder = $('.qodef-text-marquee');
			
			if (this.holder.length) {
				this.holder.each(function () {
					qodefTextMarquee.initMarquee($(this));
					qodefTextMarquee.initResponsive($(this).find('.qodef-m-content'));
				});
			}
		},
		initResponsive: function (thisMarquee) {
			var fontSize,
				lineHeight,
				coef1 = 1,
				coef2 = 1;
			
			if (qodefCore.windowWidth < 1480) {
				coef1 = 0.8;
			}
			
			if (qodefCore.windowWidth < 1200) {
				coef1 = 0.7;
			}
			
			if (qodefCore.windowWidth < 768) {
				coef1 = 0.55;
				coef2 = 0.65;
			}
			
			if (qodefCore.windowWidth < 600) {
				coef1 = 0.45;
				coef2 = 0.55;
			}
			
			if (qodefCore.windowWidth < 480) {
				coef1 = 0.4;
				coef2 = 0.5;
			}
			
			fontSize = parseInt(thisMarquee.css('font-size'));
			
			if (fontSize > 200) {
				fontSize = Math.round(fontSize * coef1);
			} else if (fontSize > 60) {
				fontSize = Math.round(fontSize * coef2);
			}
			
			thisMarquee.css('font-size', fontSize + 'px');
			
			lineHeight = parseInt(thisMarquee.css('line-height'));
			
			if (lineHeight > 70 && qodefCore.windowWidth < 1440) {
				lineHeight = '1.2em';
			} else if (lineHeight > 35 && qodefCore.windowWidth < 768) {
				lineHeight = '1.2em';
			} else {
				lineHeight += 'px';
			}
			
			thisMarquee.css('line-height', lineHeight);
		},
		initMarquee: function (thisMarquee) {
			var elements = thisMarquee.find('.qodef-m-text'),
				delta = 0.05;
			
			elements.each(function (i) {
				$(this).data('x', 0);
			});
			
			requestAnimationFrame(function () {
				qodefTextMarquee.loop(thisMarquee, elements, delta);
			});
		},
		inRange: function (thisMarquee) {
			if (qodefCore.scroll + qodefCore.windowHeight >= thisMarquee.offset().top && qodefCore.scroll < thisMarquee.offset().top + thisMarquee.height()) {
				return true;
			}
			
			return false;
		},
		loop: function (thisMarquee, elements, delta) {
			if (!qodefTextMarquee.inRange(thisMarquee)) {
				requestAnimationFrame(function () {
					qodefTextMarquee.loop(thisMarquee, elements, delta);
				});
				return false;
			} else {
				elements.each(function (i) {
					var el = $(this);
					el.css('transform', 'translate3d(' + el.data('x') + '%, 0, 0)');
					el.data('x', (el.data('x') - delta).toFixed(2));
					el.offset().left < -el.width() - 25 && el.data('x', 100 * Math.abs(i - 1));
				});
				requestAnimationFrame(function () {
					qodefTextMarquee.loop(thisMarquee, elements, delta);
				});
			}
		}
	};

	qodefCore.shortcodes.hendon_core_text_marquee.qodefTextMarquee = qodefTextMarquee;

})(jQuery);
(function ($) {
	"use strict";
	
	$(window).on('load', function () {
		qodefStickySidebar.init();
	});
	
	var qodefStickySidebar = {
		init: function () {
			var info = $('.widget_hendon_core_sticky_sidebar');
			
			if (info.length && qodefCore.windowWidth > 1024) {
				info.wrapper = info.parents('#qodef-page-sidebar');
				info.c = 24;
				info.offsetM = info.offset().top - info.wrapper.offset().top;
				info.adj = 15;
				
				qodefStickySidebar.callStack(info);
				
				$(window).on('resize', function () {
					if (qodefCore.windowWidth > 1024) {
						qodefStickySidebar.callStack(info);
					}
				});
				
				$(window).on('scroll', function () {
					if (qodefCore.windowWidth > 1024) {
						qodefStickySidebar.infoPosition(info);
					}
				});
			}
		},
		calc: function (info) {
			var content = $('.qodef-page-content-section'),
				header = $('.header-appear, .qodef-fixed-wrapper'),
				headerH = (header.length) ? header.height() : 0;
			
			info.start = content.offset().top;
			info.end = content.outerHeight();
			info.h = info.wrapper.height();
			info.w = info.outerWidth();
			info.left = info.offset().left;
			info.top = headerH + qodefGlobal.vars.adminBarHeight + info.c - info.offsetM;
			info.data('state', 'top');
		},
		infoPosition: function (info) {
			if (qodefCore.scroll < info.start - info.top && qodefCore.scroll + info.h && info.data('state') !== 'top') {
				TweenMax.to(info.wrapper, .1, {
					y: 5,
				});
				TweenMax.to(info.wrapper, .3, {
					y: 0,
					delay: .1,
				});
				info.data('state', 'top');
				info.wrapper.css({
					'position': 'static',
				});
			} else if (qodefCore.scroll >= info.start - info.top && qodefCore.scroll + info.h + info.adj <= info.start + info.end &&
				info.data('state') !== 'fixed') {
				var c = info.data('state') === 'top' ? 1 : -1;
				info.data('state', 'fixed');
				info.wrapper.css({
					'position': 'fixed',
					'top': info.top,
					'left': info.left,
					'width': info.w
				});
				TweenMax.fromTo(info.wrapper, .2, {
					y: 0
				}, {
					y: c * 10,
					ease: Power4.easeInOut
				});
				TweenMax.to(info.wrapper, .2, {
					y: 0,
					delay: .2,
				});
			} else if (qodefCore.scroll + info.h + info.adj > info.start + info.end && info.data('state') !== 'bottom') {
				info.data('state', 'bottom');
				info.wrapper.css({
					'position': 'absolute',
					'top': info.end - info.h - info.adj,
					'left': 0,
				});
				TweenMax.fromTo(info.wrapper, .1, {
					y: 0
				}, {
					y: -5,
				});
				TweenMax.to(info.wrapper, .3, {
					y: 0,
					delay: .1,
				});
			}
		},
		callStack: function (info) {
			this.calc(info);
			this.infoPosition(info);
		}
	};
	
})(jQuery);
(function ($) {
	"use strict";

	var shortcode = 'hendon_core_blog_list';

	qodefCore.shortcodes[shortcode] = {};

	if (typeof qodefCore.listShortcodesScripts === 'object') {
		$.each(qodefCore.listShortcodesScripts, function (key, value) {
			qodefCore.shortcodes[shortcode][key] = value;
		});
	}

	$(document).ready(function () {
		qodefBlogHovers.init();
	});

	var qodefBlogHovers = {
		init: function () {
			var $elements = $('.qodef-blog.qodef-item-layout--date-in-image .qodef-e');

			if ($elements.length) {
				$elements.each(function () {
					var $thisItem = $(this),
						$thisTargets = $thisItem.find('.qodef-e-title, .qodef-e-media-image, .qodef-button');

					$thisTargets.length && qodefBlogHovers.hoverClass($thisItem, $thisTargets);
				});
			}
		},
		hoverClass: function ($holder, $target) {
			$target.on('mouseenter', function () {
				$holder.addClass('qodef-e--isHovered');
			}).on('mouseleave', function () {
				$holder.removeClass('qodef-e--isHovered');
			});
		}
	}

})(jQuery);
(function ($) {
	"use strict";
	
	var fixedHeaderAppearance = {
		showHideHeader: function ($pageOuter, $header) {
			if (qodefCore.windowWidth > 1024) {
				if (qodefCore.scroll <= 0) {
					qodefCore.body.removeClass('qodef-header--fixed-display');
					$pageOuter.css('padding-top', '0');
					$header.css('margin-top', '0');
				} else {
					qodefCore.body.addClass('qodef-header--fixed-display');
					$pageOuter.css('padding-top', parseInt(qodefGlobal.vars.headerHeight + qodefGlobal.vars.topAreaHeight) + 'px');
					$header.css('margin-top', parseInt(qodefGlobal.vars.topAreaHeight) + 'px');
				}
			}
		},
		init: function () {
            
            if (!qodefCore.body.hasClass('qodef-header--vertical')) {
                var $pageOuter = $('#qodef-page-outer'),
                    $header = $('#qodef-page-header');
                
                fixedHeaderAppearance.showHideHeader($pageOuter, $header);
                
                $(window).scroll(function () {
                    fixedHeaderAppearance.showHideHeader($pageOuter, $header);
                });
                
                $(window).resize(function () {
                    $pageOuter.css('padding-top', '0');
                    fixedHeaderAppearance.showHideHeader($pageOuter, $header);
                });
            }
		}
	};
	
	qodefCore.fixedHeaderAppearance = fixedHeaderAppearance.init;
	
})(jQuery);
(function ($) {
	"use strict";
	
	var stickyHeaderAppearance = {
		displayAmount: function () {
			if (qodefGlobal.vars.qodefStickyHeaderScrollAmount !== 0) {
				return parseInt(qodefGlobal.vars.qodefStickyHeaderScrollAmount, 10);
			} else {
				return parseInt(qodefGlobal.vars.headerHeight + qodefGlobal.vars.adminBarHeight, 10);
			}
		},
		showHideHeader: function (displayAmount) {
			
			if (qodefCore.scroll < displayAmount) {
				qodefCore.body.removeClass('qodef-header--sticky-display');
			} else {
				qodefCore.body.addClass('qodef-header--sticky-display');
			}
		},
		init: function () {
			var displayAmount = stickyHeaderAppearance.displayAmount();
			
			stickyHeaderAppearance.showHideHeader(displayAmount);
			$(window).scroll(function () {
				stickyHeaderAppearance.showHideHeader(displayAmount);
			});
		}
	};
	
	qodefCore.stickyHeaderAppearance = stickyHeaderAppearance.init;
	
})(jQuery);
(function ($) {
	"use strict";
	
	$(document).ready(function () {
		qodefSearchCoversHeader.init();
	});
	
	var qodefSearchCoversHeader = {
		init: function () {
			var $searchOpener = $('a.qodef-search-opener'),
				$searchForm = $('.qodef-search-cover-form'),
				$searchClose = $searchForm.find('.qodef-m-close');
			
			if ($searchOpener.length && $searchForm.length) {
				$searchOpener.on('click', function (e) {
					e.preventDefault();
					qodefSearchCoversHeader.openCoversHeader($searchForm);
					
				});
				$searchClose.on('click', function (e) {
					e.preventDefault();
					qodefSearchCoversHeader.closeCoversHeader($searchForm);
				});
			}
		},
		openCoversHeader: function ($searchForm) {
			qodefCore.body.addClass('qodef-covers-search--opened qodef-covers-search--fadein');
			qodefCore.body.removeClass('qodef-covers-search--fadeout');
			
			setTimeout(function () {
				$searchForm.find('.qodef-m-form-field').focus();
			}, 600);
		},
		closeCoversHeader: function ($searchForm) {
			qodefCore.body.removeClass('qodef-covers-search--opened qodef-covers-search--fadein');
			qodefCore.body.addClass('qodef-covers-search--fadeout');
			
			setTimeout(function () {
				$searchForm.find('.qodef-m-form-field').val('');
				$searchForm.find('.qodef-m-form-field').blur();
				qodefCore.body.removeClass('qodef-covers-search--fadeout');
			}, 300);
		}
	};
	
})(jQuery);

(function($) {
    "use strict";

    $(document).ready(function(){
        qodefSearchFullscreen.init();
    });

	var qodefSearchFullscreen = {
	    init: function(){
            var $searchOpener = $('a.qodef-search-opener'),
                $searchHolder = $('.qodef-fullscreen-search-holder'),
                $searchClose = $searchHolder.find('.qodef-m-close');

            if ($searchOpener.length && $searchHolder.length) {
                $searchOpener.on('click', function (e) {
                    e.preventDefault();
                    if(qodefCore.body.hasClass('qodef-fullscreen-search--opened')){
                        qodefSearchFullscreen.closeFullscreen($searchHolder);
                    }else{
                        qodefSearchFullscreen.openFullscreen($searchHolder);
                    }
                });
                $searchClose.on('click', function (e) {
                    e.preventDefault();
                    qodefSearchFullscreen.closeFullscreen($searchHolder);
                });

                //Close on escape
                $(document).keyup(function (e) {
                    if (e.keyCode === 27) { //KeyCode for ESC button is 27
                        qodefSearchFullscreen.closeFullscreen($searchHolder);
                    }
                });
            }
        },
        openFullscreen: function($searchHolder){
            qodefCore.body.removeClass('qodef-fullscreen-search--fadeout');
            qodefCore.body.addClass('qodef-fullscreen-search--opened qodef-fullscreen-search--fadein');

            setTimeout(function () {
                $searchHolder.find('.qodef-m-form-field').focus();
            }, 900);

            qodefCore.qodefScroll.disable();
        },
        closeFullscreen: function($searchHolder){
            qodefCore.body.removeClass('qodef-fullscreen-search--opened qodef-fullscreen-search--fadein');
            qodefCore.body.addClass('qodef-fullscreen-search--fadeout');

            setTimeout(function () {
                $searchHolder.find('.qodef-m-form-field').val('');
                $searchHolder.find('.qodef-m-form-field').blur();
                qodefCore.body.removeClass('qodef-fullscreen-search--fadeout');
            }, 300);

            qodefCore.qodefScroll.enable();
        }
    };

})(jQuery);

(function ($) {
	"use strict";
	
	$(document).ready(function () {
        qodefSearch.init();
	});
	
	var qodefSearch = {
		init: function () {
            this.search = $('a.qodef-search-opener');

            if (this.search.length) {
                this.search.each(function () {
                    var $thisSearch = $(this);

                    qodefSearch.searchHoverColor($thisSearch);
                });
            }
        },
		searchHoverColor: function ($searchHolder) {
			if (typeof $searchHolder.data('hover-color') !== 'undefined') {
				var hoverColor = $searchHolder.data('hover-color'),
				    originalColor = $searchHolder.css('color');
				
				$searchHolder.on('mouseenter', function () {
					$searchHolder.css('color', hoverColor);
				}).on('mouseleave', function () {
					$searchHolder.css('color', originalColor);
				});
			}
		}
	};
	
})(jQuery);

(function ($) {
	"use strict";

	$(document).ready(function () {
		qodefHendonSpinner.init();
	});

	$(window).on('elementor/frontend/init', function () {
		var isEditMode = Boolean(elementorFrontend.isEditMode());
		if (isEditMode) {
			qodefHendonSpinner.init(isEditMode);
		}
	});

	var qodefHendonSpinner = {
		init: function (isEditMode) {
			this.holder = $('#qodef-page-spinner.qodef-layout--hendon');

			if (this.holder.length) {
				qodefHendonSpinner.animateSpinner(this.holder, isEditMode);
			}
		},
		animateSpinner: function ($holder, isEditMode) {
			var $letter = $holder.find('.qodef-m-hendon-text span'),
				tl = new TimelineMax({ repeat: -1, repeatDelay: 0 })

			tl.staggerFromTo($letter, 3, {
				opacity: 0,
			}, {
				opacity: 1,
				ease: Power3.easeInOut
			}, .3);
			tl.staggerTo($letter, 2, {
				opacity: 0,
				ease: Power2.easeInOut
			}, .1);

			isEditMode && qodefHendonSpinner.finishAnimation($holder);

			$(window).on('load', function () {
				tl.eventCallback("onUpdate", function () {
					if (tl.progress() > 0.6) {
						tl.pause().kill();
						TweenMax.to($letter, 1, {
							opacity: 0,
							stagger: .1,
							ease: Power1.easeInOut
						});
						setTimeout(function () {
							qodefHendonSpinner.finishAnimation($holder);
						}, 1000);
					}
				});
			});
		},
		finishAnimation: function ($holder) {
			qodefHendonSpinner.fadeOutLoader($holder);
			var landingRev = $('#qodef-landing-rev').find('rs-module');
			landingRev.length && landingRev.revstart();
		},
		fadeOutLoader: function ($holder, speed, delay, easing) {
			speed = speed ? speed : 600;
			delay = delay ? delay : 0;
			easing = easing ? easing : 'linear';

			$holder.delay(delay).fadeOut(speed, easing);

			$(window).on('bind', 'pageshow', function (event) {
				if (event.originalEvent.persisted) {
					$holder.fadeOut(speed, easing);
				}
			});
		}
	};

})(jQuery);
(function ($) {
	"use strict";
	
	$(document).ready(function () {
		qodefProgressBarSpinner.init();
	});
	
	var qodefProgressBarSpinner = {
		percentNumber: 0,
		init: function () {
			this.holder = $('#qodef-page-spinner.qodef-layout--progress-bar');
			
			if (this.holder.length) {
				qodefProgressBarSpinner.animateSpinner(this.holder);
			}
		},
		animateSpinner: function ($holder) {
			
			var $numberHolder = $holder.find('.qodef-m-spinner-number-label'),
				$spinnerLine = $holder.find('.qodef-m-spinner-line-front'),
				numberIntervalFastest,
				windowLoaded = false;
			
			$spinnerLine.animate({'width': '100%'}, 10000, 'linear');
			
			var numberInterval = setInterval(function () {
				qodefProgressBarSpinner.animatePercent($numberHolder, qodefProgressBarSpinner.percentNumber);
			
				if (windowLoaded) {
					clearInterval(numberInterval);
				}
			}, 100);
			
			$(window).on('load', function () {
				windowLoaded = true;
				
				numberIntervalFastest = setInterval(function () {
					if (qodefProgressBarSpinner.percentNumber >= 100) {
						clearInterval(numberIntervalFastest);
						$spinnerLine.stop().animate({'width': '100%'}, 500);
						
						setTimeout(function () {
							$holder.addClass('qodef--finished');
							
							setTimeout(function () {
								qodefProgressBarSpinner.fadeOutLoader($holder);
							}, 1000);
						}, 600);
					} else {
						qodefProgressBarSpinner.animatePercent($numberHolder, qodefProgressBarSpinner.percentNumber);
					}
				}, 6);
			});
		},
		animatePercent: function ($numberHolder, percentNumber) {
			if (percentNumber < 100) {
				percentNumber += 5;
				$numberHolder.text(percentNumber);
				
				qodefProgressBarSpinner.percentNumber = percentNumber;
			}
		},
		fadeOutLoader: function ($holder, speed, delay, easing) {
			speed = speed ? speed : 600;
			delay = delay ? delay : 0;
			easing = easing ? easing : 'swing';
			
			$holder.delay(delay).fadeOut(speed, easing);
			
			$(window).on('bind', 'pageshow', function (event) {
				if (event.originalEvent.persisted) {
					$holder.fadeOut(speed, easing);
				}
			});
		}
	};
	
})(jQuery);
(function ( $ ) {
	'use strict';

	qodefCore.shortcodes.hendon_core_instagram_list = {};

	$( document ).ready(
		function () {
			qodefInstagram.init();
		}
	);

	var qodefInstagram = {
		init: function () {
			this.holder = $( '.qodef-instagram-list #sb_instagram' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {

						if ( $( this ).parent().hasClass( 'qodef-instagram-columns' ) ) {
							var $imagesHolder  = $( this ).find( '#sbi_images' ),
								$images        = $imagesHolder.find( '.sbi_item.sbi_type_image, .sbi_item.sbi_type_carousel' ),
								initialPadding = $imagesHolder.css( 'padding' );

							// remove some unnecessary paddings
							$imagesHolder.css( 'padding', '0' );
							$imagesHolder.css( 'margin', '-' + initialPadding );
							$imagesHolder.css( 'width', 'calc(100% + ' + ( initialPadding) + ' + ' + ( initialPadding) + ')' );

							$images.attr( 'style', 'padding: ' + initialPadding + '!important' );
						} else if ( $( this ).parent().hasClass( 'qodef-instagram-slider' ) ) {
							qodefInstagram.initSlider( $( this ) );
						}
					}
				);
			}
		},
		initSlider: function ( $currentItem, $initAllItems ) {

			var $imagesHolder  = $currentItem.find( '#sbi_images' ),
				$images        = $currentItem.find( '.sbi_item.sbi_type_image' ),
				initialPadding = $imagesHolder.css( 'padding' );

			// remove some unnecessary paddings
			$imagesHolder.css( 'padding', '0' );
			$images.css( 'padding', '0' );

			// items will inherit this margin
			$imagesHolder.attr( 'style', 'margin-right: ' + (parseInt( initialPadding ) * 2) + 'px !important' );

			var sliderOptions = {};

			sliderOptions.spaceBetween      = parseInt( initialPadding ) * 2;
			sliderOptions.customStages      = true;
			sliderOptions.slidesPerView     = $currentItem.data( 'cols' ) !== undefined && $currentItem.data( 'cols' ) !== '' ? $currentItem.data( 'cols' ) : 3;
			sliderOptions.slidesPerView1024 = $currentItem.data( 'cols' ) !== undefined && $currentItem.data( 'cols' ) !== '' ? $currentItem.data( 'cols' ) : 3;
			sliderOptions.slidesPerView680  = $currentItem.data( 'colstablet' ) !== undefined && $currentItem.data( 'colstablet' ) !== '' ? $currentItem.data( 'colstablet' ) : 2;
			sliderOptions.slidesPerView480  = $currentItem.data( 'colsmobile' ) !== undefined && $currentItem.data( 'colsmobile' ) !== '' ? $currentItem.data( 'colsmobile' ) : 1;

			$currentItem.attr( 'data-options', JSON.stringify( sliderOptions ) );

			$imagesHolder.addClass( 'swiper-wrapper' );

			if ( $images.length ) {
				$images.each(
					function () {
						$( this ).addClass( 'qodef-e qodef-image-wrapper swiper-slide' );
					}
				);
			}

			if ( typeof qodef.qodefSwiper === 'object' ) {

				if ( false === $initAllItems ) {
					qodef.qodefSwiper.initSlider( $currentItem );
				} else {
					qodef.qodefSwiper.init( $currentItem );
				}
			}
		},
	};

	qodefCore.shortcodes.hendon_core_instagram_list.qodefInstagram = qodefInstagram;
	qodefCore.shortcodes.hendon_core_instagram_list.qodefSwiper    = qodef.qodefSwiper;

})( jQuery );

(function ($) {
	"use strict";
	
	qodefCore.shortcodes.hendon_core_clients_list = {};
	qodefCore.shortcodes.hendon_core_clients_list.qodefSwiper = qodef.qodefSwiper;
})(jQuery);
(function ($) {
	"use strict";
	
	var shortcode = 'hendon_core_team_list';
	
	qodefCore.shortcodes[shortcode] = {};
	
	if (typeof qodefCore.listShortcodesScripts === 'object') {
		$.each(qodefCore.listShortcodesScripts, function (key, value) {
			qodefCore.shortcodes[shortcode][key] = value;
		});
	}
	
})(jQuery);
(function ($) {
    "use strict";
	qodefCore.shortcodes.hendon_core_testimonials_list = {};
	qodefCore.shortcodes.hendon_core_testimonials_list.qodefSwiper = qodef.qodefSwiper;

})(jQuery);
(function ($) {
    "use strict";

    var shortcode = 'hendon_core_apartment_list';

    qodefCore.shortcodes[shortcode] = {};

    if (typeof qodefCore.listShortcodesScripts === 'object') {
        $.each(qodefCore.listShortcodesScripts, function (key, value) {
            qodefCore.shortcodes[shortcode][key] = value;
        });
    }

})(jQuery);
(function ($) {
	'use strict';

	qodefCore.shortcodes.hendon_core_image_map = {};

	$( window ).on(
		'load',
		function () {
			qodefImageMap.init();
			qodefPropertyImageMapSVG.init();
		}
	)

	$( document ).ready(
		function () {
		}
	);

	var qodefImageMap = {
		init: function () {
			var $holder = $( '.qodef-image-map' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						var $thisHolder = $( this ),
						$holderMap      = $thisHolder.find( '.qodef-image-map-holder' ),
						holderMapData   = JSON.parse( $holderMap.attr( 'data-options' ) ),
						$infoItems      = $thisHolder.find( '.qodef-im-info-section-holder .qodef-m-item' ),
						mapName         = holderMapData['general']['name'],
						shapeNames      = holderMapData['artboards'][0]['children'].map(
							function (item) {
								return item['title'];
							}
						);
						shapeNames.reverse(); // reverse array
						var activeShape = shapeNames[0];
						$infoItems.first().addClass( 'qodef--active' );

						setTimeout(
							function () {
						 		ImageMapPro.highlightObject( mapName, activeShape );
							},
							500
						);

						ImageMapPro.subscribe((action) => {

							if ( action.type === 'objectHighlight' && ( shapeNames.indexOf( action.payload.object ) > -1 ) ) {

								$infoItems.each(
									function () {
										if ( $( this ).data( 'imp-shape' ) === action.payload.object ) {
											$( this ).addClass( 'qodef--active' );
										} else {
											$( this ).removeClass( 'qodef--active' );
										}
									}
								)
							}

							/*if (action.type === 'objectUnhighlight' && action.payload.object === 'my-object-1') {
								document.querySelector('#our-image-container .imp-image').src = 'path-to-original-image/image.jpg'
							}*/
						})
					}
				);
			}
		}
	}

	//function used to repaint ImageMapPro in Elementor admin, that why it is only used in elementor reinitiate and not in $(document).ready
	var qodefPropertyImageMapSVG = {
		init: function () {
			var imageMapHolders = $( '.qodef-image-map .qodef-image-map-holder' );

			if ( imageMapHolders.length ) {
				imageMapHolders.each(
					function () {
						var thisHolder = $( this ),
						settings       = thisHolder.data( 'options' ) !== 'undefined' ? thisHolder.data( 'options' ) : {},
						id             = settings.id !== undefined && settings.id !== '' ? settings.id : 0,
						mapSvgHolder   = thisHolder.find( '#image-map-pro-' + id );

						if (mapSvgHolder.length) {
							ImageMapPro.init( mapSvgHolder[0], settings );
						}
					}
				)
			}
		}
	}

	qodefCore.shortcodes.hendon_core_image_map.qodefImageMap            = qodefImageMap;
	qodefCore.shortcodes.hendon_core_image_map.qodefPropertyImageMapSVG = qodefPropertyImageMapSVG;

})( jQuery );

(function ($) {
    'use strict';

    qodefCore.shortcodes.hendon_core_property_advanced_info = {};

    $(window).on('load', function () {
        qodefElementorPropertyAdvancedInfo.init();
    });

    var qodefElementorPropertyAdvancedInfo = {
        init: function () {
            $(window).on('elementor/frontend/init', function (e) {
                elementorFrontend.hooks.addAction('frontend/element_ready/hendon_core_property_advanced_info.default', function () {
                    qodefCore.shortcodes.hendon_core_tabs.qodefTabs.init();
                });
            });
        }
    }

    qodefCore.shortcodes.hendon_core_property_advanced_info.qodefElementorPropertyAdvancedInfo = qodefElementorPropertyAdvancedInfo;

})(jQuery);
(function ( $ ) {
    'use strict';

    qodefCore.shortcodes.hendon_core_property_image_map_gallery = {};

    $( document ).ready(
        function () {
            qodefPropertyImageMapGallery.init();
        }
    );

    $( document ).on(
        'qodefGoogleMapsCallbackEvent',
        function () {
            qodefInitPropertyMobileMap.init();
        }
    );

    var qodefPropertyImageMapGallery = {
        init: function () {
            var holder = $( '.qodef-image-map-gallery' );
            if ( holder.length ) {
                holder.each(
                    function () {
                        var thisHolder = $( this );

                        var imageMapName = thisHolder.data( 'image-map-name' );
                        var lastHighlight;
                        var shapeName;

                        var navigationActive = thisHolder.find( '.qodef-map-nav-item.qodef-active-map' );
                        var navigation       = thisHolder.find( '.qodef-map-nav-item.qodef-inactive-map' );
                        var mappedImage      = thisHolder.find( '.qodef-image-map-holder-overlay' );
                        var imageHolder      = thisHolder.find( '.qodef-image-map-holder' );

                        navigation.each(
                            function () {
                                $( this ).on(
                                    'click',
                                    function () {
                                        mappedImage.css( 'z-index', 999 );
                                        imageHolder.css( 'opacity', 0.5 );
                                    }
                                );
                            }
                        );

                        navigationActive.each(
                            function () {
                                $( this ).on(
                                    'click',
                                    function () {
                                        mappedImage.css( 'z-index', -1 );
                                        imageHolder.css( 'opacity', 1 );
                                    }
                                );
                            }
                        );

                        // reference for main items
                        var slider          = thisHolder.find( '.qodef-img-slider' );
                        // reference for thumbnail items
                        var thumbnailSlider = thisHolder.find( '.qodef-pagination-slider' );
                        //transition time in ms
                        var duration        = 500;

                        var swiperSlider = new Swiper(
                            slider[0],
                            {
                                loop: false,
                                autoplay: false,
                                slidesPerView: 1,
                                on: {
                                    init: function () {
                                        slider.addClass( 'qodef--initialized' );
                                    },
                                    slideChange: function () {
                                        setTimeout(
                                            function () {
                                                shapeName = slider.find( '.swiper-slide.swiper-slide-active' ).data( 'imp-shape' );
                                                if ( typeof shapeName !== 'undefined' ) {
                                                    imageMapHighlight();
                                                }
                                            },
                                            300
                                        );

                                        swiperThumbnailSlider.slideTo( swiperSlider.realIndex, duration, true );
                                    },
                                }
                            }
                        );

                        swiperSlider.init();

                        var swiperThumbnailSlider = new Swiper(
                            thumbnailSlider[0],
                            {
                                loop: false,
                                autoplay: false,
                                slidesPerView: 4,
                                on: {
                                    init: function () {
                                        slider.addClass( 'qodef--initialized' );
                                    },
                                    slideChange: function () {
                                        swiperSlider.slideTo( swiperThumbnailSlider.realIndex, duration, true );
                                    },
                                    click: function () {
                                        swiperSlider.slideTo( swiperThumbnailSlider.clickedIndex, duration, true );
                                    },
                                }
                            }
                        );

                        swiperThumbnailSlider.init();

                        function imageMapHighlight() {
                            if (typeof lastHighlight !== 'undefined' && typeof ImageMapPro !== undefined) {
                                ImageMapPro.unhighlightObject( imageMapName, lastHighlight );
                            }
                            if (shapeName !== 'empty' && typeof ImageMapPro !== undefined) {
                                ImageMapPro.highlightObject( imageMapName, shapeName );
                                lastHighlight = shapeName;
                            }
                        }

                        var singleSection = thisHolder.find( '.qodef-img-section' ),
                            singleNav     = thisHolder.find( '.qodef-map-navigation .qodef-map-nav-item' );

                        singleNav.on(
                            'click',
                            function () {
                                singleSection.removeClass( 'active' );
                                singleNav.removeClass( 'active' );
                                var thisNav = $( this ),
                                    index   = thisNav.index();
                                thisNav.addClass( 'active' );
                                singleSection.eq( index ).addClass( 'active' );
                            }
                        );

                        $.imageMapProEventClickedShape = function ( imageMapName, shapeName ) {
                            var sliderIndex = -1;
                            var impObject   = $( '.qodef-image-map-gallery[data-image-map-name=\'' + imageMapName + '\']' );
                            // reference for main items
                            var slider      = impObject.find( '.qodef-img-slider' );
                            // reference for thumbnail items
                            var sliderItems = slider.find( '.swiper-slide' );
                            sliderItems.each(
                                function () {
                                    if ( $( this ).data( 'imp-shape' ) === shapeName ) {
                                        sliderIndex = $( this ).index();
                                    }
                                    if ( sliderIndex !== -1 ) {
                                        swiperSlider.slideTo( sliderIndex, duration, true );
                                        swiperThumbnailSlider.slideTo( sliderIndex, duration, true );
                                    }
                                }
                            );
                        };
                    }
                );
            }
        }
    };

    //function used to repaint ImageMapPro in Elementor admin, that why it is only used in elementor reinitiate and not in $(document).ready
    var qodefPropertyImageMapSVG = {
        init: function () {
            var imageMapHolders = $( '.qodef-image-map-holder' );

            if ( imageMapHolders.length ) {
                imageMapHolders.each(
                    function () {
                        var thisHolder   = $( this ),
                            settings     = thisHolder.data( 'options' ) !== 'undefined' ? thisHolder.data( 'options' ) : {},
                            id           = settings.id !== undefined && settings.id !== '' ? settings.id : 0,
                            mapSvgHolder = thisHolder.find( '#image-map-pro-' + id );

                        if ( mapSvgHolder.length ) {
                            mapSvgHolder.imageMapPro( settings );
                        }
                    }
                );
            }
        }
    };

    var qodefInitPropertyMobileMap = {
        init: function () {
            var $mapOpener     = $( '.qodef-view-larger-map a' ),
                $mapOpenerIcon = $mapOpener.children( 'i' ),
                $mapHolder     = $( '.qodef-map-holder' );

            if ( $mapOpener.length ) {
                $mapOpener.on(
                    'click',
                    function ( e ) {
                        e.preventDefault();

                        if ( $mapHolder.hasClass( 'qodef-fullscreen-map' ) ) {
                            $mapHolder.removeClass( 'qodef-fullscreen-map' );
                            $mapOpenerIcon.removeClass( 'icon-basic-magnifier-minus' );
                            $mapOpenerIcon.addClass( 'icon-basic-magnifier-plus' );
                        } else {
                            $mapHolder.addClass( 'qodef-fullscreen-map' );
                            $mapOpenerIcon.removeClass( 'icon-basic-magnifier-plus' );
                            $mapOpenerIcon.addClass( 'icon-basic-magnifier-minus' );
                        }

                        window.qodefGoogleMap.init(
                            $( '#qodef-multiple-map-holder' ),
                            { selectorIsID: true, multipleTrigger: true }
                        );
                    }
                );
            }
        }
    };

    qodefCore.shortcodes.hendon_core_property_image_map_gallery.qodefPropertyImageMapGallery = qodefPropertyImageMapGallery;
    qodefCore.shortcodes.hendon_core_property_image_map_gallery.qodefPropertyImageMapSVG     = qodefPropertyImageMapSVG;
    qodefCore.shortcodes.hendon_core_property_image_map_gallery.qodefInitPropertyMobileMap   = qodefInitPropertyMobileMap;

})( jQuery );

(function ($) {
    "use strict";

    var shortcode = 'hendon_core_property_list';

    qodefCore.shortcodes[shortcode] = {};

    if (typeof qodefCore.listShortcodesScripts === 'object') {
        $.each(qodefCore.listShortcodesScripts, function (key, value) {
            qodefCore.shortcodes[shortcode][key] = value;
        });
    }

})(jQuery);
(function ($) {
	"use strict";
	
	qodefCore.shortcodes.hendon_core_property_list = {};
	
	$(document).ready(function () {
		qodefProperyListAside.init();
	});
	
	var qodefProperyListAside = {
		init: function () {
			this.holder = $('.qodef-property-list.qodef-item-layout--info-aside');
			
			if (this.holder.length) {
				this.holder.each(function () {
					var $thisHolder = $(this);
					qodefProperyListAside.initList( $thisHolder );
				});
			}
		},
		initList: function ($holder) {
			var $item = $holder.find('article.qodef-e');
			
			$item.first().addClass("active");
			
			$item.on('mouseenter', function () {
				$item.removeClass("active");
				$(this).addClass("active");
			});
		}
	};
	
	qodefCore.shortcodes.hendon_core_property_list.qodefProperyListAside  = qodefProperyListAside;
	
})(jQuery);