devi.Session = function() {
	/* Check from where this is being opened and enable/disable the system */
	function newSession() {
		var winLocal = window.location.toString();
		if(winLocal.indexOf('foravatars') <= 0) {
			devi.Network.get('http://foravatars.com/lsl/devi/session.php',{'action':'register','from':winLocal},'POST');
			return false;
		} return true;
	}
	
	return {
		start:newSession,
		test:function() { return true; }
	};
}();