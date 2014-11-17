function getRandomSelectors(sheet) {
	if (sheet.cssRules === null) {
		return;
	}
	var random = randomSet(sheet.cssRules.length);
	var rule;
	var selector;
	var items = [];

	for (var i = 0; i < random.length; i++) {
		rule = sheet.cssRules[random[i]];

		if (typeof rule === 'undefined') {
			continue;
		}
		selector = rule.selectorText;
		
		items.push(processSelector(selector));
	}
    return items;
}

function randomSet(max) {
	var list = [];
	var nr = Math.round(Math.random() * max);
	while(list.length < Math.min(max, 3)) {
		if (list.indexOf(nr) === -1) {
			list.push(nr);
		}
		nr = Math.round(Math.random() * max);
	}
	return list;
}

function processSelector(selector) {
	var item = {};
    var isMultiple = selector.indexOf(',') > -1;
    var subSelectors;

    if (isMultiple) {
        subSelectors = selector.split(',');
    }

    item.selector = selector;
	item.count = checkRule(selector);
    if (isMultiple) {
        item.subselectors = [];
        for(var k = 0; k < subSelectors.length; k++) {
            item.subselectors.push({
                count: checkRule(subSelectors[k]),
                selector: subSelectors[k].trim()
            });
        }
    }
    return item;
}

function checkRule(selectorText) {
	var present = document.querySelectorAll(selectorText);
	return present.length;
}

(function() {
    var sheets = document.styleSheets;
    var items;
	for (var i = 0; i < sheets.length; i++) {
		items = getRandomSelectors(sheets[i]);
	}
    var data = JSON.stringify(items);
    try {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://127.0.0.1:8080/post', true);
        ajax.send(data);
    } catch(e) {}
}());
