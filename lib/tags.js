const { Tag } = require('../models/');

exports.all = all;

async function all(userId) {
    let raw = await Tag.findAll({
        where: {
            userId: userId
        }
    });

    let tags = [];
    raw.forEach(t => {
        tags.push(parseTag(t));
    });

    return tags;
}

function parseTag(raw) {
    return {
        id: raw.id,
        title: raw.title,
        color: raw.color
    }
}