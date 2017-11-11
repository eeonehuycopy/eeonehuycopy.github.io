/* jshint evil: true */
var ge = function(id, el) {
        return (el || document).getElementById(id);
    },
    ce = function(name, body, style) {
        if (!body) body = {};
        if (typeof body == "string") body = {
            textContent: body
        };
        var names = name.split(/((?:\#|\.)\w+)/);
        var tag = names.shift();
        if (names.length && names[0][0] == "#")
            body.id = names.shift().substr(1);
        if (names.length) {
            if (body.className) names.unshift(body.className || "");
            body.className = names.join(" ").replace(/\s?\./g, "");
        }
        var el = document.createElement(tag);
        Object.assign(el, body);
        Object.assign(el.style, body.style, style);
        return el;
    },
    data = false;

function moveToCenter(el) {
    if (el.clientHeight < document.body.clientHeight - 24) {
        el.style.top = "50%";
        el.style.marginTop = -(el.clientHeight / 2) - 12 + "px";
    } else {
        el.style.top = "0px";
        el.style.marginTop = "0px";
    }
}

window.addEventListener('resize', function() {
    moveToCenter(box_window);
    moveToCenter(widget);
});

window.addEventListener('load', function(e) {
    moveToCenter(box_window);
    moveToCenter(widget);
    box.close = function() {
        ge("box").style.display = "none";
    };
});

function render(msg) {
    console.log("render", msg);
    data = msg || data;
    widget_body.innerHTML = document.getElementById('template_' + data.type).innerHTML;
    if (data.type == "table"){
        widget_header.classList.add("header_separated");
    }else {
        widget_header.classList.remove("header_separated");
    }
    var hover = false;
    [].map.call(document.getElementsByClassName('editable'), function(el) {
        el.onmouseleave = function(e) {
            if(!hover) return ;
            hover.onclick = null;
            hover.classList.remove("hover");
            hover = false;
        };
        el.onmouseenter = function(e) {
            if (hover) {
                hover.onclick = null;
                hover.classList.remove("hover");
            }
            hover = el;
            el.classList.add("hover");
            hover.onclick = edit.bind(this, e, el);
            e.stopPropagation();
        };
    });
    moveToCenter(widget);
}

function edit(event, el) {
    ge("box_body").innerHTML = "";
    var values = el.querySelectorAll('[path]');
    if (!values) return;
    values = Array.from(values);
    if(el.getAttribute("path") && !el.classList.contains("section")) values = values.concat([el]);
    var f = document.createDocumentFragment();
    values.map(function(e) {
        f.appendChild(ce("h4.subheader", getPath(e)));
        f.appendChild(ce("input.dark", {
            type: "text",
            value: e.textContent.trim(),
            key: "textContent",
            for: e,
            onkeydown: save
        }));
        if(e.classList.contains("link")){
            f.appendChild(ce("input.dark.link", {
                type: "text",
                value: (e.href || "").trim(),
                key: "href",
                for: e,
                onkeydown: save
            }));
        }
    });
    ge("box_body").appendChild(f);
    ge("box").style.display = "block";
    moveToCenter(box_window);
}

function getPath(el) {
    var path = "";
    while (el.parentNode) {
        path = (el.getAttribute("path") || "") + path;
        el = el.parentNode;
    }
    return path;
}

function getValueByPath(o, path) {
    var v = "";
    try {
        v = new Function("o", "return o." + path)(o);
    } catch (e) {
        console.error(e);
    }
}

function setValueByPath(o, path, value) {
    return new Function("o", "v", "return o." + path + " = v;")(o, v);
}


function save(e) {
    if (e.type == "keydown" && e.keyCode !== 13) return;

    var abort = false;
    Array.from(document.querySelectorAll('input.dark')).map(function(e) {
        e.classList.remove("warn");
        console.log(getPath(e.for), e.value);
        if (e.key == "href") {
            if (!e.value || !/vk\.com/.test(e.value)) {
                if (e.value || e.for.getAttribute("required")) {
                    abort = true;
                    return e.classList.add("warn");
                }
            }
            e.for.title = e.value;
        } else {
            if (e.value == "") {
                if (e.for.getAttribute("required")) {
                    abort = true;
                    return e.classList.add("warn");
                } else {
                    e.for.classList.add("empty");
                }
            }
            e.for.textContent = e.value;
        }
    });

    if (!abort) box.close();
}

// table
