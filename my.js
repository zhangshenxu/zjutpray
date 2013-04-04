//
/*
 * 注意：本程序中的“随机”都是伪随机概念。
 * 第一个种子相对固定，第二个种子相对有更多变化
 */
function random(seed1, seed2) {
	var n = seed1 % 11117;
	for (var i = 0; i < 100 + seed2; i++) {
		n = n * n;
		n = n % 11117; // 11117 是个质数
	}
	return n;
}

// 从数组中随机挑选 size 个
function pickRandom(array, size) {
	var result = [];

	for (var i = 0; i < array.length; i++) {
		result.push(array[i]);
	}

	for (var j = 0; j < array.length - size; j++) {
		var index = random(iday, j) % result.length;
		result.splice(index, 1);
	}

	return result;
}

var weeks = ["日", "一", "二", "三", "四", "五", "六"];
function getTodayString() {
	return "今天是" + today.getFullYear() + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日 星期" + weeks[today.getDay()];
}

var today = new Date();
var timeseed = today.getMilliseconds();

/////////////////////////////////////////////////////////

var results = ['超大吉', '大吉', '吉', '小吉', '未知', '小胸', '胸', '大胸', '超大胸'];
var luck_rate = [10, 100, 500, 800, 300, 800, 500, 100, 10]; // 吉凶概率分布，总数为 3120

/*var descriptions = {
	100: ['写起代码来如游戏达人打通关一般痛快', '“代码本来就在那里，我不过是把它们写出来罢了。”', '单元测试可以一次通过，如果有单元测试的话。', '正确的划分逻辑，将保持你的思路清晰。', '不会出什么大问题。', '', '', '', ''],
	200: ['', '', '', '', '', '', '', '', ''],
	300: ['', '', '', '', '', '', '', '', ''],
	400: ['', '', '', '', '', '', '', '', ''],
	500: ['', '', '', '', '', '', '', '', '']
};*/

function pickRandomWithRate(seed1, seed2) {
	var result = random(seed1, seed2) % 3120;
	var addup = 0;
	
	for (var i = 0; i < luck_rate.length; i++) {
		addup += luck_rate[i];
		if (result <= addup) {
			return results[i];
		}
	}
	return ' ';
}

/////////////////////////////////////////////////////////
var selectedEvent = null;

function initEventTable() {
	$('.event_table td').click(function() {
		$('.event_table td').removeClass('selected');
		$(this).addClass('selected'); 
		selectedEvent = $(this).data('event');
		
		$('div.card.clickable').nextAll().remove();
		showCard('div.card.clickable', 300);
	});
}

// TODO 概率分布
function getNextCardText() {
	return pickRandomWithRate(timeseed + selectedEvent, slidecount);
}

function showCard(selector, duration, complete) {
	$(selector).animate({top:'-1px'}, duration, 'swing', complete);
}

var tail, slidecount = 0;

function initClickEvent() {
	$('div.card.clickable').click(function() {
		tail = $('div.card.clickable');
		slidecount = 0;
		slide();
	});
}

function slide() {
	if (slidecount > 35) {
		return;
	}
	
	var duration = slidecount > 32? 800: 
			(slidecount > 25? 400: 
			 (slidecount > 20? 200: 
				(slidecount > 15? 150: 100)));
	card = $('<div class="card">' + getNextCardText() +'</div>');
	tail.after(card);
	tail = card;
	slidecount++;
	showCard(card, duration, slide);
}

$(function() {
	$('.date').html(getTodayString());
	initEventTable();
	initClickEvent();
});