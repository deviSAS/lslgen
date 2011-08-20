devi.Storage = function() {	
	function openDialog() {
		if(!( devi.Script.check() )) {
			devi.Alert.init(devi.Functions.random(5),saveTitle,ERROR_COMPILE_FIRST,$(document));
			return false;
		}
		if( devi.Alert.init('save',saveTitle,saveScript,$(document)) ) {
			$('#SaveScript').click(function() { store(); });
		}
	}
	
	function _empty(val) {
		if(val == null || val.length == false) {
			return true;
		} return false;
	}
	
	function store() {
		var title = $('#title').val();
		var creator = $('#creator').val();
		var desc = $('#desc').val();
		
		if(_empty(title) || _empty(creator) || _empty(desc)) {
			var htmlCheck = $(".cover_bg").find(".dialog_box").html();
			if(htmlCheck.indexOf(FILL_FIELDS) == -1) devi.Alert.init('save',saveTitle,FILL_FIELDS,$(document));
			return false;
		}
		
		if(devi.Alert.init('loading',saveTitle,LOADING,$(document))) {
			/* Disable close button */
			devi.Temporal.add('close_button',$('.cover_bg').find("#dialog_close").html());
			$('.cover_bg').find("#dialog_close").remove();
			
			setTimeout(function() {
				var data = escape($('#lsl_Arena').html());
				var net_req = devi.Network.get('devi/storage.php',
								{'action':'store','title':title,'creator':creator,'desc':desc,'html':data},'POST');
				devi.Temporal.add('StorageNetReq',net_req);
				var timer = setInterval(function(){checkResponse('store');},1000);
				devi.Temporal.add('StorageTimer',timer);
			},1000);
		}
	}
	
	function checkResponse(type) {
		if(type == 'store') {
			var net_req = devi.Temporal.get('StorageNetReq');
			if( devi.Network.ok(net_req) ) {
				clearInterval(devi.Temporal.get('StorageTimer'));
				var result = devi.Network.response(net_req);
				devi.debug('[WATCHDOG] Ajax result: '+result);
							
				/* Return the close button */
				$('<span></span>').attr('id','dialog_close').html(devi.Temporal.get('close_button')).appendTo('#lsl_GlobalSelectors');
					
				if(result.indexOf('ERROR') != -1) {
					/* Error while saving the script */
					devi.Alert.init('error',saveTitle,result,$(document));
					return false;
				}
				/* Everything went fine :) */
				devi.Alert.init('saved',saveTitle,saveCode+result,$(document));	
			} else devi.Temporal.add('StorageNetReq',net_req);
		} else if(type == 'load') {
			var net_req = devi.Temporal.get('LoadNetReq');
			if( devi.Network.ok(net_req) ) {
				clearInterval(devi.Temporal.get('LoadTimer'));
				var result = devi.Network.response(net_req);
				
				/* Error while loading code */
				if(result.indexOf('ERROR') != -1) {
					/* Return the close button */
					$('<span></span>').attr('id','dialog_close').html(devi.Temporal.get('close_button')).appendTo('#lsl_GlobalSelectors');
					devi.Alert.init('error',loadTitle,result,$(document));
					return false;
				} 
				
				/* Good response, lets load the arena */
				
				/* Alert the loading process for the arena */
				devi.Alert.init('load_arena',loadTitle,loadArena+LOADING,$(document));
				
				/* Load result to the current Arena */
				$("#lsl_Arena").html(unescape(result));
				setTimeout(function() { activeArena(); },1000);
			} else devi.Temporal.add('LoadNetReq',net_req);
		}
	}
	
	function loadScript() {
		/* Ok so we want to load a script, lets open the load dialog */
		if(devi.Alert.init('load_init',loadTitle,loadCode,$(document))) {
			/* Button Load hit */
			$("#LoadCode").click(function() {
				var valCode = $("#ScriptCode").val();
					
				if(_empty(valCode)) {
					/* There is no code to load, mark the field red and return */
					devi.debug('[STORAGE][LOAD] Empty Code.');
					$("#ScriptCode").attr('style','background-color:red;color:black;').focus();
					return false;
				}
				
				/* Disable close button */
				devi.Temporal.add('close_button',$('.cover_bg').find("#dialog_close").html());
				$('.cover_bg').find("#dialog_close").remove();
				
				/* Load with the code given */
				if( devi.Alert.init('load-loading',loadTitle,LOADING,$(document))) {
					setTimeout(function() { performLoad(valCode); } , 1000);
				}
			});
		}		
	}
	
	function performLoad(code) {
		/* Perform the request and check for response */
		var req = devi.Network.get('devi/storage.php',{'action':'load','code':code},'POST');
		var timer = setInterval(function(){ checkResponse('load'); },1000);
		/* Use temporal */
		devi.Temporal.add('LoadNetReq',req);
		devi.Temporal.add('LoadTimer',timer);
	}
	
	function activeArena() {
		$("#lsl_Arena .EVNLSL").each(
			function(index, Element) {
				var HANDLE = $(this);
				var EVENT = '#'+$(this).attr('id');
				devi.debug('[STORAGE][LOAD] Activating event: '+EVENT);
				/* Basic Actions */
				devi.Functions.sort(EVENT);
				devi.Functions.drop(EVENT);
				devi.Functions.accordion(EVENT);
				/* For each element inside this */
				$(EVENT+ ' .item').each( function(i,e) {
					activeItem($(this),HANDLE);
				});
				
			}
		);
		devi.debug('[STORAGE][LOAD] All done');
		/* Return the close button */
		$('<span></span>').attr('id','dialog_close').html(devi.Temporal.get('close_button')).appendTo('#lsl_GlobalSelectors');
		devi.Alert.init('load_end',loadTitle,loadFinish,$(document));
		return true;
	}
	
	function activeItem(item,parent) {
		var item_id = item.attr('id');
		if(item.attr('rel') == '[if]') {
			$('#'+item_id+' .sub-item').each(function (i,e) {
				activeItem($(this),item);
			});
		} else {		
			devi.debug('[STORAGE][LOAD] Activating item: '+item_id);
			devi.Cache.apply(parent);
			devi.Functions.actions(item_id,parent);
		}
	}	
	
	return {
		init:openDialog,
		load:loadScript,
		test:function() { return true; }
	};
}();