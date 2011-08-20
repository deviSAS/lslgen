devi.Modules = function() {
	function loadModules() {
		devi.Build.init();
		devi.debug('[MODULES] Build initialized..');
		devi.History.init();
		devi.debug('[MODULES] History initialized..');
	}
	
	function initModules() {
		devi.debug('[MODULES] Testing modules integrity..');
		try { devi.Alert.test(); }
		catch(e) { devi.debug('[INTEGRITY][ALERT] '+e); return false;}
		try { devi.Build.test(); }
		catch(e) { devi.debug('[INTEGRITY][BUILD] '+e); return false;}
		try { devi.Base64.test(); }
		catch(e) { devi.debug('[INTEGRITY][BASE64] '+e); return false;}
		try { devi.Cache.test(); }
		catch(e) { devi.debug('[INTEGRITY][CACHE] '+e); return false;}
		try { devi.Functions.test(); }
		catch(e) { devi.debug('[INTEGRITY][FUNCTIONS] '+e); return false;}
		try { devi.History.test(); }
		catch(e) { devi.debug('[INTEGRITY][HISTORY] '+e); return false;}
		try { devi.Network.test(); }
		catch(e) { devi.debug('[INTEGRITY][NETWORK] '+e); return false;}
		try { devi.Script.test(); }
		catch(e) { devi.debug('[INTEGRITY][SCRIPT] '+e); return false;}
		try { devi.Storage.test(); }
		catch(e) { devi.debug('[INTEGRITY][STORAGE] '+e); return false;}
		try { devi.Session.test(); }
		catch(e) { devi.debug('[INTEGRITY][SESSION] '+e); return false;}
		try { devi.Temporal.test(); }
		catch(e) { devi.debug('[INTEGRITY][TEMPORAL] '+e); return false;}
		devi.debug('[MODULES] All modules working.');
		return true;
	}
		
	return {
		init:initModules,
		load:loadModules
	};
}();