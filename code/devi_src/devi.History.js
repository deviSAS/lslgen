devi.History = function() {
	var ActionRegistry   = []; /* Store any change made. */
	var GlobalOrder 	 = []; /* Store sortable order when changed */
	var curRegistryLocal = 0;

	/* Enable keyboard action */
	function EnableActions() {
		shortcut.add("Ctrl+Z",function() { undoAction(); },{ 'type':'keydown',	'propagate':true, 'target':document	});
		shortcut.add("Ctrl+Y",function() { redoAction(); },{ 'type':'keydown',	'propagate':true, 'target':document	});
	}
	
	/* Store each add/remove */
	function storeAction(data) {
		devi.debug('[HYSTORY]['+curRegistryLocal+'] Stored: '+data['action']+'>'+data['type']);
		ActionRegistry[curRegistryLocal] = data;
		curRegistryLocal++;
	}
	
	/* When Ctrl+Z Go back one item in the registry and undo. */
	function undoAction() {
		curRegistryLocal--; 
		
		if(curRegistryLocal < 0) {
			devi.debug('[HISTORY] No action to undo.');
			return false;
		}
		/* Store the data in a variable to use it later */
		var reproData = ActionRegistry[curRegistryLocal];
		devi.debug('[HYSTORY]['+curRegistryLocal+'] Undo '+reproData['action']+'>'+reproData['type']);
		
		var Action = reproData['action'];
		/* Undo the action ; do the opposite */
		if(Action == 'add') {
			$('#'+reproData['id']).remove();
		} else if(Action == 'delete') {
			AddItem(reproData);
		}
	} function redoAction() {
		/* Check for outbound */
		if(ActionRegistry[curRegistryLocal] == null) {
			devi.debug('[HYSTORY] Nothing to redo');
			return false;
		}
		/* Store the data in a variable to use it later */
		var reproData = ActionRegistry[curRegistryLocal];
		devi.debug('[HYSTORY]['+curRegistryLocal+'] Redo '+reproData['action']+'>'+reproData['type']);
		
		var Action = reproData['action'];
		/* Redo the action ; same as given*/
		if(Action == 'add') {
			AddItem(reproData);
		} else if(Action == 'delete') {
			$('#'+reproData['id']).remove();
		}
		
		curRegistryLocal++;
	} 
	
	/* Add the item (event/item) to the current arena */
	
	function AddItem(Data) {
		var type = '<div></div>';
		var _append = Data['parent'];
		
		/* If is an item, whe need the span */
		if(Data['type'] == 'item') {
			type = '<span></span>';			
		}
		
		/* Let's add the item */
		$(_append).find(".helper").remove();
		var ID = Data['id'];
		$(type).html(Data['content']).attr('class',Data['css']).attr('id',ID).appendTo(_append);
		
		/* Based on features, we make it droppable and sortable, also add its actions */
		if(Data['droppable']) {
			devi.Functions.drop('#'+ID);
			devi.Functions.accordion('#'+ID);
		} if(Data['sortable']) {
			devi.Functions.sort('#'+ID);
		} if(Data['type'] == 'item') {
			/* Sub-buttons actions */
			devi.Functions.actions(ID,_append);
		}
	}
	
	return {
		/* Public */
		init: EnableActions,
		store: storeAction,
		test: function() { return true; }
	};
}();	