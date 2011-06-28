/*

HTML5 Stereo Viewer

version 1.0

Copyright (C) 2011 Yury Golubinsky

This work is licensed under the
Creative Commons Attribution 3.0 Unported License.
To view a copy of this license,
visit http://creativecommons.org/licenses/by/3.0/

*/

var stereover = "1.0";
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
var stereourl = "http://urixblog.com/html5-stereo-viewer";

function stereoViewerOpen(Mode, Swap, BGColor, Caption, CaptionSrc, Type) {
	/*
	Mode		- stereo mode (0..9). Default: 5
	Swap		- swap left and right sides (true, false). Default: false
	BGColor		- backgroung color (0,1,2) for Black, Gray and White. Default: 0
	Caption		- show captions (true, false). Default: true
	CaptionSrc	- caption text source name ("alt", "title"). Default: "alt"
	Type		- default stereo images type ("anaglyph", "flat", "stereoLR", "stereoRL", ""), for images with id="stereo". The value "" corresponds to "stereoRL"
	*/

	if (Caption != undefined)
		stereoCaption = Caption;
	if (CaptionSrc != "")
		stereoCaptionSrc = CaptionSrc;
	if (Type != "")
		stereoDefType = Type;
	if ((Mode != undefined) & (Mode >= 0) & (Mode <= 8))
		stereoMode = Mode;
	if (Swap != undefined)
		stereoSwap = Swap;

	stereoiOS = (navigator.appVersion.indexOf("iPhone") != -1) | (navigator.appVersion.indexOf("iPad") != -1) | (navigator.appVersion.indexOf("iPod") != -1);
	if (stereoiOS)
		stereoNav = 0;
		
	if (document.getElementById("stereoViewer")) {
		document.body.insertBefore(document.getElementById("stereoViewer"), document.body.firstChild);
		document.body.removeChild(document.getElementById("stereoViewer"));
	};

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
			<div id="stereoCanvasdiv" style="" onmouseover="stereoDrawControls(event)" onmousemove="stereoDrawControls(event);" onmouseout="stereoDrawControls(event);" onmouse="stereoDrawControls(event);" onclick="stereoMouseClick(event);" ondblclick="if (stereoiOS) stereoViewerOptionsOpen(!stereoOptVis);" >\
				<canvas id="stereoCanvas"></canvas>\
			</div>\
			<div id="stereoControls" style="z-index:2; position:fixed; background-color:#fff; opacity:.9; padding:16px; margin:0px; border:1px; border-style:solid; border-color:black; visibility:hidden; left:16px; top:16px;\
					-moz-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
					-webkit-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
					box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
					filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=3,MakeShadow=true,ShadowOpacity=0.30);\
					-ms-filter: "progid:DXImageTransform.Microsoft.Blur(PixelRadius=3,MakeShadow=true,ShadowOpacity=0.30)";">\
				<!--input type="button" value="Save As (FF only)" onclick="stereoSaveAs();" /><br /-->\
				<center>\
				<input type="button" value="Close Viewer" onclick="stereoViewerClose();" />\
				<input type="button" value="Help" onclick="stereoHelpOpen();" />\
				<input type="button" value="?" onclick="stereoAboutOpen();" /></center>\
				<hr /><br />\
				<b>Mode:</b><br /><br />\
				<input type="radio" id="mode0" name="mode" value="Right Left" onclick="stereoModeChange(0);" /> Right Left (0)<br />\
				<input type="radio" id="mode1" name="mode" value="Left Right" onclick="stereoModeChange(1);" /> Left Right (1)<br />\
				<input type="radio" id="mode2" name="mode" value="Left" onclick="stereoModeChange(2);" /> Left (2)<br />\
				<input type="radio" id="mode3" name="mode" value="Right" onclick="stereoModeChange(3);" /> Right (3)<br />\
				<input type="radio" id="mode4" name="mode" value="Color Anaglyph" onclick="stereoModeChange(4);" checked /> Color Anaglyph (4)<br />\
				<input type="radio" id="mode5" name="mode" value="Optimized Color Anaglyph 1" onclick="stereoModeChange(5);" /> Optimized Anaglyph 1 (5)<br />\
				<input type="radio" id="mode6" name="mode" value="Optimized Color Anaglyph 2" onclick="stereoModeChange(6);" /> Optimized Anaglyph 2 (6)<br />\
				<input type="radio" id="mode7" name="mode" value="Gray Anaglyph" onclick="stereoModeChange(7);" /> Gray Anaglyph (7)<br />\
				<input type="radio" id="mode8" name="mode" value="True Anaglyph" onclick="stereoModeChange(8);" /> True Anaglyph (8)<br />\
				<input type="radio" id="mode9" name="mode" value="Interlaced" onclick="stereoModeChange(9);" /> Interlaced (9)<br />\
				<br/>\
				<input type="checkbox" value="" onclick="stereoModeChange(stereoMode);" id="stereoSwap" /> Swap<br />\
				<br /><hr /><br />\
				<b>Background color:</b><br /><br />\
				<input type="button" value="White" onclick="stereoBG(2);" />\
				<input type="button" value="Gray" onclick="stereoBG(1);" />\
				<input type="button" value="Black" onclick="stereoBG(0);" /><br />\
				<br /><hr /><br />\
				<input type="checkbox" value="" onclick="stereoBG(stereoBGcolor);" id="stereoNav" style="visibility:hidden"/><!-- Navigation buttons<br /-->\
				<input type="checkbox" value="" onclick="stereoModeChange(stereoMode);" id="stereoCap" /> Show captions<br />\
			</div>\
			<div id="stereoHelp" style="z-index:3; position:fixed; background-color:#fff; opacity:.9; padding:16px; margin:0px; border:1px; border-style:solid; border-color:black; visibility:hidden; top:16px; right:16px;\
					-moz-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
					-webkit-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
					box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
					filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=3,MakeShadow=true,ShadowOpacity=0.30);\
					-ms-filter: "progid:DXImageTransform.Microsoft.Blur(PixelRadius=3,MakeShadow=true,ShadowOpacity=0.30)";">\
				Click <b>Right</b> / <b>Left</b> or <b>Center</b> parts of the image<br /> to view <b>Next</b> / <b>Previous</b> images or <b>Options</b>.<br /><br />\
				<center><b>Keyboard shortcuts:</b></center><br />\
				<center><table style="border:0"><tr><td><b>Esc&nbsp;&nbsp;</b></td><td> - &nbsp;&nbsp;close Stereo Viewer</tr>\
				<tr><td><b>Right Arrow&nbsp;&nbsp;</b></td><td> - &nbsp;&nbsp;next image</tr>\
				<tr><td><b>Left Arrow&nbsp;&nbsp;</b></td><td> - &nbsp;&nbsp;previous image</tr>\
				<tr><td><b>0..9&nbsp;&nbsp;</b></td><td> - &nbsp;&nbsp;change mode</tr>\
				</table></center>\
			</div>\
			<div id="stereoAbout" style="z-index:3; position:fixed; background-color:#fff; opacity:.9; padding:16px; margin:0px; border:1px; border-style:solid; border-color:black; visibility:hidden; top:16px; right:16px;\
					-moz-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
					-webkit-box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
					box-shadow: 1px 4px 10px rgba(68,68,68,0.6);\
					filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=3,MakeShadow=true,ShadowOpacity=0.30);\
					-ms-filter: "progid:DXImageTransform.Microsoft.Blur(PixelRadius=3,MakeShadow=true,ShadowOpacity=0.30)";">\
				<center><b>HTML5 Stereo Viewer</b><br />\
				version '+stereover+'<br /><br />\
				(C) 2011 Yury Golubinsky<br /><br />\
				<a href="'+stereourl+'">'+stereourl+'</a>\
				<br /><br /><hr /><br />\
				<a rel="license" href="http://creativecommons.org/licenses/by/3.0/" title="This work is licensed under a Creative Commons Attribution 3.0 Unported License"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/3.0/88x31.png" /></a>\
			</div>';
			
	document.body.insertBefore(div, document.body.firstChild);

	if (stereoiOS) {
		document.getElementById("stereoControls").innerHTML = '\
			<center><input type="button" value="Hide Options" onclick="stereoViewerOptionsOpen(false);" />\
			<input type="button" value="Close Viewer" onclick="stereoViewerClose();" /></center>\
			<hr />\
			<b>Mode:</b> \
			<select onchange="stereoModeChange(0);" id="modeselect">\
			<option>Right Left</option>\
			<option>Left Right</option>\
			<option>Left</option>\
			<option>Right</option>\
			<option>Color Anaglyph</option>\
			<option>Optimized Anaglyph 1</option>\
			<option>Optimized Anaglyph 2</option>\
			<option>Gray Anaglyph</option>\
			<option>True Anaglyph</option>\
			<option>Interlaced</option>\
			</select>\
			<br/>\
			<input type="checkbox" value="" onclick="stereoBG(stereoBGcolor);" id="stereoNav" style="visibility:hidden"/>\
			<input type="checkbox" value="" onclick="stereoModeChange(stereoMode);" id="stereoSwap" /> Swap\
			<br />\
			<b>Background color:</b><br />\
			<input type="button" value="White" onclick="stereoBG(2);" />\
			<input type="button" value="Gray" onclick="stereoBG(1);" />\
			<input type="button" value="Black" onclick="stereoBG(0);" /><br />\
			<br />\
			<input type="checkbox" value="" onclick="stereoModeChange(stereoMode);" id="stereoCap" /> Show captions<br />\
			<br />\
				<center><b>About: HTML5 Stereo Viewer '+stereover+'</b><br />\
				(C) 2011 Yury Golubinsky<br />\
				<a href="'+stereourl+'">'+stereourl+'</a>\
				<br /><br />\
				<a rel="license" href="http://creativecommons.org/licenses/by/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/3.0/88x31.png" /></a>\
			'
	};

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
	//document.getElementById("stereoViewer").style.visibility = "visible";

	document.getElementById("stereoNav").checked = stereoNav != 0;
	for (var i = 0; i <= 9; i++)
		if (stereoiOS)
			document.getElementById("modeselect").options[i].selected = stereoMode == i
		else
			document.getElementById("mode"+i).checked = stereoMode == i;
	document.getElementById("stereoSwap").checked = stereoSwap;
	document.getElementById("stereoCap").checked = stereoCaption;

	if (stereoiOS) {
		meta = document.createElement("meta");
		meta.name = "viewport";
		meta.content = "width = device-width, initial-scale = 1.0, user-scalable = no";
		var b = false;
		for (var i = 0; i < document.getElementsByTagName("head")[0].childNodes.length; i++)
			if (document.getElementsByTagName("head")[0].childNodes[i].name == "viewport") {
				document.getElementsByTagName("head")[0].replaceChild(meta, document.getElementsByTagName("head")[0].childNodes[i]);
				b = true;
				break;
			};
		if (!b)
			document.getElementsByTagName("head")[0].appendChild(meta);
	};

	stereoCountImages();
	stereoDrawImage();
};

