var templates = {
    get: function() {
        var name = type.value;
        var text = "";
        if (!templates.hasOwnProperty(name)) {
            placeholder.style.display = "block";
            VK.api("storage.get", {
                key: type.value
            }, function(r) {
                placeholder.style.display = "none";
                if (r.error) return kalert.error(lang.error_get + r.error.error_msg, 5000);
                setCode(r.response);
            });
        } else {
            text = templates[name].toString();
            text = text
                .substr(14, text.length - 20)
                .replace(/^\s{8}/mg, "")
                .replace(/109837093/g, Args.group_id);
        }
        setCode(text);
    },
    text: function() {
        return {
            "title": "Заголовок виджета",
            "title_url": "vk.com/title_url",
            "title_counter": 1,
            "text": "Текст",
            "descr": "Описание",
            "more": "Дополнительная ссылка",
            "more_url": "vk.com/more_url",
        };
    },
    list: function() {
        return {
            "title": "Заголовок виджета",
            "title_url": "vk.com/title_url",
            "title_counter": 1,
            "rows": [{
                "title": "Заголовок блока",
                "title_url": "vk.com/rows[0].title_url",
                "button": "Открыть",
                "button_url": "vk.com/rows[0].button_url",
                "descr": "Описание",
                "address": "Адрес",
                "time": "Время",
                "text": "Текст",
            }],
            "more": "Дополнительная ссылка",
            "more_url": "vk.com/more_url"
        };
    },
    table: function() {
        return {
            "title": "Заголовок виджета",
            "title_url": "vk.com/title_url",
            "title_counter": 1,
            "more": "Дополнительная ссылка",
            "more_url": "vk.com/more_url",
            "head": [{
                    "text": "Заголовок #1"
                },
                {
                    "text": "Заголовок #2",
                    "align": "right"
                }
            ],
            "body": [
                [{
                        "text": "Содержимое 1x1"
                    },
                    {
                        "text": "Содержимое 1x2",
                        "url": "vk.com/body[0].1.url"
                    }
                ]
            ]
        };
    },
    tiles: function() {
        return {
            "title": "Заголовок",
            "more": "Дополнительно",
            "more_url": "vk.com/more_url",
            "tiles": [{
                "title": "Заголовок 1",
                "descr": "Описание 1",
                "link": "Ссылка 1",
                "link_url": "vk.com/tiles[0].link_url",
                "url": "vk.com/tiles[0].url",
                "icon_id": "club1"
            }, {
                "title": "Заголовок 2",
                "descr": "Описание 2",
                "link": "Ссылка 2",
                "link_url": "vk.com/tiles.1.link_url",
                "url": "vk.com/tiles.1.url",
                "icon_id": "club1"
            }, {
                "title": "Заголовок 3",
                "descr": "Описание 3",
                "link": "Ссылка 3",
                "link_url": "vk.com/tiles.2.link_url",
                "url": "vk.com/tiles.2.url",
                "icon_id": "club1"
            }]
        };
    },
    cover_list: function() {
        // не работает из-за cover_id
        return {
            "title": "title",
            "more": "more",
            "more_url": "vk.com/more_url",
            "rows": [{
                "title": "rows[0].title",
                "title_url": "vk.com/rows[0].title_url",
                "button": "rows[0].button",
                "button_url": "vk.com/rows[0].button_url",
                "descr": "rows[0].descr",
                "address": "rows[0].address",
                "time": "rows[0].time",
                "text": "rows[0].text",
                "cover_id": "club1",
                "url": "vk.com/rows[0].url",
            }, {
                "title": "rows.1.title",
                "title_url": "vk.com/rows.1.title_url",
                "button": "rows.1.button",
                "button_url": "vk.com/rows.1.button_url",
                "descr": "rows.1.descr",
                "address": "rows.1.address",
                "time": "rows.1.time",
                "text": "rows.1.text",
                "cover_id": "club1",
                "url": "vk.com/rows.1.url",
            }]
        };
    },
    match: function() {
        return {
            "title": "Заголовок виджета",
            "title_url": "vk.com/title_url",
            "title_counter": 1,
            "more": "Дополнительная ссылка",
            "more_url": "vk.com/more_url",
            "match": {
                "state": "Состояние",
                "team_a": {
                    "name": "Название A",
                    "descr": "Описание A"
                },
                "team_b": {
                    "name": "Название B",
                    "descr": "Описание B"
                },
                "score": {
                    "team_a": 1,
                    "team_b": 2
                },
                "events": {
                    "team_a": [{
                        "event": "Событие команды A",
                        "minute": 3
                    }],
                    "team_b": [{
                        "event": "Событие команды B",
                        "minute": 4
                    }]
                }
            },
        };
    },
    matches: function() {
        return {
            "title": "Заголовок",
            "title_url": "vk.com/title_url",
            "more": "Дополнительно",
            "more_url": "vk.com/more_url",
            "matches": [{
                "icon_id": "club1",
                //"live_url": "[[video-123456_64321]]", // id трансляции
                "team_a": {
                    "name": "Название команды A",
                    "icon_id": "club1"
                },
                "team_b": {
                    "name": "Название команды B",
                    "icon_id": "club1"
                },
                "score": {
                    "team_a": 1,
                    "team_b": 2
                }
            }]
        };
    },
    text_api_group: function() {
        // groups.getById не работает, пробуйте другой пример
        var g = API.groups.getById({
            group_id: 109837093,
            fields: "members_count, description"
        })[0];
        return {
            "title": g.name,
            "title_url": "vk.com/club" + g.id,
            "text": g.description,
            "title_counter": g.members_count
        };
    },
    user_welcome: function() {
        var uid = parseInt(Args.uid),
            gid = 109837093,
            user = API.users.get({
                id: uid
            })[0],
            isMember = API.groups.isMember({
                group_id: gid,
                user_id: uid
            }),
            text = user.first_name + ", подпишитесь на наше сообщество " +
            "чтобы получать новости одним из первых";
        if (isMember) text = "Спасибо, что Вы с нами!";

        return {
            "title": "Приветствуем Вас",
            "text": text
        };
    },
    user_welcome1: function() {
        Args.uid = parseInt(Args.uid);
        var gid = 109837093,
            count = 3, // максимум 6
            members = API.users.get({
                id: Args.uid
            }) + API.groups.getMembers({
                group_id: gid,
                fields: "first_name",
                // sort: "time_desc", //  работать будет только у руководства группы
                count: count
            }).items,
            isMember = API.groups.isMember({
                group_id: gid,
                user_id: Args.uid
            }),
            title = "Наши новые подписчики",
            items = [],
            i = false;
        if (isMember) title = "Наши лучшие подписчики";
        if (members.length < count) count = members.length;
        while (items.length < count) {
            i = members[items.length];
            if (items.length > 0 && i.id == Args.uid) {} else {
                items.push({
                    icon_id: "id" + i.id,
                    title: i.first_name + " " + i.last_name,
                    title_url: "vk.com/id" + i.id
                });
            }
        }
        return {
            "title": title,
            "rows": items
        };
    }
};
