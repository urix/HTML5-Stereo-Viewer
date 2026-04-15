/*

HTML5 Stereo Viewer

version 1.7

Copyright (C) 2011-2026 Yury Golubinsky

This work is licensed under the
Creative Commons Attribution 3.0 Unported License.
To view a copy of this license,
visit http://creativecommons.org/licenses/by/3.0/

*/

var stereover = "1.7";
var images = new Array();
var imagesT = new Array();
var imagesC = new Array();
var imageN = 0;
var stereoMode = 5;
var stereoBGcolor = 0;
var stereoMouse = -1;
var stereoNavDef = 0;//30;
var stereoNav = stereoNavDef;
var stereoOptVis = false;
var stereoSwap = false;
var stereoCaption = true;
var stereoCaptionSrc = "alt";
var stereoDefType = "stereoRL";
var stereoiOS = false;
var stereoiOS_iPad = false;
var stereoiOS_iPhone = false;
var stereoIE = false;
var stereourl = "http://urixblog.com/html5-stereo-viewer";
var stereourlvis = "http://urixblog.com/...";
var stereoCPRGHT = "(C) 2011-2026 Yury Golubinsky";
var stereoModes = 11;
var stereoGlasses = 0;
var sGlassesRedCyan = 0;
var sGlassesGreenMagenta = 1;
var stereoFirstTimeHelpDisplayed = true;
var imageEls = new Array();