function stereoViewerClose() {
	stereoViewerOptionsOpen(false);
	document.body.removeChild(document.getElementById("stereoViewer"));

	if (stereoiOS) {
		meta = document.createElement("meta");
		meta.name = "viewport";
		meta.content = "width = device-width, initial-scale = 1.0, user-scalable = yes";
		for (var i = 0; i < document.getElementsByTagName("head")[0].childNodes.length; i++)
			if (document.getElementsByTagName("head")[0].childNodes[i].name == "viewport") {
				document.getElementsByTagName("head")[0].replaceChild(meta, document.getElementsByTagName("head")[0].childNodes[i]);
				break;
			}
	};
};

function setPixel(imageData, x, y, r, g, b, a) {
	index = (x + y * imageData.width) * 4;
	imageData.data[index+0] = r;
	imageData.data[index+1] = g;
	imageData.data[index+2] = b;
	imageData.data[index+3] = a;
};

function getR(imageData, x, y) {
	index = (x + y * imageData.width) * 4;
	return imageData.data[index+0];
};

function getG(imageData, x, y) {
	index = (x + y * imageData.width) * 4;
	return imageData.data[index+1];
};

function getB(imageData, x, y) {
	index = (x + y * imageData.width) * 4;
	return imageData.data[index+2];
};

