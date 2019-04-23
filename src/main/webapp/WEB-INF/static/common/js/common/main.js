/*
 * ========================================================================
 * Bootstrap Hover 插件
 * https://github.com/ibmsoft/twitter-bootstrap-hover-dropdown
 * ========================================================================
 */
(function($, window, undefined) {
	// outside the scope of the jQuery plugin to
	// keep track of all dropdowns
	var $allDropdowns = $();

	// if instantlyCloseOthers is true, then it will instantly
	// shut other nav items when a new one is hovered over
	$.fn.dropdownHover = function(options) {

		// the element we really care about
		// is the dropdown-toggle's parent
		$allDropdowns = $allDropdowns.add(this.parent());

		return this.each(function() {
			var $this = $(this).parent(), defaults = {
				delay : 500,
				instantlyCloseOthers : true
			}, data = {
				delay : $(this).data('delay'),
				instantlyCloseOthers : $(this).data('close-others')
			}, options = $.extend(true, {}, defaults, options, data), timeout;

			$this.hover(function() {
				if (options.instantlyCloseOthers === true)
					$allDropdowns.removeClass('open');

				window.clearTimeout(timeout);
				$(this).addClass('open');
			}, function() {
				timeout = window.setTimeout(function() {
					$this.removeClass('open');
				}, options.delay);
			});
		});
	};

	$('[data-hover="dropdown"]').dropdownHover();
})(jQuery, this);

(function($, window, undefined) {
	var someThingAboutMe = {
		/**
		 * a code by Seyhan YILDIZ
		 */
		settings : {
			pictures : [ '1.png', '2.png', '3.png' ],
			object : '#myPic',
			inAnimation : 'flipInX',
			outAnimation : 'flipOutY',
			random : true,
			startNumber : 0,
			time : 5000
		// ms
		},

		prePic : null,

		random : function() {
			var rN = Math.random() * (this.settings.pictures.length - 1);
			rN = Math.round(rN);
			return rN;
		},

		run : function(par) {
			/**
			 * Ön tanımlamalar
			 */

			$.extend(this.settings, par);

			var c = this.settings.pictures.length;
			var s = this.settings.inAnimation;
			var e = this.settings.outAnimation;
			var p = this.settings.pictures;

			if (c <= 1)
				return; // 1 resim ve aşağısında olayın iptali

			/**
			 * rasgele yada sıralı algılanması
			 */

			if (this.settings.random) {
				/**
				 * Şu kısım arka arkaya aynı resimin gelmemesini sağlıyor
				 * 
				 * @type {*}
				 */
				var rN = this.random();
				while (rN == this.prePic) {
					rN = this.random();
				}
				this.prePic = rN;
			} else {
				/**
				 * Sıraki resim yoksa başa alma vs..
				 */
				if (typeof this.settings.pictures[this.settings.startNumber + 1] != 'undefined') {
					this.settings.startNumber++;
				} else {
					this.settings.startNumber = 0;
				}

				rN = this.settings.startNumber;
			}

			$(this.settings.object).queue(function() {
				$(this).removeClass(s).addClass(e).dequeue();
			}).delay(500).queue(function() {
				$(this).removeClass(e).attr('src', basePath + 'jsp/common/images/' + p[rN]).addClass(s).dequeue();
			})
			var $this = this;
			setTimeout(function() {
				$this.run.call($this);
			}, this.settings.time);
		}
	};

	$(function() {
		// $("#settings").hover(function() {
		//
		// $("#settings").dropdown('toggle');
		// }, function() {
		// })

		$("#headset .btn-dropdown").dropdownHover();

		someThingAboutMe.run({
			random : false,
			pictures : [ '01.jpg', '02.jpg', '03.jpg', '04.jpg' ],
			inAnimation : 'flipInX',
			outAnimation : 'bounceOut'
		});

	});
})(jQuery, this);