function stereoViewerOpen(Mode, Swap, BGColor, Caption, CaptionSrc, Type) {
	/*
	Mode		- stereo mode (0..9...). Default: 5
	Swap		- swap left and right sides (true, false). Default: false
	BGColor		- backgroung color (0,1,2) for Black, Gray and White. Default: 0
	Caption		- show captions (true, false). Default: true
	CaptionSrc	- caption text source name ("alt", "title"). Default: "alt"
	Type		- default stereo images type ("anaglyph", "flat", "stereoLR", "stereoRL", ""), for images with class="stereo". The value "" corresponds to "stereoRL"
	*/

	if (Caption != undefined)
		stereoCaption = Caption;
	if (CaptionSrc != "")
		stereoCaptionSrc = CaptionSrc;
	if (Type != "")
		stereoDefType = Type;
	if ((Mode != undefined) & (Mode >= 0) & (Mode <= stereoModes))
		stereoMode = Mode;
	if (Swap != undefined)
		stereoSwap = Swap;
	if (BGColor != undefined)
		stereoBGcolor = BGColor;

	stereoiOS_iPhone = (navigator.appVersion.indexOf("iPhone") != -1) | (navigator.appVersion.indexOf("iPod") != -1);
	stereoiOS_iPad = (navigator.appVersion.indexOf("iPad") != -1);
	stereoiOS = stereoiOS_iPad | stereoiOS_iPhone;
	if (stereoiOS)
		stereoNav = 0;

	stereoIE = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));

	if (document.getElementById("stereoViewer")) {
		document.body.insertBefore(document.getElementById("stereoViewer"), document.body.firstChild);
		document.body.removeChild(document.getElementById("stereoViewer"));
	}

	var div = document.createElement("div");
	div.id = "stereoViewer";
	div.style.position = "fixed";
	div.style.zIndex = 999990;
	div.style.top = 0;
	div.style.left = 0;
	div.style.backgroundColor = "#000";
	div.style.visibility = "visible";
	div.style.fontFamily = "arial,verdana,helvetica";

	div.innerHTML = '\
		<div id="stereoCanvasdiv" style="position:relative; overflow:hidden;" onmouseover="stereoDrawControls(event)" onmousemove="stereoDrawControls(event);" onmouseout="stereoDrawControls(event);" onclick="stereoMouseClick(event);" ondblclick="if (stereoiOS) stereoViewerOptionsOpen(!stereoOptVis);">\
			<canvas id="stereoCanvas"></canvas>\
		</div>\
		<div id="stereoControls" style="z-index:2; position:fixed; background-color:#fff; opacity:.9; padding:16px; margin:0px; border:1px solid black; visibility:hidden; left:16px; top:16px;\
			-moz-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
			-webkit-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
			box-shadow: 1px 4px 10px rgba(68,68,68,0.6);">\
			<center>\
			<input type="button" value="Close Viewer" onclick="stereoViewerClose();" />\
			<input type="button" value="Help" onclick="stereoHelpOpen();" />\
			<input type="button" value="?" onclick="stereoAboutOpen();" /></center>\
			<hr /><br />\
			<b>Mode:</b><br /><br />\
			<select onchange="stereoModeChange(0);" id="modeselect">\
			<option>Right Left (0)</option>\
			<option>Left Right (1)</option>\
			<option>Left (2)</option>\
			<option>Right (3)</option>\
			<option>Color Anaglyph (4)</option>\
			<option>Optimized Anaglyph 1 (5)</option>\
			<option>Optimized Anaglyph 2 (6)</option>\
			<option>Gray Anaglyph (7)</option>\
			<option>Half Color Anaglyph (8)</option>\
			<option>True Anaglyph (9)</option>\
			<option>Interlaced</option>\
			<option>Interlaced vertical</option>\
			</select><br />\
			<select onchange="stereoGlassesChange();" id="stereoGlasses">\
			<option>Red-Cyan glasses</option>\
			<option>Green-Magenta glasses</option>\
			</select><br /><br />\
			<input type="checkbox" value="" onclick="stereoModeChange(stereoMode);" id="stereoSwap" /> Swap<br /><br />\
			<input type="button" id="stereoSaveDef" value="Save as Default" onclick="stereoSaveDef();" />\
			<br /><hr /><br />\
			<b>Background color:</b><br /><br />\
			<input type="button" value="White" onclick="stereoBG(2);" />\
			<input type="button" value="Gray" onclick="stereoBG(1);" />\
			<input type="button" value="Black" onclick="stereoBG(0);" /><br />\
			<br /><hr /><br />\
			<input type="checkbox" value="" onclick="stereoBG(stereoBGcolor);" id="stereoNav" style="visibility:hidden"/>\
			<input type="checkbox" value="" onclick="stereoModeChange(stereoMode);" id="stereoCap" /> Show captions<br />\
		</div>\
		<div id="stereoHelp" style="z-index:3; position:fixed; background-color:#fff; opacity:.9; padding:16px; margin:0px; border:1px solid black; visibility:hidden; top:16px; right:16px;\
			-moz-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
			-webkit-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
			box-shadow: 1px 4px 10px rgba(68,68,68,0.6);">\
			Click <b>Right</b> / <b>Left</b> or <b>Center</b> parts of the image<br /> to view <b>Next</b> / <b>Previous</b> images or <b>Options</b>.<br /><br />\
			<center><b>Keyboard shortcuts:</b></center><br />\
			<center><table style="border:0"><tr><td><b>Esc&nbsp;&nbsp;</b></td><td> - &nbsp;&nbsp;close Stereo Viewer</td></tr>\
			<tr><td><b>Right Arrow&nbsp;&nbsp;</b></td><td> - &nbsp;&nbsp;next image</td></tr>\
			<tr><td><b>Left Arrow&nbsp;&nbsp;</b></td><td> - &nbsp;&nbsp;previous image</td></tr>\
			<tr><td><b>0..9&nbsp;&nbsp;</b></td><td> - &nbsp;&nbsp;change mode</td></tr>\
			<tr><td><b>s&nbsp;&nbsp;</b></td><td> - &nbsp;&nbsp;swap left/right</td></tr>\
			</table>\
			<br /><input type="button" value="OK" onclick="stereoViewerOptionsOpen(false);" /></center>\
		</div>\
		<div id="stereoAbout" style="z-index:3; position:fixed; background-color:#fff; opacity:.9; padding:16px; margin:0px; border:1px solid black; visibility:hidden; top:16px; right:16px;\
			-moz-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
			-webkit-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
			box-shadow: 1px 4px 10px rgba(68,68,68,0.6);">\
			<center><b>HTML5 Stereo Viewer</b><br />\
			version '+stereover+'<br /><br />'+stereoCPRGHT+'<br /><br />\
			<a href="'+stereourl+'">'+stereourl+'</a>\
			<br /><br /><hr /><br />\
			<a rel="license" href="http://creativecommons.org/licenses/by/3.0/" title="This work is licensed under a Creative Commons Attribution 3.0 Unported License"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/3.0/88x31.png" /></a>\
		</div>';

	document.body.insertBefore(div, document.body.firstChild);

	document.body.onkeyup = function(event){stereoKeyPress(event);};
	document.body.onmousewheel = function(event){stereoViewerClose(event);};
	document.body.onscroll = function(event){stereoViewerClose(event);};
	document.body.onorientationchange = function(event){stereoDrawImage();};

	document.getElementById("stereoControls").style.zIndex = 999991;
	document.getElementById("stereoHelp").style.zIndex = 999992;
	document.getElementById("stereoAbout").style.zIndex = 999992;

	document.getElementById("stereoCanvas").width = document.documentElement.clientWidth;
	document.getElementById("stereoCanvas").height = document.documentElement.clientHeight;
	document.getElementById("stereoViewer").style.bottom = 0;
	document.getElementById("stereoViewer").style.right = 0;
	document.getElementById("stereoNav").checked = stereoNav != 0;

	stereoCheckCookie();
	var sm = stereoGetCookie();
	if ((sm >= 0) && (sm <= stereoModes)) {
		stereoMode = sm;
		stereoSwap = stereoGetCookieSwap() > 0;
		stereoGlasses = stereoGetCookieGlasses();
	}
	for (var i = 0; i <= stereoModes; i++)
		document.getElementById("modeselect").options[i].selected = stereoMode == i;
	for (var j = 0; j < document.getElementById("stereoGlasses").options.length; j++)
		document.getElementById("stereoGlasses").options[j].selected = stereoGlasses == j;
	stereoCorrectAfterMode();
	document.getElementById("stereoSwap").checked = stereoSwap;
	document.getElementById("stereoCap").checked = stereoCaption;

	stereoCountImages();
	stereoDrawImage();

	stereoGetCookieForFirstTimeHelpDisplayed();
	if (stereoFirstTimeHelpDisplayed & !stereoiOS_iPhone) {
		stereoHelpOpen();
		stereoSetCookieForFirstTimeHelpDisplayed();
	}
}

function stereoViewerClose() {
	stereoViewerOptionsOpen(false);
	if (document.getElementById("stereoViewer") != null)
		document.body.removeChild(document.getElementById("stereoViewer"));
}