function stereoMouseClick(event) {
	
	var mx = 0;
	var my = 0;
	
	if (!event) var event = window.event;
	if (event.pageX || event.pageY)	{
		mx = event.pageX;
		my = event.pageY;
	}
	else if (event.clientX || event.clientY) {
		mx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		my = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	};
	
	var b = false;
	var cnvs = document.getElementById('stereoCanvas');
	//if (stereoiOS) {
		if (mx < cnvs.width / 3) {  //left
			stereoPrevImage();
			b = true;
		}
		else
		if (mx >= 2 * cnvs.width / 3) {	 //right
			stereoNextImage();
			b = true;
		};
	/*}
	/*else //buttons
		if (stereoNav > 0) {
			if ((mx >= 0) && (mx < stereoNav) && (my >= 0) && (my < cnvs.height)) {  //left
				stereoPrevImage();
				b = true;
			}
			else
			if ((mx >= cnvs.width - stereoNav) && (mx < cnvs.width) && (my >= 0) && (my < cnvs.height)) {	 //right
				stereoNextImage();
				b = true;
			}
		};*/
	if (!b) {	//center
		stereoViewerOptionsOpen(!stereoOptVis);
	}
};

function stereoViewerOptionsOpen(value) {
	if (value)
		var s = "visible"
	else
		var s = "hidden";
	document.getElementById("stereoControls").style.visibility = s;
	if (!value) {
		document.getElementById("stereoHelp").style.visibility = s;
		document.getElementById("stereoAbout").style.visibility = s
	};
	stereoOptVis = value
};

