const tagQuery = '?tag=';

$(document).ready(e => {
    $('.tag').click(e => {
        console.log(getNewUrl(parseIdNumber(e.target.id)));
        window.location.replace(getNewUrl(
            parseIdNumber(e.target.id)
        ));
    });
});

function parseIdNumber(idString) {
    return idString.split('tag-')[1];
}

function getNewUrl(id) {
    let href = window.location.href;
    let split = href.split(tagQuery);

    if (split[1]) {
        let idList = split[1].split(';').filter(i => {
            return Number.isInteger(Number.parseInt(i));
        });

        if (idList.includes(id)) {
            // Remove from list
            idList = idList.filter(fid => {return fid != id;});
        }
        else {
            idList.push(id);
        }

        let newIdListString = '';
        idList.forEach(id => {
            newIdListString += id + ';';
        });

        if (idList.length == 0) {
            return split[0];
        }

        return split[0] + tagQuery + newIdListString + (split[2] ? split[2] : '');
    }
    else {
        return href + tagQuery + id;
    }
}