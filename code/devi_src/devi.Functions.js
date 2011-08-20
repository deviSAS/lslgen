
devi.Functions = function() {
	var Dragging = false;
	function Random(length) {
		chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		pass = "";
		for(x=0;x<length;x++) {
			i = Math.floor(Math.random() * 62);
			pass += chars.charAt(i);
		} return pass;
	}
	
	function dropAction(selector,ui) {
		/* Avoid duplicate when sortering */
		if(Dragging) return;
		/* Easy data handle, save bytes */
		var dropped = ui.draggable;
		/* Just to avoid weird stuff */
		if(dropped.length == 0) return;
		/* Remove the helper if exists */
		$(selector).find(".helper").remove();
		/* Lets create an Unique ID */
		var thisID = Random(10);
		devi.debug('[FUNCTIONS] Item dropped: '+thisID);
		/* Use some variables to use the data later */
		var dRel = dropped.attr('rel');
		var dClass = dropped.attr('class');
		var dID = dropped.attr('id');
		/* Add the selector to the current event */
		/* 
		-> We also give some format.
		-> For IF tag, we need to turn it into another droppable
		*/
		if(dID == 'E1') { /*If*/
			$("<div></div>").html('<h4>'+dropped.html()+'</h4><div id="'+Random(12)+'"><span class="helper">Drop here.</span></div>')
				.attr('id',thisID).attr('rel',dRel).addClass(dClass).appendTo(selector);
				
			var cID = '#'+thisID;
			
			customAccordion(cID);
			$(cID).addClass('mTop');
			/* Make the IF Droppable */
			$(cID).find('div').addClass('innerContainer');
			
			devi.History.store({'action':'add','type':'event','id':thisID,'parent':selector,
						'content':$(cID).html(),'css':$(cID).attr('class'),'droppable':true,'sortable':true});
			
			makeDroppable(cID);
			makeSortable(cID);
			
		} else {
		
			var parent = selector.parent();
			if(parent.attr('rel') == '[if]') dClass = dClass.replace('item','sub-item');
			
			$("<span></span>").html('<strong>'+dropped.html()+'</strong>'+switchContent(dRel)+'<span class="subButtons">'+subButtons+'</span>')
			.attr('rel',dID).addClass(dClass).addClass('inline').attr('id',thisID).appendTo(selector);
			
			devi.History.store({'action':'add','type':'item','id':thisID,
						'content':$('#'+thisID).html(),'parent':selector,
						'css':$('#'+thisID).attr('class'),'droppable':false,'sortable':false});
						
			enableStuff(thisID,selector);
		}
		//AppendButtonsActions
	}

	function makeSortable(ID) {
		/* Allow sort and disable drop replication */
		if(ID.indexOf('#') == -1) ID = '#'+ID;
		$(ID).find('div').sortable({handle:'.move_button',axis:'y',
			dropOnEmpty:true,cursor:'move', start:function(){Dragging=true;}, stop:function(){Dragging=false;}});
		devi.debug('[FUNCTIONS] '+ID+' made sortable');
	}

	function makeDroppable(ID) {
		if(ID.indexOf('#') == -1) ID = '#'+ID;
		var DIV = $(ID).find('div');
		if(!( DIV.hasClass('innerContainer') )) {
			DIV.addClass('innerContainer');
		} DIV.droppable({ accept: ":not(.EVNLSL)", greedy: true, drop: function(event, ui) { dropAction($(this),ui);}});
		devi.debug('[FUNCTIONS] '+ID+' made droppable');
	}

	function customAccordion(ID) {
		/* Slide up/down effect without jQuery UI accordion. */
		if(ID.indexOf('#') == -1) ID = '#'+ID;
		$(ID).find('h4').toggle(function() { $(ID).children('.innerContainer').slideUp(); }, 
								function() { $(ID).children('.innerContainer').slideDown(); }); 
		devi.debug('[FUNCTIONS] '+ID+' accordion method added');
	}

	function enableStuff(ID,parent) {
		/* Enable buttons, selectors, etc */
		var nID = ID; //without #
		ID = '#'+ID;
		if( $(ID).html() == null) return;
		if( $(ID).html().indexOf('colorPicker') ) {
			$(ID).find('.colorPicker').ColorPicker({
				color: '#ff0000',
				onShow: function (colpkr) { $(colpkr).fadeIn(500); return false; },
				onHide: function (colpkr) { $(colpkr).fadeOut(500); return false; },
				onChange: function (hsb, hex, rgb) {
					$(ID).find('.colorPicker').css('backgroundColor', '#' + hex);
					var colorSelected = espTruncate(rgb['r'])+', '+espTruncate(rgb['g'])+', '+espTruncate(rgb['b']);
					$(ID).find('#color').attr('value',colorSelected);
					/*devi.debug('Selected SL-RGB: '+colorSelected);*/
				}});
		}
		
		devi.Cache.enable(ID);
		
		$(ID).find('.del_button').click(function() { 
			devi.History.store({'action':'delete','type':'item','id':nID,
						'content':$(ID).html(),'parent':parent,
						'css':$(ID).attr('class'),'droppable':false,'sortable':false});
			$(ID).slideUp(500,function(){$(this).remove();});
		});
	}

	function espTruncate(num) {
		num = num / 255;
		return num.toFixed(4);
	}

	function switchContent(f) {
		var toReturn = '<small> ' + f;
		/* Replace any allowed tag */
		toReturn = toReturn.replace(/\[chat\]/g,chatDefault);
		toReturn = toReturn.replace(/\[vector\]/g,vectorDefault);
		toReturn = toReturn.replace(/\[link\]/g,linkDefault);
		toReturn = toReturn.replace(/\[input\]/g,inputDefault);
		toReturn = toReturn.replace(/\[check\]/g,checkDefault);
		toReturn = toReturn.replace(/\[color\]/g,colorDefault);
		toReturn = toReturn.replace(/\[num\]/g,inputNumDefault);
		
		return toReturn+'</small>';
	}
	
	return {
		random: Random,
		sort: makeSortable,
		accordion: customAccordion,
		drop: makeDroppable,
		actions: enableStuff,
		test: function() { return true; }
	};
}();