function stereoHelpOpen(value) {
	if (document.getElementById("stereoHelp").style.visibility == "hidden")
		var s = "visible"
	else
		var s = "hidden";
	document.getElementById("stereoHelp").style.visibility = s;
	document.getElementById("stereoAbout").style.visibility = "hidden";
};

function stereoAboutOpen(value) {
	if (document.getElementById("stereoAbout").style.visibility == "hidden")
		var s = "visible"
	else
		var s = "hidden";
	document.getElementById("stereoAbout").style.visibility = s;
	document.getElementById("stereoHelp").style.visibility = "hidden";
};

function stereoDrawControls(event) {
	
	var mx = 0;
	var my = 0;
	
	if (!event) var event = window.event;
	if (event.pageX || event.pageY)	{
		mx = event.pageX;
		my = event.pageY;
	}
	else if (event.clientX || event.clientY) {
		mx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		my = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	};
	
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
	};
	
	if (stereoNav > 0) {
		var cnvs = document.getElementById('stereoCanvas');
		var ctx = cnvs.getContext('2d');

		switch (stereoBGcolor) {
			case 0:
				var color1 = "rgba(60, 60, 60, 1.0)";
				var color2 = "rgba(30, 30, 30, 1.0)";
				var color11 = "rgba(30, 30, 30, 1.0)";
				var color22 = "rgba(0, 0, 0, 1.0)";
				break;
			case 1:
				var color1 = "rgba(190, 190, 190, 1.0)";
				var color2 = "rgba(160, 160, 160, 1.0)";
				var color11 = "rgba(160, 160, 160, 1.0)";
				var color22 = "rgba(130, 130, 130, 1.0)";
				break;
			case 2:
				var color1 = "rgba(240, 240, 240, 1.0)";
				var color2 = "rgba(220, 220, 220, 1.0)";
				var color11 = "rgba(255, 255, 255, 1.0)";
				var color22 = "rgba(240, 240, 240, 1.0)";
		};

		if ((mx >= 0) && (mx < stereoNav) && (my >= 0) && (my < cnvs.height)) {  //left
			if (stereoMouse != 0) {
				_draw(color1, color2, color11, color22);
				stereoMouse = 0;
			}
		}
		else
		if ((mx >= cnvs.width - stereoNav) && (mx < cnvs.width) && (my >= 0) && (my < cnvs.height)) {	 //right
			if (stereoMouse != 2) {
				_draw(color2, color1, color22, color11);
				stereoMouse = 2;
			}
		}
		else 
		if (stereoMouse != 1) {
			_draw(color2, color2, color22, color22);
			stereoMouse = 1;
		}
	}
};

