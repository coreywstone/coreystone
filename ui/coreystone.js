function newImage(arg) {
if (document.images) {
	rslt = new Image();
	rslt.src = arg;
	return rslt; 
	}
}

function changeImages() {
if (document.images && (preloadFlag == true)) {
	for (var i=0; i<changeImages.arguments.length; i+=2) {
		document[changeImages.arguments[i]].src = changeImages.arguments[i+1];
		}
	}
}

var preloadFlag = false;
function preloadImages() {
	if (document.images) {
		home_off_over = newImage("navpics/home_off-over.gif");
		work_off_over = newImage("navpics/work_off-over.gif");
		baby_off_over = newImage("navpics/baby_off-over.gif");
		nursery_off_over = newImage("navpics/nursery_off-over.gif");
		preloadFlag = true; 
	}
}

function popup(url, name, width, height, scrollbars) { 
	var popwin; 
	var opts =  "toolbar=no,status=no,location=no,menubar=no,resizable=yes"; 
	opts += ",width=" + width + ",height=" + height + ",scrollbars=" + scrollbars; 
	popwin = window.open(url, name, opts); 
	popwin.focus();
	return false; 
}