// ==UserScript==
// @name         智慧树给爷爬
// @namespace    http://crsec.com
// @version      0.1
// @description  智慧树自动刷下一节助手
// @author       在野武将
// @match        https://hike.zhihuishu.com/aidedteaching/sourceLearning/sourceLearning?courseId=*&fileId=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// ==/UserScript==

function getListDiv() {
    var $ = window.jQuery;
	if ($(".right").length != 1) {
		printError();
		return null;
	}
	return $(".right")[0];
}

function printError() {
	console.log("智慧树: 无法获取到所需信息，平台已经更新，请在github上提交issue.")
}

function getClassName() {
	return getListDiv().firstElementChild.innerText;
}

function isCourseFinished(course) {
	for (var i = 0; i < course.childNodes.length; i++) {
		if (course.childNodes[i].className != undefined && course.childNodes[i].className == "status-box") {
			if (course.childNodes[i].childNodes.length == 1) {
				return true;
			}
		}
	}
	return false;
}

function enumChildNodes(obj, class_list) {
    var $ = window.jQuery;
	for (var i = 0; i < obj.childNodes.length; i++) {
		//console.log(obj.childNodes[i].className)
		if (obj.childNodes[i].className != undefined && obj.childNodes[i].className.indexOf("file-item") != -1) { //如果遍历到了课程
			if (!isCourseFinished(obj.childNodes[i])) {
				class_list.push(obj.childNodes[i])
			}
		}
		else {
			enumChildNodes(obj.childNodes[i], class_list);
		}
	}
}

function checkFinish() {
    var $ = window.jQuery;
	return ($(".playButton").length > 0);
}

function getNeedStudyCourseList() {
    var $ = window.jQuery;
	var i;
    var list_div;
    var class_list;

    for (i = 0; i < getListDiv().childNodes.length; i++) {
		if (getListDiv().childNodes[i].className != undefined && getListDiv().childNodes[i].className.indexOf("source-list") != -1) {
			list_div = getListDiv().childNodes[i];
		}
	}

	for (i = 0; i < list_div.childNodes; i++) {
		if (getListDiv().childNodes[i].className != undefined && list_div.childNodes[i].className.indexOf("nano-content") != -1) {
			list_div = list_div.childNodes[i];
		}
	}

	class_list = new Array()
	enumChildNodes(list_div, class_list)
	return class_list
}

function getCourseName(obj) {
	for (var i = 0; i < obj.childNodes.length; i++) {
		if (obj.childNodes[i].className != undefined && obj.childNodes[i].className == "file-name") {
			return obj.childNodes[i].innerText;
		}
	}
	return null;
}

function init() {
    var $ = window.jQuery;
	console.log("智慧树给爷爬 -- Version: v1.0");
	console.log("课程名: " + getClassName());

	h_timer = setInterval(function() {

        //debugger;
        if (checkFinish()) {
            $(".playButton").click();
            clearInterval(h_timer);


			var course_list = getNeedStudyCourseList();


			for (var i = 0; i < course_list.length; i++) {
				if (getCourseName(course_list[i]) == null) {
					console.log(course_list[i])
					printError();
					return;
				}

				console.log("未完成课程: " + getCourseName(course_list[i]));
			}

			if (course_list.length < 1) {
				console.log("可喜可贺, 已经没有待学习课程.");
				return;
			}

			h_timer = setInterval(function() {
				if (checkFinish()) {
					course_list[0].onclick();
				}
			}, 5000)
        }
    }, 5000)



}

var h_timer;
init();