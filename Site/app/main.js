$(document).ready(function() {
	var title = $('title').text();

	function update() {
		var hash = window.location.hash.substring(1),
			link = $('.link[href="#'+hash+'"]'),
			page = $('.page[data-link="'+hash+'"]'),
			_title = page.data('title');

		link.addClass('current').siblings().removeClass('current');
		page.addClass('current').siblings().removeClass('current');
		document.title = (_title != '' ? _title+' : ' : '') + title;
	}

	$(window).on('hashchange', function() {
		update();
	});

	update();

	var pc = $('.section.presentation .section-content');
	
	pc.parent().css('height', pc.outerHeight());
	$(window).scroll(function() {
		pc.css('top', 0+($(this).scrollTop() / 2)+'px');
	});
});