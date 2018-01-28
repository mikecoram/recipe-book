const { Tag } = require('../models/');

exports.all = all;
exports.parseQuery = parseQuery;

async function all(userId, selectedIds) {
    let raw = await Tag.findAll({
        where: {
            userId: userId
        }
    });

    let tags = [];
    raw.forEach(t => {
        let selected = false;
        if (selectedIds) {
            selected = selectedIds.includes(t.id);
        }
        tags.push(parseTag(t, selected));
    });

    return tags;
}

function parseTag(raw, selected) {
    return {
        id: raw.id,
        title: raw.title,
        color: raw.color,
        selected: selected
    }
}

function parseQuery(queryString) {
    idsString = queryString.split('tag=')[1];
    let ids = [];
    queryString.split(';').forEach(id => {
        let num = Number.parseInt(id);

        if (Number.isInteger(num)) {
            ids.push(num);
        }
    });
    console.log(ids);
    return ids;
}