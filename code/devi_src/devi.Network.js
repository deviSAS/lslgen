devi.Network = function() {
	var Requests = [];
	/* Handle HTTP Requests in a single file */
	function getRequest(_url,_data,_method) {
		var req_id = devi.Functions.random(16);
		var formatted_url = System+_url+'?rid='+devi.Functions.random(5);
		$.ajax({ type: _method, url: formatted_url,
				 data: _data, cache: false, dataType: "html", global: false, 
				 success: function(result) {
					devi.debug('[NETWORK] Got response for ID: '+req_id); //+' ('+result+')');
					Requests[req_id] = result;
				}});
				
		devi.debug('[NETWORK] Performed a request with id "'+req_id+'"');
		return req_id;
	}
	
	/* Simple network check, see if there is a response */
	function checkRequest(ID) {
		if(Requests[ID] != null) {
			return true;
		} return false;
	}
	
	function getResponse(ID) {
		/* Remove the response from the array */
		var pos = Requests.indexOf(ID);
		/* Temporary store the response */
		var res = Requests[ID];
		Requests.splice(pos,1);
		return res;
	}
	
	
	return {
		get:getRequest,
		ok:checkRequest,
		response:getResponse,
		test:function() { return true; }
	};
}();	