function stereoMouseClick(event) {
	var mx = 0, my = 0;
	if (!event) event = window.event;
	if (event.pageX || event.pageY) {
		mx = event.pageX;
		my = event.pageY;
	} else if (event.clientX || event.clientY) {
		mx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		my = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	var b = false;
	var cnvs = document.getElementById('stereoCanvas');
	if (mx < cnvs.width / 3) {
		stereoPrevImage();
		b = true;
	} else if (mx >= 2 * cnvs.width / 3) {
		stereoNextImage();
		b = true;
	}
	if (!b)
		stereoViewerOptionsOpen(!stereoOptVis);
}

function stereoViewerOptionsOpen(value) {
	if (document.getElementById("stereoControls") != null) {
		var s = value ? "visible" : "hidden";
		document.getElementById("stereoControls").style.visibility = s;
		if (!value) {
			document.getElementById("stereoHelp").style.visibility = s;
			document.getElementById("stereoAbout").style.visibility = s;
		}
		stereoOptVis = value;
	}
}

function stereoHelpOpen() {
	var s = (document.getElementById("stereoHelp").style.visibility == "hidden") ? "visible" : "hidden";
	document.getElementById("stereoHelp").style.visibility = s;
	document.getElementById("stereoAbout").style.visibility = "hidden";
}

function stereoAboutOpen() {
	var s = (document.getElementById("stereoAbout").style.visibility == "hidden") ? "visible" : "hidden";
	document.getElementById("stereoAbout").style.visibility = s;
	document.getElementById("stereoHelp").style.visibility = "hidden";
}

function stereoDrawControls(event) {
	var mx = 0, my = 0;
	if (!event) event = window.event;
	if (event.pageX || event.pageY) {
		mx = event.pageX;
		my = event.pageY;
	} else if (event.clientX || event.clientY) {
		mx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		my = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	if (stereoNav > 0) {
		var cnvs = document.getElementById('stereoCanvas');
		var ctx = cnvs.getContext('2d');
		function _draw(color1, color2, color11, color22) {
			ctx.fillStyle = color1;
			ctx.fillRect(0, 0, stereoNav, cnvs.height);
			ctx.fillStyle = color11;
			ctx.beginPath();
			ctx.moveTo(stereoNav / 3, cnvs.height / 2);
			ctx.lineTo(2 * stereoNav / 3, cnvs.height / 2 + stereoNav / 3);
			ctx.lineTo(2 * stereoNav / 3, cnvs.height / 2 - stereoNav / 3);
			ctx.lineTo(stereoNav / 3, cnvs.height / 2);
			ctx.fill();
			ctx.fillStyle = color2;
			ctx.fillRect(cnvs.width - stereoNav, 0, cnvs.width, cnvs.height);
			ctx.fillStyle = color22;
			ctx.beginPath();
			ctx.moveTo(cnvs.width - stereoNav / 3, cnvs.height / 2);
			ctx.lineTo(cnvs.width - 2 * stereoNav / 3, cnvs.height / 2 + stereoNav / 3);
			ctx.lineTo(cnvs.width - 2 * stereoNav / 3, cnvs.height / 2 - stereoNav / 3);
			ctx.lineTo(cnvs.width - stereoNav / 3, cnvs.height / 2);
			ctx.fill();
		}
		var color1, color2, color11, color22;
		switch (stereoBGcolor) {
			case 0: color1 = "rgba(60,60,60,1.0)"; color2 = "rgba(30,30,30,1.0)"; color11 = "rgba(30,30,30,1.0)"; color22 = "rgba(0,0,0,1.0)"; break;
			case 1: color1 = "rgba(190,190,190,1.0)"; color2 = "rgba(160,160,160,1.0)"; color11 = "rgba(160,160,160,1.0)"; color22 = "rgba(130,130,130,1.0)"; break;
			default: color1 = "rgba(240,240,240,1.0)"; color2 = "rgba(220,220,220,1.0)"; color11 = "rgba(255,255,255,1.0)"; color22 = "rgba(240,240,240,1.0)";
		}
		if ((mx >= 0) && (mx < stereoNav) && (my >= 0) && (my < cnvs.height)) {
			if (stereoMouse != 0) {
				_draw(color1, color2, color11, color22);
				stereoMouse = 0;
			}
		} else if ((mx >= cnvs.width - stereoNav) && (mx < cnvs.width) && (my >= 0) && (my < cnvs.height)) {
			if (stereoMouse != 2) {
				_draw(color2, color1, color22, color11);
				stereoMouse = 2;
			}
		} else if (stereoMouse != 1) {
			_draw(color2, color2, color22, color22);
			stereoMouse = 1;
		}
	}
}

function stereoImgWidth(img) {
	return (img && (img.naturalWidth || img.width)) ? (img.naturalWidth || img.width) : 0;
}

function stereoImgHeight(img) {
	return (img && (img.naturalHeight || img.height)) ? (img.naturalHeight || img.height) : 0;
}

function stereoEscapeAttr(value) {
	return String(value).replace(/&/g,'&amp;').replace(/\"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function stereoBuildMatrix(rRow,gRow,bRow){ return [rRow[0],rRow[1],rRow[2],0,0,gRow[0],gRow[1],gRow[2],0,0,bRow[0],bRow[1],bRow[2],0,0,0,0,0,1,0].join(' ');
}

function stereoEnsureImageLayer() {
	var canvasDiv = document.getElementById('stereoCanvasdiv');
	var canvas = document.getElementById('stereoCanvas');
	if (!canvasDiv || !canvas)
		return null;
	canvasDiv.style.position = 'relative';
	canvasDiv.style.overflow = 'hidden';
	canvas.style.position = 'relative';
	canvas.style.zIndex = 1;
	canvas.style.background = 'transparent';
	var layer = document.getElementById('stereoImageLayer');
	if (!layer) {
		layer = document.createElement('div');
		layer.id = 'stereoImageLayer';
		layer.style.position = 'absolute';
		layer.style.pointerEvents = 'none';
		layer.style.zIndex = 0;
		layer.style.isolation = 'isolate';
		canvasDiv.insertBefore(layer, canvas);
	}
	return layer;
}

function stereoClearImageLayer() {
	var layer = document.getElementById('stereoImageLayer');
	if (!layer)
		return;
	layer.innerHTML = '';
	layer.style.left = '0px';
	layer.style.top = '0px';
	layer.style.width = '0px';
	layer.style.height = '0px';
}

function stereoGetEyeSource(imgType, swap, srcHalfWidth) {
	var leftX = imgType === 'stereoLR' ? 0 : srcHalfWidth;
	var rightX = imgType === 'stereoLR' ? srcHalfWidth : 0;
	if (swap) {
		var t = leftX;
		leftX = rightX;
		rightX = t;
	}
	return { leftX: leftX, rightX: rightX };
}

function stereoGetSvgMatrices(mode, glasses) {
	var isGM = glasses === sGlassesGreenMagenta;
	var zero = [0,0,0], idR = [1,0,0], idG = [0,1,0], idB = [0,0,1], gray = [0.299,0.587,0.114], opt1 = [0,0.7,0.3], opt2R = [0.39915,0.41195,0.18825], opt2G = [0.45,0.55,0], opt2B = [0.25,0,0.75];
	switch (mode) {
		// 4 color anaglyph
		// 5 optimized color anaglyph
		// 6 optimized+ color anaglyph
		// 7 gray anaglyph
		// 8 half color anaglyph
		// 9 true anaglyph
		case 4: return isGM ? { left:{r:zero,g:idG,b:zero}, right:{r:idR,g:zero,b:idB} } : { left:{r:idR,g:zero,b:zero}, right:{r:zero,g:idG,b:idB} };
		case 5: return isGM ? { left:{r:zero,g:idG,b:zero}, right:{r:opt1,g:zero,b:idB} } : { left:{r:opt1,g:zero,b:zero}, right:{r:zero,g:idG,b:idB} };
		case 6: return isGM ? { left:{r:zero,g:opt2G,b:zero}, right:{r:opt2R,g:zero,b:opt2B} } : { left:{r:opt2R,g:zero,b:zero}, right:{r:zero,g:opt2G,b:opt2B} };
		case 7: return isGM ? { left:{r:zero,g:gray,b:zero}, right:{r:gray,g:zero,b:gray} } : { left:{r:gray,g:zero,b:zero}, right:{r:zero,g:gray,b:gray} };
		case 8: return isGM ? { left:{r:zero,g:idG,b:zero}, right:{r:gray,g:zero,b:idB} } : { left:{r:gray,g:zero,b:zero}, right:{r:zero,g:idG,b:idB} };
		case 9: return isGM ? { left:{r:zero,g:gray,b:zero}, right:{r:gray,g:zero,b:zero} } : { left:{r:gray,g:zero,b:zero}, right:{r:zero,g:zero,b:gray} };
	}
	return null;
}

function stereoBuildCroppedEyeSvg(imageUrl, leftX, srcHalfWidth, srcHeight, userWidth, userHeight, displayWidth, displayHeight, extraStyle, filterId, maskId) {
	var maskPart = maskId ? ' mask="url(#' + maskId + ')"' : '';
	var filterPart = filterId ? ' filter="url(#' + filterId + ')"' : '';
	var stylePart = extraStyle ? ' style="' + extraStyle + '"' : '';
	return '<svg x="0" y="0" width="' + displayWidth + '" height="' + displayHeight + '" viewBox="0 0 ' + userWidth + ' ' + userHeight + '" preserveAspectRatio="none"' + maskPart + stylePart + '>' +
		'<svg x="0" y="0" width="' + userWidth + '" height="' + userHeight + '" viewBox="' + leftX + ' 0 ' + srcHalfWidth + ' ' + srcHeight + '" preserveAspectRatio="none">' +
		'<image href="' + imageUrl + '" x="0" y="0" width="' + (srcHalfWidth * 2) + '" height="' + srcHeight + '" preserveAspectRatio="none" image-rendering="optimizeSpeed"' + filterPart + ' />' +
		'</svg></svg>';
}

function stereoRenderSvgFallback(options) {
	var layer = stereoEnsureImageLayer();
	if (!layer) return false;
	var displayLeft = Math.round((options.cnvswidth - options.displayWidth) / 2);
	var displayTop = Math.round((options.cnvsheight - options.mc - options.displayHeight) / 2);
	var srcHalfWidth = options.srcWidth / 2;
	var eyeSource = stereoGetEyeSource(options.imgType, options.swap, srcHalfWidth);
	var imageUrl = stereoEscapeAttr(options.imageUrl);
	var svg = '';
	layer.style.left = displayLeft + 'px';
	layer.style.top = displayTop + 'px';
	layer.style.width = options.displayWidth + 'px';
	layer.style.height = options.displayHeight + 'px';

	if (options.mode === 10 || options.mode === 11) {
		var horizontal = options.mode === 10;
		var stripeOffset = horizontal ? ((displayTop % 2) + 2) % 2 : ((displayLeft % 2) + 2) % 2;
		var patternTransform = horizontal ? 'translate(0,' + stripeOffset + ')' : 'translate(' + stripeOffset + ',0)';
		var aPattern = horizontal ? '<pattern id="maskPatternA" patternUnits="userSpaceOnUse" width="2" height="2" patternTransform="' + patternTransform + '"><rect x="0" y="0" width="2" height="1" fill="white" /></pattern>' : '<pattern id="maskPatternA" patternUnits="userSpaceOnUse" width="2" height="2" patternTransform="' + patternTransform + '"><rect x="0" y="0" width="1" height="2" fill="white" /></pattern>';
		var bPattern = horizontal ? '<pattern id="maskPatternB" patternUnits="userSpaceOnUse" width="2" height="2" patternTransform="' + patternTransform + '"><rect x="0" y="1" width="2" height="1" fill="white" /></pattern>' : '<pattern id="maskPatternB" patternUnits="userSpaceOnUse" width="2" height="2" patternTransform="' + patternTransform + '"><rect x="1" y="0" width="1" height="2" fill="white" /></pattern>';
		var userWidth = options.displayWidth;
		var userHeight = options.displayHeight;
		svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + options.displayWidth + '" height="' + options.displayHeight + '" viewBox="0 0 ' + options.displayWidth + ' ' + options.displayHeight + '" preserveAspectRatio="none">' +
			'<defs>' + aPattern + bPattern + '<mask id="maskA"><rect x="0" y="0" width="100%" height="100%" fill="url(#maskPatternA)" /></mask><mask id="maskB"><rect x="0" y="0" width="100%" height="100%" fill="url(#maskPatternB)" /></mask></defs>' +
			stereoBuildCroppedEyeSvg(imageUrl, eyeSource.leftX, srcHalfWidth, options.srcHeight, userWidth, userHeight, options.displayWidth, options.displayHeight, '', '', 'maskA') +
			stereoBuildCroppedEyeSvg(imageUrl, eyeSource.rightX, srcHalfWidth, options.srcHeight, userWidth, userHeight, options.displayWidth, options.displayHeight, '', '', 'maskB') +
			'</svg>';
	} else {
		var matrices = stereoGetSvgMatrices(options.mode, options.glasses);
		if (!matrices) {
			stereoClearImageLayer();
			return false;
		}
		svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + options.displayWidth + '" height="' + options.displayHeight + '" viewBox="0 0 ' + options.displayWidth + ' ' + options.displayHeight + '" preserveAspectRatio="none">' +
			'<defs><filter id="leftFilter"><feColorMatrix type="matrix" values="' + stereoBuildMatrix(matrices.left.r, matrices.left.g, matrices.left.b) + '" /></filter><filter id="rightFilter"><feColorMatrix type="matrix" values="' + stereoBuildMatrix(matrices.right.r, matrices.right.g, matrices.right.b) + '" /></filter></defs>' +
			stereoBuildCroppedEyeSvg(imageUrl, eyeSource.leftX, srcHalfWidth, options.srcHeight, options.displayWidth, options.displayHeight, options.displayWidth, options.displayHeight, '', 'leftFilter', '') +
			stereoBuildCroppedEyeSvg(imageUrl, eyeSource.rightX, srcHalfWidth, options.srcHeight, options.displayWidth, options.displayHeight, options.displayWidth, options.displayHeight, 'mix-blend-mode:plus-lighter', 'rightFilter', '') +
			'</svg>';
	}
	layer.innerHTML = svg;
	return true;
}

function stereoDrawImage() {
	var mc = stereoCaption ? 30 : 0;
	var imw = 0, imh = 0;
	var stereoMode_ = stereoMode;
	var stereoSwap_ = stereoSwap;
	var img = imageEls[imageN];
	var cnvs = document.getElementById('stereoCanvas');
	var ctx = cnvs.getContext('2d');
	var cnvsheight = document.getElementById('stereoViewer').clientHeight;
	var cnvswidth = document.getElementById('stereoViewer').clientWidth;
	var elmnt = document.getElementById('stereoCanvasdiv');
	elmnt.height = cnvsheight;
	elmnt.width = cnvswidth;
	elmnt = document.getElementById('stereoCanvas');
	elmnt.height = cnvsheight;
	elmnt.width = cnvswidth;

	function srcWidth() { return stereoImgWidth(img); }
	function srcHeight() { return stereoImgHeight(img); }

	function prepareWH2() {
		if (((cnvswidth - stereoNav * 2) / (cnvsheight - mc)) >= (srcWidth() / srcHeight() / 2)) {
			imh = cnvsheight - mc;
			imw = imh * (srcWidth() / srcHeight()) / 2;
		} else {
			imw = cnvswidth - stereoNav * 2;
			imh = imw * (srcHeight() / srcWidth()) * 2;
		}
		imw = Math.round(imw);
		imh = Math.round(imh);
	}

	function prepareWH2i() {
		if (((cnvswidth - stereoNav * 2) / (cnvsheight - mc)) >= (srcWidth() / srcHeight() / 2)) {
			imh = (cnvsheight - mc) / 2;
			imw = (cnvsheight - mc) * (srcWidth() / srcHeight()) / 2;
	    } else {
		    imw = cnvswidth - stereoNav * 2;
		    imh = imw * (srcHeight() / srcWidth());
	    }
		imw = Math.round(imw);
		imh = Math.round(imh);
	}

	function prepareWH2iv() {
		if (((cnvswidth - stereoNav * 2) / (cnvsheight - mc)) >= (srcWidth() / srcHeight() / 2)) {
			imh = cnvsheight - mc;
			imw = imh * (srcWidth() / srcHeight()) / 2;
		} else {
			imw = cnvswidth - stereoNav * 2;
			imh = imw * (srcHeight() / srcWidth()) * 2;
		}
		imw = Math.round(imw / 2);
		imh = Math.round(imh);
	}

	function prepareWH() {
		if (((cnvswidth - stereoNav * 2) / (cnvsheight - mc)) >= (srcWidth() / srcHeight())) {
			imh = cnvsheight - mc;
			imw = imh * (srcWidth() / srcHeight());
		} else {
			imw = cnvswidth - stereoNav * 2;
			imh = imw * (srcHeight() / srcWidth());
		}
		imw = Math.round(imw);
		imh = Math.round(imh);
	}

	function _getLines(phrase, maxPxLength) {
		var phraseArray = [];
		if (phrase != null) {
			var wa = phrase.split(' '), lastPhrase = '', measure = 0;
			for (var i = 0; i < wa.length; i++) {
				var w = wa[i];
				measure = ctx.measureText(lastPhrase + w).width;
				if (measure < maxPxLength)
					lastPhrase += (' ' + w);
				else {
					phraseArray.push(lastPhrase);
					lastPhrase = w;
				}
				if (i === wa.length - 1) {
					phraseArray.push(lastPhrase);
					break;
				}
			}
		}
		return phraseArray;
	}

	function _drawText(num) {
		if (stereoCaption) {
			ctx.font = 'bold 12px sans-serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			switch (stereoBGcolor) {
				case 0: ctx.fillStyle = 'rgba(128, 128, 128, 1)'; break;
				case 1: ctx.fillStyle = 'rgba(255, 255, 255, 1)'; break;
				default: ctx.fillStyle = 'rgba(128, 128, 128, 1)';
			}
			var h = ctx.measureText('Wg').width;
			if (num == 1) {
				var s = _getLines(imagesC[imageN], cnvswidth - 36);
				for (var i = 0; i < s.length; i++)
					ctx.fillText(s[i], cnvswidth / 2, cnvsheight / 2 + imh / 2 + i * h);
			} else {
				var s2 = _getLines(imagesC[imageN], imw / 2 - 36);
				for (var j = 0; j < s2.length; j++) {
					ctx.fillText(s2[j], (cnvswidth - imw) / 2 + imw / 4, cnvsheight / 2 + imh / 2 + j * h);
					ctx.fillText(s2[j], cnvswidth / 2 + imw / 4, cnvsheight / 2 + imh / 2 + j * h);
				}
			}
		}
	}

	switch (stereoBGcolor) {
		case 0: ctx.fillStyle = 'rgba(0, 0, 0, 1)'; break;
		case 1: ctx.fillStyle = 'rgba(128, 128, 128, 1)'; break;
		default: ctx.fillStyle = 'rgba(255, 255, 255, 1)';
	}
	document.getElementById('stereoViewer').style.backgroundColor = ctx.fillStyle;
	ctx.clearRect(0, 0, cnvswidth, cnvsheight);
	stereoClearImageLayer();

	if (images.length > 0) {
		switch (imagesT[imageN]) {
			case 'flat': case 'anaglyph': stereoMode_ = 0; stereoSwap_ = false; break;
			case 'stereoRL': case 'stereoLR': stereoMode_ = stereoMode; stereoSwap_ = stereoSwap; break;
		}
		if (!img) {
			img = new Image(); img.src = images[imageN];
		}
		if (stereoIE) {
			ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
			ctx.fillStyle = 'rgba(255,128,128,1)';
			ctx.fillText('Internet Explorer is not supported in this version', cnvswidth / 2, cnvsheight / 2);
			ctx.fillStyle = (stereoBGcolor == 1) ? 'rgba(255,255,255,1)' : 'rgba(128,128,128,1)';
			var hIE = ctx.measureText('Wg').width;
			ctx.fillText('Press Esc to close the slideshow', cnvswidth / 2, cnvsheight / 2 + hIE * 2);
			ctx.fillText('Please use Safari, Chrome, Firefox or Opera', cnvswidth / 2, cnvsheight / 2 + hIE * 3);
		} else if (!(img.complete && srcWidth() > 0 && srcHeight() > 0)) {
			img.onload = stereoDrawImage;
			ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
			ctx.fillStyle = (stereoBGcolor == 1) ? 'rgba(255,255,255,1)' : 'rgba(128,128,128,1)';
			ctx.fillText('Loading...', cnvswidth / 2, cnvsheight / 2);
		} else {
			switch (stereoMode_) {
				case 1: //RL
					stereoSwap_ = !stereoSwap_;
				case 0: //LR
					prepareWH();
					if (imagesT[imageN] == 'stereoLR')
						stereoSwap_ = !stereoSwap_;
					if (!stereoSwap_)
						ctx.drawImage(img, (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2, imw, imh);
					else {
						ctx.drawImage(img, 0, 0, srcWidth() / 2, srcHeight(), (cnvswidth - imw) / 2 + imw / 2, (cnvsheight - mc - imh) / 2, imw / 2, imh);
						ctx.drawImage(img, srcWidth() / 2, 0, srcWidth() / 2, srcHeight(), (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2, imw / 2, imh);
					}
					_drawText(((imagesT[imageN] == 'flat') || (imagesT[imageN] == 'anaglyph')) ? 1 : 2);
					break;
				case 3: //only Left
					prepareWH2();
					if (imagesT[imageN] == 'stereoLR')
						stereoSwap_ = !stereoSwap_;
					ctx.drawImage(img, !stereoSwap_ ? 0 : srcWidth() / 2, 0, srcWidth() / 2, srcHeight(), (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2, imw, imw * (srcHeight() / srcWidth() * 2));
					_drawText(1);
					break;
				case 2: //only Right
					prepareWH2();
					if (imagesT[imageN] == 'stereoLR')
						stereoSwap_ = !stereoSwap_;
					ctx.drawImage(img, !stereoSwap_ ? srcWidth() / 2 : 0, 0, srcWidth() / 2, srcHeight(), (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2, imw, imw * (srcHeight() / srcWidth() * 2));
					_drawText(1);
					break;
				case 4: case 5: case 6: case 7: case 8: case 9:
					// 4 color anaglyph
					// 5 optimized color anaglyph
					// 6 optimized+ color anaglyph
					// 7 gray anaglyph
					// 8 half color anaglyph
					// 9 true anaglyph
					prepareWH2();
					stereoRenderSvgFallback({ mode: stereoMode_, glasses: stereoGlasses, imageUrl: images[imageN], imgType: imagesT[imageN], swap: stereoSwap_, srcWidth: srcWidth(), srcHeight: srcHeight(), displayWidth: imw, displayHeight: imh, cnvswidth: cnvswidth, cnvsheight: cnvsheight, mc: mc });
					_drawText(1);
					break;
				case 10: //interlaced
					prepareWH2i();
					var displayHeight10 = imh * 2;
					var interlaceSwap10 = stereoSwap_;
					if (imagesT[imageN] == 'stereoLR')
						interlaceSwap10 = !interlaceSwap10;
					if (((cnvsheight - mc - displayHeight10) / 2) % 2 == 0)
						interlaceSwap10 = !interlaceSwap10;
					stereoRenderSvgFallback({ mode: stereoMode_, glasses: stereoGlasses, imageUrl: images[imageN], imgType: imagesT[imageN], swap: interlaceSwap10, srcWidth: srcWidth(), srcHeight: srcHeight(), displayWidth: imw, displayHeight: displayHeight10, cnvswidth: cnvswidth, cnvsheight: cnvsheight, mc: mc });
					fixInterlaceThickness();
					imh = displayHeight10;
					_drawText(1);
					break;
				case 11: //interlaced vertical
					prepareWH2iv();
					var displayWidth11 = imw * 2;
					var interlaceSwap11 = stereoSwap_;
					if (imagesT[imageN] == 'stereoLR')
						interlaceSwap11 = !interlaceSwap11;
					if (((cnvswidth - displayWidth11) / 2) % 2 == 0)
						interlaceSwap11 = !interlaceSwap11;
					stereoRenderSvgFallback({ mode: stereoMode_, glasses: stereoGlasses, imageUrl: images[imageN], imgType: imagesT[imageN], swap: interlaceSwap11, srcWidth: srcWidth(), srcHeight: srcHeight(), displayWidth: displayWidth11, displayHeight: imh, cnvswidth: cnvswidth, cnvsheight: cnvsheight, mc: mc });
					fixInterlaceThickness();
					imw = displayWidth11;
					_drawText(1);
					break;
			}
		}
	} else {
		ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
		ctx.fillStyle = (stereoBGcolor == 1) ? 'rgba(255,255,255,1)' : 'rgba(128,128,128,1)';
		ctx.fillText('No stereo images', cnvswidth / 2, cnvsheight / 2);
	}
	stereoDrawControls();
}

function fixInterlaceThickness() {
	if (stereoMode !== 10 && stereoMode !== 11)
		return;
	var layer = document.getElementById('stereoImageLayer');
	if (!layer)
		return;
	var root = layer.firstElementChild;
	if (!root || String(root.tagName).toLowerCase() !== 'svg')
		return;
	var displayWidth = parseFloat(root.getAttribute('width')) || 0;
	var displayHeight = parseFloat(root.getAttribute('height')) || 0;
	if (!(displayWidth > 0) || !(displayHeight > 0))
		return;
	for (var node = root.firstElementChild; node; node = node.nextElementSibling) {
		if (String(node.tagName).toLowerCase() !== 'svg')
			continue;
		node.setAttribute('viewBox', '0 0 ' + displayWidth + ' ' + displayHeight);
		var inner = node.firstElementChild;
		if (inner && String(inner.tagName).toLowerCase() === 'svg') {
			inner.setAttribute('width', displayWidth);
			inner.setAttribute('height', displayHeight);
		}
	}
}

function stereoCountImages() {
	function getClassName(obj, c) {
		if (obj.className) {
			var arrList = obj.className.split(" ");
			for (var i = 0; i < arrList.length; i++)
				for (var j = 0; j < c.length; j++)
					if (arrList[i] == c[j])
						return c[j];
		}
		return "";
	}
	var j, n = 0;
	imageEls = [];
	for (j = 0; j < document.images.length; j++) {
		var cn = getClassName(document.images[j], new Array("anaglyph", "flat", "stereo", "stereoLR", "stereoRL"));
		if (cn != "") {
			imageEls[n] = document.images[j];
			images[n] = document.images[j].src;
			imagesC[n] = document.images[j].getAttribute(stereoCaptionSrc);
			imagesT[n] = cn;
			if (imagesT[n] == "stereo")
				imagesT[n] = stereoDefType;
			n++;
		}
	}
	imageN = 0;
}

function stereoPrevImage() {
	if (imageN > 0)
		imageN--;
	else
		imageN = images.length - 1;
	if (imageN < 0)
		imageN = 0;
	stereoDrawImage();
}

function stereoNextImage() {
	if (imageN < images.length - 1)
		imageN++;
	else
		imageN = 0;
	stereoDrawImage();
}

function stereoModeChange() {
	var elmnt = document.getElementById("modeselect");
	for (var i = 0; i <= stereoModes; i++)
		if (elmnt.options[i].selected) {
			stereoMode = i;
			break;
		}
	stereoSwap = document.getElementById("stereoSwap").checked;
	stereoCaption = document.getElementById("stereoCap").checked;
	stereoCorrectAfterMode();
	stereoDrawImage();
}

function stereoGlassesChange() {
	var elmnt = document.getElementById("stereoGlasses");
	for (var i = 0; i < elmnt.options.length; i++)
		if (elmnt.options[i].selected) {
			stereoGlasses = i;
			break;
		}
	stereoDrawImage();
}

function stereoKeyPress(e) {
	var keynum;
	if (window.event)
		keynum = e.keyCode;
	else
		if (e.which)
			keynum = e.which;

	function _mode(value) {
		stereoMode = value;
		stereoDrawImage();
		var elmnt = document.getElementById("modeselect");
		for (var i = 0; i <= stereoModes; i++) elmnt.options[i].selected = stereoMode == i;
		stereoCorrectAfterMode();
	}

	switch (keynum) {
		case 27: stereoViewerClose(); break;
		case 83: document.getElementById("stereoSwap").checked = !stereoSwap; stereoModeChange(stereoMode); break;
		case 37: case 38: stereoPrevImage(); break;
		case 32: case 39: case 40: stereoNextImage(); break;
		case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: _mode(keynum - 48); break;
	}
}

function stereoBG(c) {
	stereoBGcolor = c;
	if (document.getElementById("stereoNav").checked & !stereoiOS)
		stereoNav = stereoNavDef
	else
		stereoNav = 0;
	stereoMouse = -1;
	
	stereoDrawImage();
	stereoDrawControls();
}

function stereoSaveDef() {
	if (stereoGetCookie() < 0)
		stereoSetCookie(stereoMode, stereoSwap ? 1 : 0, stereoGlasses)
	else
		stereoSetCookie(-1, stereoSwap ? 1 : 0, 0);
	stereoCheckCookie();
}

function stereoCheckCookie() {
	var sm = stereoGetCookie();
	if ((sm >= 0) && (sm <= stereoModes))
		document.getElementById("stereoSaveDef").value = "Forget Defaults"
	else
		document.getElementById("stereoSaveDef").value = "Save as Default";
	document.getElementById("stereoSwap").checked = stereoGetCookieSwap() > 0;
}

function stereoSetCookie(m, s, gm) {
	document.cookie = "HTML5_STEREO_VIEWER=" + escape(m.toString()) + "; path=/";
	document.cookie = "HTML5_STEREO_VIEWER_SWAP=" + escape(s.toString()) + "; path=/";
	document.cookie = "HTML5_STEREO_VIEWER_GLASSES=" + escape(gm.toString()) + "; path=/";
}

function stereoSetCookieForFirstTimeHelpDisplayed() {
	document.cookie = "HTML5_STEREO_VIEWER_FIRST_TIME_HELP_DISPLAYED=YES" + "; path=/";
}

function stereoGetCookieForFirstTimeHelpDisplayed() {
	stereoFirstTimeHelpDisplayed = true;
	var a = document.cookie.split(";");
	for (var i = 0; i < a.length; i++)
		if (a[i].substr(0, a[i].indexOf("=")).trim() == "HTML5_STEREO_VIEWER_FIRST_TIME_HELP_DISPLAYED") {
			stereoFirstTimeHelpDisplayed = (unescape(a[i].substr(a[i].indexOf("=") + 1)) != "YES");
			return stereoFirstTimeHelpDisplayed;
		}
	return stereoFirstTimeHelpDisplayed;
}

function stereoGetCookie() {
	var a = document.cookie.split(";");
	for (var i = 0; i < a.length; i++)
		if (a[i].substr(0, a[i].indexOf("=")).trim() == "HTML5_STEREO_VIEWER")
			return parseInt(unescape(a[i].substr(a[i].indexOf("=")+1)));
	return -1;
}

function stereoGetCookieSwap() {
	var a = document.cookie.split(";");
	for (var i = 0; i < a.length; i++)
		if (a[i].substr(0, a[i].indexOf("=")).trim() == "HTML5_STEREO_VIEWER_SWAP")
			return parseInt(unescape(a[i].substr(a[i].indexOf("=")+1)));
	return false;
}

function stereoGetCookieGlasses() {
	var a = document.cookie.split(";");
	for (var i = 0; i < a.length; i++)
		if (a[i].substr(0, a[i].indexOf("=")).trim() == "HTML5_STEREO_VIEWER_GLASSES")
			return parseInt(unescape(a[i].substr(a[i].indexOf("=")+1)));
	return false;
}

function stereoCorrectAfterMode() {
	if ((stereoMode <= (stereoModes - 2)) & (stereoMode >= 4)) document.getElementById("stereoGlasses").style.visibility = "inherit";
	else document.getElementById("stereoGlasses").style.visibility = "hidden";
}
