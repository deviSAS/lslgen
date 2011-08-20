devi.Build = function() {
	function enableControls() {
		$("#lslCompile").click(function(){ devi.Script.compile(); });
		$("#lslBuild").click(function(){ devi.Script.build(); });
		$("#lslSave").click(function(){ devi.Storage.init(); });
		$("#lslLoad").click(function(){ devi.Storage.load(); });
		
		$("#lsl_Palette").accordion({autoHeight:false});
		
		$("#lsl_Palette span").draggable({
			appendTo: "#lslContainer",
			helper: "clone",
			cursor: 'move',
			cursorAt: { top: 5, left: 5}
		});
		
		$("#lsl_Arena").droppable({
			/* Prevent nested propagation */
			greedy:true,
			/* Only accept Events */
			accept: ".EVNLSL",
			drop: function(event, ui) {
				$(this).find(".helper").remove();
				
				var holder = ui.draggable;
				/* Do not repeat events */
				if($(this).find('#'+holder.attr('id')).length != 0) return;
				/* Add the event, its properties - also turn it into an accordeon*/
				$("<div></div>").html('<h4>' + holder.html() + '</h4><div><span class="helper">Drop here.</span></div>')
					.attr('id',holder.attr('id')).addClass(holder.attr('class')).appendTo(this);
				var holdID = '#'+holder.attr('id');
				
				/* And make it droppable  */
				devi.Functions.drop(holdID);					
				devi.Functions.sort(holdID);
				
				devi.History.store({'action':'add','type':'event','id':holder.attr('id'),
					'content':$(holdID).html(),'css':$(holdID).attr('class'),'parent':$(this)/* use the div ID */
					,'droppable':true,'sortable':true});
				
				/******************************/
				/************BUTTONS***********/
				/******************************/
				
				// Change H3 to Close button
				devi.Functions.accordion('#'+holder.attr('id'));
				devi.debug('[EVENT] Succefully added event: '+holder.attr('id'));
			}
		});
		devi.debug('[BUILD] Core site ready.');
	}
	
	return {
		init: enableControls,
		test: function() { return true; }
	};
}();