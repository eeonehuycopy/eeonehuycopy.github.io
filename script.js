/* jshint evil: true */

var editor,
    ge = function(id, el) {
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
    lang = {
        name_warn: "Название может только содержать символы латинского алфавита, цифры, и нижнее подчёркивание",
        enter_name: "Введите название.",
        error_get_script_list: "Ошибка получения списка скриптов: ",
        error_save: "Ошибка сохранения скрипты: ",
        error_get: "Ошибка получения скрипта: ",
        show_code: "Показать код",
        editor_visual: "Визуальный редактор",
        install_app: "Установи приложение.",
        select_group: "Выбери группу."
    };

var Args = location.search.substr(1).split("&").reduce(function(r, v) {
    v = v.split("=");
    r[v[0]] = v[1] || "";
    return r;
}, {});

function toggleEditor() {
    function showPage(page) {
        document.querySelector('.page.active').classList.remove("active");
        document.getElementById(page).classList.add("active");
    }

    if (document.querySelector('.page.active').id == "editor_code") {
        showPage('editor_visual');
        toggle_editor.textContent = lang.show_code;
    } else {
        showPage('editor_code');
        toggle_editor.textContent = lang.editor_visual;
    }
}

function getWidgetType() {
    return type.active.name || type.active.getAttribute("name") || type.value;
}

function saveWidget() {
    VK.callMethod('showAppWidgetPreviewBox', getWidgetType(), editor.getValue());
}
function showResponse() {
    VK.api('execute', {
        type: getWidgetType(),
        uid: Args.user_id ? Args.user_id : Args.vk_user_id,
        code: editor.getValue(),
    }, function (r) {
        alert(JSON.stringify(r, null, "\t"));
    });
}

function setCode(text) {
    editor.setValue(text);
    editor.navigateFileStart();
    render(text);
}

function render() {
    if(Args.user_id == "61351294")
        VK.api("execute", {
            code: editor.getValue()
        }, function(r) {
            if (r.error) return kalert.error(lang.error_render + r.error.error_msg);
            editor_visual.contentWindow.render({
                type: getWidgetType(),
                res: r.response,
                code: editor.getValue()
            });
        });
}

function getDataByKey(key) {
    var sepIndex = key.indexOf("-");
    return {
        key: key,
        type: key.substr(0, sepIndex),
        name: key.substr(sepIndex + 1)
    };
}

function saveCode() {
    var active_name = getDataByKey(type.value);
    active_name = active_name.name || getWidgetType() + Date.now();
    var name = prompt(lang.enter_name + " " + lang.name_warn, active_name);
    if (!name) return;
    if (!/^([a-z0-9_]+)$/i.test(name)) return kalert.error(lang.name_warn, 5000);
    VK.api("storage.set", {
        key: getWidgetType() + "-" + name,
        value: editor.getValue()
    }, function(r) {
        if (r.error) return kalert.error(lang.error_save + r.error.error_msg);
        loadUserScripts();
    });
}

function loadUserScripts() {
    VK.api("storage.getKeys", {}, function(r) {
        if (r.error) return kalert.error(lang.error_get_script_list + r.error.error_msg);
        if (!r.response.length) return;
        var active = type.value;
        ge("user_scripts").innerHTML = "";
        var f = document.createDocumentFragment();
        r.response.map(function(key) {
            key = getDataByKey(key);
            f.appendChild(ce("div", {
                value: key.key,
                name: key.type,
                textContent: key.name
            })).setAttribute("value", key.key);
        });
        ge("user_scripts").appendChild(f);
        type.selectByValue(active);
    });
}

function InitAce() {
    editor = ace.edit("editor_code");
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode("ace/mode/javascript");
    editor.setShowPrintMargin(false);
    editor.getSession().setUseWrapMode(true);
}

function InitSelect(s) {
    s.draggable = true;

    function onBlur(e) {
        if (e.type == "click" && s.contains(e.target)) return;
        s.className = "select";
    }

    function select(o) {
        if (s.active) s.active.className = "";
        o.className = "active";
        s.value = o.value || o.getAttribute("value");
        s.active = o;
        if (s.onselect) s.onselect(s.value);
    }
    s.selectByValue = function(value) {
        select(s.querySelector('[value="' + value + '"]') || s.firstElementChild);
    };
    s.ondragstart = function(e) {
        s.click = false;
        return false;
    };
    s.onmousedown = s.onmouseup = function(e) {
        if (e.target.getAttribute("disabled") || e.target == s) return;
        if (e.type == "mouseup" && s.click) return;
        if (s.className == "select open") {
            document.body.removeEventListener("click", onBlur);
            window.removeEventListener("blur", onBlur);
            if (!e.target.onclick) select(e.target);
            s.className = "select";
        } else {
            s.className = "select open";
            document.body.addEventListener("click", onBlur);
            window.addEventListener("blur", onBlur);
            s.click = true;
        }
    };
    select(s.querySelector('.active'));
}

function showIndex() {
    document.body.innerHTML = "";
    document.body.style.padding = "32px";
    VK.api("groups.get", {
        filter: "admin",
        extended: 1
    }, function(r) {
        var f = document.createDocumentFragment();
        f.appendChild(ce("a.h1", {
            href: "https://vk.com/add_community_app?aid=6253668",
            textContent: lang.install_app,
            target: "_blank"
        }));
        f.appendChild(ce("h1", lang.select_group));
        r.response.items.map(function(g) {
            f.appendChild(ce("a.button", {
                href: "https://vk.com/app6253668_-" + g.id,
                textContent: g.name,
                target: "_blank"
            }));
        });
        document.body.appendChild(f);
    });
}

window.addEventListener("load", function() {
    VK.init(function(r) {
        VK.addCallback('onAppWidgetPreviewFail', function(e) {
            kalert.create({
                title: "Ошибка просмотра виджета",
                description: e,
                timeout: 10000,
                type: "error"
            });
        });
        if (!Args.hasOwnProperty("group_id") && !Args.hasOwnProperty("vk_group_id")) return showIndex();
        loadUserScripts();
        document.getElementById('placeholder').style.display = "none";
        InitAce();
        type.onselect = templates.get;
        [].map.call(document.getElementsByClassName('select'), InitSelect);
    }, function(e) {
        console.error("VK.init error", e);
        kalert.error("Ошибка загрузки приложнеия");
    }, '5.68');
});
