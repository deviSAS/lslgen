devi.Alert = function() {
	var alert_opened = false;
	var alert_todo  = '.cover_bg';
	var alert_title = '.dialog_head';
	var alert_text  = '.dialog_box';
	var cur_type    = '';
	
	function show(type, title, text, to_focus) {
		
		//if(type == 'code') //Add size
		if($(alert_todo).is(':visible')) {
			$('.lslDialog').fadeOut(500,function() { loadValues(type, title,text); $(this).fadeIn(500); });
		} else {
			loadValues(type, title,text);
			$(alert_todo).fadeIn();
		}
		
		/* Always make the close button clickeable */
		$('#dialog_close').click(function(){$(alert_todo).fadeOut();});
		
		/* Focus after alert is closed */
		$(alert_todo).find("#dialog_close").click(function() { $(alert_todo).fadeOut(); cur_type = ''; to_focus.focus(); });
		return true; /* The dialog has been opened */
	}
	
	function loadValues(type, title,text) {
		$(alert_title).html(title);
		/* Append if is the current dialog */
		if(cur_type == type) {
			$(alert_text).append(text);
		} else {
			cur_type = type;
			$(alert_text).html(text);
		}
	}
	
	return {
		init: show,
		test: function() { return true; }
	};
}();