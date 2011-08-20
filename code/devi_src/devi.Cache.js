devi.Cache = function() {
	function activeCaching(item) {
		/* Cache input value inside <span:input_cache><span> */
		$(item).find("input").keyup(function() {
			var value = $(this).val();
			var cache_id = $(this).attr('name')+'_cache';
			var cache = $(item).find('#'+cache_id);
			
			if(cache == null || cache.length == 0) {
				$('<span></span>').addClass('cache').attr('id',cache_id).text(value).appendTo($(item));
				devi.debug('[CACHE][CREATED] '+cache_id);
				return true;
			}
			
			/*devi.debug('[CACHE][STORED] '+cache_id);*/
			cache.text(value);
		}).keyup();
		devi.debug('[CACHE][ENABLED] '+$(item).attr('id'));
	}
	
	/* Looks for stored cache and apply to each input */
	function applyCache(item) {
		var item_id = $(item).attr('id');
		$('#'+item_id+' input').each(function(e,i) {
			var cache_id = '#'+$(this).attr('name')+'_cache';
			var cache = $(item).find(cache_id);
			if(cache == null || cache.length == 0) return;
			$(this).val(cache.text());
		});
	}
	
	return {
		enable: activeCaching,
		apply: applyCache,
		test: function() { return true; }
	};
}();