function stereoDrawImage() {

	if (stereoCaption) // caption height
		var mc = 30
	else
		var mc = 0;
	
	var imw = 0;
	var imh = 0;
	
	var stereoMode_ = stereoMode;
	var stereoSwap_ = stereoSwap;
	
	function prepareWH2() {
		if (((cnvswidth - stereoNav * 2) / (cnvsheight - mc)) >= (img.width / img.height / 2)) {
			imh = cnvsheight - mc;
			imw = imh * (img.width / img.height) / 2;
		}
		else {
			imw = cnvswidth - stereoNav * 2;
			imh = imw * (img.height / img.width) * 2;
		};
		imw = Math.round(imw);
		imh = Math.round(imh);
	};

	function prepareWH2i() {
		if (((cnvswidth - stereoNav * 2) / (cnvsheight - mc)) >= (img.width / img.height / 2)) {
			imh = (cnvsheight - mc) / 2;
			imw = (cnvsheight - mc) * (img.width / img.height) / 2;
		}
		else {
			imw = cnvswidth - stereoNav * 2;
			imh = imw * (img.height / img.width);
		};
		imw = Math.round(imw);
		imh = Math.round(imh);
	};

	function prepareWH() {
		if (((cnvswidth - stereoNav * 2) / (cnvsheight - mc)) >= (img.width / img.height)) {
			imh = cnvsheight - mc;
			imw = imh * (img.width / img.height);
		}
		else {
			imw = cnvswidth - stereoNav * 2;
			imh = imw * (img.height / img.width);
		};
		imw = Math.round(imw);
		imh = Math.round(imh);
	};

	var cnvs = document.getElementById('stereoCanvas');
	var ctx = cnvs.getContext('2d');

	var cnvsheight = document.getElementById("stereoViewer").clientHeight;//cnvs.height;
	var cnvswidth = document.getElementById("stereoViewer").clientWidth;//cnvs.height;
	document.getElementById("stereoCanvasdiv").height = cnvsheight;
	document.getElementById("stereoCanvasdiv").width = cnvswidth;
	document.getElementById("stereoCanvas").height = cnvsheight;
	document.getElementById("stereoCanvas").width = cnvswidth;
	
	///////////////////////////////////
	img = new Image();
	img.src = images[imageN];
	
	switch (stereoBGcolor) {
		case 0:
			ctx.fillStyle = "rgba(0, 0, 0, 1)";
			break;
		case 1:
			ctx.fillStyle = "rgba(128, 128, 128, 1)";
			break;
		case 2:
			ctx.fillStyle = "rgba(255, 255, 255, 1)";
	};
	ctx.fillRect(stereoNav, 0, cnvswidth - stereoNav * 2, cnvsheight);
	document.getElementById("stereoViewer").style.backgroundColor = ctx.fillStyle;
		
	if (images.length > 0) {
		var buf, bufctx, iData1, iData2;
		var r = new Number, g = new Number, b = new Number;
		
		function prepareAnaglyphData(inter) {
			buf = document.createElement('canvas');
			buf.width = imw * 2;
			buf.height = imh;
			bufctx = buf.getContext('2d');
			bufctx.drawImage(img, 0, 0, imw * 2, imh);

			if (!inter)
				imageData = ctx.createImageData(imw, imh)
			else
				imageData = ctx.createImageData(imw, imh * 2);
			
			if (imagesT[imageN] == "stereoLR")
				stereoSwap_ = !stereoSwap_;
			if (!stereoSwap_) {
				iData1 = bufctx.getImageData(0, 0, imw, imh);
				iData2 = bufctx.getImageData(imw, 0, imw, imh)
			}
			else {
				iData2 = bufctx.getImageData(0, 0, imw, imh);
				iData1 = bufctx.getImageData(imw, 0, imw, imh)
			}
		};
		
		function _getLines(phrase, maxPxLength) {
		    var wa = phrase.split(" ");
			var phraseArray = [];
			var lastPhrase = "";
			var l = maxPxLength;
			var measure = 0;
		    for (var i=0; i < wa.length; i++) {
		        var w = wa[i];
		        measure = ctx.measureText(lastPhrase + w).width;
		        if (measure < l)
		            lastPhrase += (" "+w)
		        else {
		            phraseArray.push(lastPhrase);
		            lastPhrase = w;
		        };
		        if (i === wa.length - 1) {
		            phraseArray.push(lastPhrase);
		            break;
		        }
		    };
		    return phraseArray;
		};

		function _drawText(num) {
			
			if (stereoCaption) {
				ctx.font = "bold 12px sans-serif";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				switch (stereoBGcolor) {
					case 0:
						ctx.fillStyle = "rgba(128, 128, 128, 1)";
						break;
					case 1:
						ctx.fillStyle = "rgba(255, 255, 255, 1)";
						break;
					case 2:
						ctx.fillStyle = "rgba(128, 128, 128, 1)";
				};
				if (num == 1) {
					var s = _getLines(imagesC[imageN], cnvswidth - 36);
					for (var i = 0; i < s.length; i++)
						ctx.fillText(s[i], cnvswidth / 2, cnvsheight / 2 + imh / 2 + i * 14)
				} else {
					var s = _getLines(imagesC[imageN], imw / 2 - 36);
					for (var i = 0; i < s.length; i++) {
						var e = ctx.measureText(s[i]).height;
						ctx.fillText(s[i], (cnvswidth - imw) / 2 + imw / 4, cnvsheight / 2 + imh / 2 + i * 14);
						ctx.fillText(s[i], cnvswidth / 2 + imw / 4, cnvsheight / 2 + imh / 2 + i * 14)
					}
				}
			}
		};
		
		switch (imagesT[imageN]) {
			case "flat":
			case "anaglyph":
				stereoMode_ = 0;
				stereoSwap_ = false;
				break;
			case "stereoRL":
			case "stereoLR":
				stereoMode_ = stereoMode;
				stereoSwap_ = stereoSwap;
				break;
		};

		if (!img.complete) {
			img.onLoad = stereoDrawImage;
			ctx.font = "bold 12px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			switch (stereoBGcolor) {
				case 0:
					ctx.fillStyle = "rgba(128, 128, 128, 1)";
					break;
				case 1:
					ctx.fillStyle = "rgba(255, 255, 255, 1)";
					break;
				case 2:
					ctx.fillStyle = "rgba(128, 128, 128, 1)";
			};
			ctx.fillText("Loading...", cnvswidth / 2, cnvsheight / 2)
		}
		else
			switch (stereoMode_) {
			
				case 1: //RL
					stereoSwap_ = !stereoSwap_;
				case 0: //LR
					prepareWH();
					if (imagesT[imageN] == "stereoLR")
						stereoSwap_ = !stereoSwap_;
					if (!stereoSwap_)
						ctx.drawImage(img, (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2, imw, imh)
					else {
						ctx.drawImage(img, 0, 0, img.width / 2, img.height,
											(cnvswidth - imw) / 2 + imw / 2, (cnvsheight - mc - imh) / 2, imw / 2, imh);
						ctx.drawImage(img, img.width / 2, 0, img.width / 2, img.height,
											(cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2, imw / 2, imh)
					};
					if ((imagesT[imageN] == "flat") | (imagesT[imageN] == "anaglyph"))
						_drawText(1)
					else
						_drawText(2);
					break;
					
				case 2: //only Left
					prepareWH2();
					if (imagesT[imageN] == "stereoLR")
						stereoSwap_ = !stereoSwap_;
					if (!stereoSwap_)
						ctx.drawImage(img, 0, 0, img.width / 2, img.height,
											(cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2, imw, imw * (img.height / img.width * 2))
					else
						ctx.drawImage(img, img.width / 2, 0, img.width / 2, img.height,
											(cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2, imw, imw * (img.height / img.width * 2));
					_drawText(1);
					break;
					
				case 3: //only Right
					prepareWH2();
					if (imagesT[imageN] == "stereoLR")
						stereoSwap_ = !stereoSwap_;
					if (!stereoSwap_)
						ctx.drawImage(img, img.width / 2, 0, img.width / 2, img.height,
											(cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2, imw, imw * (img.height / img.width * 2))
					else
						ctx.drawImage(img, 0, 0, img.width / 2, img.height,
											(cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2, imw, imw * (img.height / img.width * 2));
					_drawText(1);
					break;
					
				case 4: //color anaglyph
					prepareWH2();
					prepareAnaglyphData(false);
					
					for (x = 1; x < imw - 1; x++) {
						for (y = 0; y < imh; y++) {
							   index = (x + y * imageData.width) * 4;
							r = iData2.data[index+0];
							g = iData1.data[index+1];
							b = iData1.data[index+2];
							setPixel(imageData, x, y, r, g, b, 0xFF);
						}
					};
					
					ctx.putImageData(imageData, (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2);
					_drawText(1);
					break;
					
				/*case 5: //half color anaglyph
					prepareWH2();
					prepareAnaglyphData();
					
					for (x = 0; x < imw; x++) {
						for (y = 0; y < imh; y++) {
							   index = (x + y * imageData.width) * 4;
							// Data2 - left; Data1 - right
							r = iData2.data[index+0] * 0.299 + iData2.data[index+1] * 0.587 + iData2.data[index+2] * 0.114;
							g = iData1.data[index+1];
							b = iData1.data[index+2];
							r = Math.min(Math.max(r, 0), 255);
							setPixel(imageData, x, y, r, g, b, 0xFF);
						}
					}
				
					ctx.putImageData(imageData, (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2);
					_drawText(1);
					break;*/
					
				case 5: //optimized color anaglyph
					prepareWH2();
					prepareAnaglyphData(false);
					
					for (x = 1; x < imw - 1; x++) {
						for (y = 0; y < imh; y++) {
							   index = (x + y * iData2.width) * 4;
							// Data2 - left; Data1 - right
							r = iData2.data[index+1] * 0.7 + iData2.data[index+2] * 0.3;
							g = iData1.data[index+1];
							b = iData1.data[index+2];
							r = Math.min(Math.max(r, 0), 255);
							setPixel(imageData, x, y, r, g, b, 0xFF);
						}
					}
				
					ctx.putImageData(imageData, (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2);
					_drawText(1);
					break;
					
				case 6: //optimized+ color anaglyph
					prepareWH2();
					prepareAnaglyphData(false);
					
					for (x = 1; x < imw - 1; x++) {
						for (y = 0; y < imh; y++) {
							   index = (x + y * imageData.width) * 4;
							// Data2 - left; Data1 - right
							g = iData2.data[index+1] + 0.45 * Math.max(0, iData2.data[index+0] - iData2.data[index+1]);
							b = iData2.data[index+2] + 0.25 * Math.max(0, iData2.data[index+0] - iData2.data[index+2]);
							r = g * 0.749 + b * 0.251;
							//r = Math.pow(g * 0.749 + b * 0.251, 1/1.6);
							g = iData1.data[index+1] + 0.45 * Math.max(0, iData1.data[index+0] - iData1.data[index+1]);
							b = iData1.data[index+2] + 0.25 * Math.max(0, iData1.data[index+0] - iData1.data[index+2]);
							r = Math.min(Math.max(r, 0), 255);
							g = Math.min(Math.max(g, 0), 255);
							b = Math.min(Math.max(b, 0), 255);
							setPixel(imageData, x, y, r, g, b, 0xFF);
						}
					}
				
					ctx.putImageData(imageData, (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2);
					_drawText(1);
					break;
					
				case 7: //gray anaglyph
					prepareWH2();
					prepareAnaglyphData(false);
					
					for (x = 1; x < imw - 1; x++) {
						for (y = 0; y < imh; y++) {
							   index = (x + y * imageData.width) * 4;
							// Data2 - left; Data1 - right
							r = iData2.data[index+0] * 0.299 + iData2.data[index+1] * 0.587 + iData2.data[index+2] * 0.114;
							g = iData1.data[index+0] * 0.299 + iData1.data[index+1] * 0.587 + iData1.data[index+2] * 0.114;
							b = iData1.data[index+0] * 0.299 + iData1.data[index+1] * 0.587 + iData1.data[index+2] * 0.114;
							r = Math.min(Math.max(r, 0), 255);
							g = Math.min(Math.max(g, 0), 255);
							b = Math.min(Math.max(b, 0), 255);
							setPixel(imageData, x, y, r, g, b, 0xFF);
						}
					}
				
					ctx.putImageData(imageData, (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2);
					_drawText(1);
					break;
					
				case 8: //true anaglyph
					prepareWH2();
					prepareAnaglyphData(false);
					
					for (x = 1; x < imw - 1; x++) {
						for (y = 0; y < imh; y++) {
							   index = (x + y * imageData.width) * 4;
							// Data2 - left; Data1 - right
							r = iData2.data[index+0] * 0.299 + iData2.data[index+1] * 0.587 + iData2.data[index+2] * 0.114;
							g = 0;
							b = iData1.data[index+0] * 0.299 + iData1.data[index+1] * 0.587 + iData1.data[index+2] * 0.114;
							r = Math.min(Math.max(r, 0), 255);
							b = Math.min(Math.max(b, 0), 255);
							setPixel(imageData, x, y, r, g, b, 0xFF);
						}
					}
				
					ctx.putImageData(imageData, (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2);
					_drawText(1);
					break;
					
				case 9: //interlaced
					prepareWH2i();
					prepareAnaglyphData(true);
					for (y = 0; y < imh; y++)
						for (x = 1; x < imw - 1; x++) {
							// Data2 - left; Data1 - right
							index = (x + y * imageData.width) * 4;
							setPixel(imageData, x, y * 2, iData1.data[index+0], iData1.data[index+1], iData1.data[index+2], 0xFF);
							index = (x + y * imageData.width) * 4;
							setPixel(imageData, x, y * 2 + 1, iData2.data[index+0], iData2.data[index+1], iData2.data[index+2], 0xFF);
						};
				
					imh = imh * 2;
					ctx.putImageData(imageData, (cnvswidth - imw) / 2, (cnvsheight - mc - imh) / 2);
					_drawText(1);
					break;
					
			} //switch
			
	} else {
		ctx.font = "bold 12px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		switch (stereoBGcolor) {
			case 0:
				ctx.fillStyle = "rgba(128, 128, 128, 1)";
				break;
			case 1:
				ctx.fillStyle = "rgba(255, 255, 255, 1)";
				break;
			case 2:
				ctx.fillStyle = "rgba(128, 128, 128, 1)";
		};
		ctx.fillText("No stereo images", cnvswidth / 2, cnvsheight / 2)
	};
	///////////////////////////////////
	stereoDrawControls();
};

function stereoCountImages() {
	function getClassName(obj, c) {
		if (obj.className) {
			var arrList = obj.className.split(" ");
			for (var i = 0; i < arrList.length; i++) {
				for (var j = 0; j < c.length; j++)
					if (arrList[i] == c[j])
						return c[j];
			}
		}
		return "";
	};

	var j, n = 0;
	for (j = 0; j < document.images.length; j++) {
		var cn = getClassName(document.images[j], new Array("anaglyph", "flat", "stereo", "stereoLR", "stereoRL"));
		if (cn != "") {
			images[n] = document.images[j].src;
			imagesC[n] = document.images[j].getAttribute(stereoCaptionSrc);
			imagesT[n] = cn;
			if (imagesT[n] == "stereo")
				imagesT[n] = stereoDefType;
			if (n == 0) {
				var img = new Image;
				img.src = images[n];
				img.onload = stereoDrawImage;
			};
			n++;
		}
	};
	imagesN = 0;
};

function stereoPrevImage() {
	if (imageN > 0) imageN--
	else imageN = images.length - 1;
	if (imageN < 0) imageN = 0;
	stereoDrawImage()
};

function stereoNextImage() {
	if (imageN < images.length - 1)	imageN++
	else imageN = 0;
	stereoDrawImage()
};

function stereoModeChange(value) {
	if (stereoiOS) {
		for (var i = 0; i <= 9; i++)
			if (document.getElementById("modeselect").options[i].selected) {
				stereoMode = i;
				break;
			}
	}
	else
		stereoMode = value;
	stereoSwap = document.getElementById("stereoSwap").checked;
	stereoCaption = document.getElementById("stereoCap").checked;
	stereoDrawImage()
};

function stereoKeyPress(e) {
	var keynum; 
	
	if (window.event) // IE
		keynum = e.keyCode
	else if (e.which) // Netscape/Firefox/Opera
		keynum = e.which;

	//alert(keynum);
	
	function _mode(value) {
		stereoMode = value;
		stereoDrawImage();
		for (var i = 0; i <= 9; i++)
			if (stereoiOS)
				document.getElementById("modeselect").options[i].selected = stereoMode == i
			else
				document.getElementById("mode"+i).checked = stereoMode == i;
	};
	
	switch (keynum) {
		// Controls
		case 16:
		case 191:
			stereoViewerHelpOpen();
			break; 
		case 27:
			stereoViewerClose();
			break; 
		// Navigation
		case 37: 
		case 38: 
			stereoPrevImage();
			break;
		case 32: 
		case 39: 
		case 40: 
			stereoNextImage();
			break;
		// stereo Mode
		case 48:
		case 49:
		case 50:
		case 51:
		case 52:
		case 53:
		case 54:
		case 55:
		case 56:
		case 57:
			_mode(keynum - 48);
			break;
	}
};

function stereoSaveAs() {
	var canvas = document.getElementById("canvas");
	var f = canvas.mozGetAsFile("stereo.png");
	 
	var newImg = document.createElement("img");
	newImg.src = f.toDataURL();
	document.body.appendChild(newImg);
};

function stereoBG(c) {
	stereoBGcolor = c;
	if (document.getElementById("stereoNav").checked & !stereoiOS)
		stereoNav = stereoNavDef
	else
		stereoNav = 0;
	stereoMouse = -1;
	
	stereoDrawImage();
	stereoDrawControls()
};