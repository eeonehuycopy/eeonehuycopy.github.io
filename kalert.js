var kalert = {
	notifications_zone: false,
	styles: "\
		.notifications {\
		    position: fixed;\
		    max-width: 350px;\
			font-family: \"RobotoDraft\",\"Roboto\",sans-serif;\
		    right: 25px;\
		    z-index: 3;\
		    bottom: 0px;\
		}\
		.notifications > div{\
		    min-height: 50px;\
		    width: 100%;\
		    padding: 16px;\
		    background: #fff;\
		    border-top: 3px solid;\
		    box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);\
		    margin-bottom: 12px;\
		    border-radius: 3px;\
		    font-size: 13px;\
		    color: #507299;\
		    position: relative;\
			box-sizing: border-box;\
		}\
		.close{\
		    xfont-family: 'Material Icons';\
		    position: absolute;\
		    top: 8px;\
		    right: 8px;\
		    font-size: 18px;\
		    cursor: pointer;\
		}\
		.notifications content{ color: #333; }\
		.notifications .title sup{\
		    margin-left: 5px;\
		    color: #ccc;\
		}\
		.notifications .title{\
		    font-size: 16px;\
		    padding: 0px 12px 0px 0px;\
		    max-width: 300px;\
		    color: #000;\
		}\
		.notifications .title + div{\
		    margin-top: 7px;\
		    white-space: pre-line;\
		}\
		.notifications .error{ color: #E53935; }\
		.notifications .allow{ color: #4CAF50; }\
		.notifications .warn{ color: #FFA000; }\
		.notifications > div:hover{ box-shadow: 2px 3px 15px rgba(0, 0, 0, 0.25); }",
	create: function (options, timeout, type) {
		if(!kalert.notifications_zone)
			return setTimeout(kalert.create.bind(this,options, timeout, type),100);
	    if(typeof options !== "object")options = {title: options,timeout: timeout,type:type};
	    if(kalert.last_options == JSON.stringify(options)){
	        kalert.counter++;
	        kalert.last_el.remove();
	    }else{
	        kalert.counter = 1;
	    }
		var _alert = Object.assign(document.createElement("div"),{className: options.type});
		var _close = Object.assign(document.createElement("div"),{
			className:"close",
			innerHTML:"&#10006;" || "&#xE5CD;",
			onclick: function (){ _alert.remove() }
		});
		var _content = document.createElement("content");
		var _title = Object.assign(document.createElement("div"),{className: "title",textContent:options.title});
 		_alert.appendChild(_close);
 		_alert.appendChild(_content);
 		_content.appendChild(_title);
		if(options.description){
			_content.appendChild(
				Object.assign(
					document.createElement("div"),
					typeof options.description == "string"?{textContent:options.description}:options.description)
			);
		}
		if(kalert.counter > 1){
			_title.appendChild(
				Object.assign(
					document.createElement("sup"),
					{textContent:"x"+kalert.counter})
			);
		}
	    kalert.notifications_zone.appendChild(_alert);
	    kalert.last_el = _alert;
	    kalert.last_options = JSON.stringify(options);
	    if(options.timeout)setTimeout(_alert.remove.bind(_alert), options.timeout);
	    return _alert;
	},
	clear: function () {
		kalert.notifications_zone.innerHTML = "";
	},
	error: function (text, timeout) { return kalert.create(text, timeout,"error"); },
	info: function (text, timeout) { return kalert.create(text, timeout,"info"); },
	allow: function (text, timeout) { return kalert.create(text, timeout,"allow"); },
	warn: function (text, timeout) { return kalert.create(text, timeout,"warn"); },
	init: function () {
		kalert.notifications_zone = document.getElementById("notifications") || document.body.appendChild(document.createElement("div"));
		kalert.notifications_zone.className = "notifications";
		document.head.appendChild(document.createElement("style")).innerHTML = kalert.styles;
	}
}

window.addEventListener("load",kalert.init);
