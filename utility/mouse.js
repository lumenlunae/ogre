// AkiMouse, by Darius Kazemi
// Oct 07, 2010
// http://bostongamejams.com/akimouses

var mouse;

function addMouseControl() {
	mouse = gbox.addObject({
		id: 'mouse_id',
		group: 'mouse',
		upCount: 0,
		
		initialize: function() {
			mouse.x = 0;
			mouse.y = 0;
			mouse.isDown = false;
			mouse.isDragging = false;
			mouse.isClicked = false;
			mouse.dragObject = null;
			mouse.offsetx = 0;
			mouse.offsety = 0;
			
			if (help.getDeviceConfig().touch) {
				mouse.w = cursor.w;
				mouse.h = cursor.h;
				mouse.hw = cursor.hw;
				mouse.hh = cursor.hh;
				mouse.offsetx = 16;
				mouse.offsety = 16;
			} else {
				mouse.w = 2;
				mouse.h = 2;
				mouse.hw = 1;
				mouse.hh = 1;
			}
			document.getElementsByTagName("CANVAS")[0].addEventListener('mousemove', mouse.move, false);
			document.getElementsByTagName("CANVAS")[0].addEventListener('mousedown', mouse.down, false);
			document.getElementsByTagName("CANVAS")[0].addEventListener('mouseup', mouse.up, false);
			document.getElementsByTagName("CANVAS")[0].addEventListener('touchmove', mouse.touchmove, false);
			document.getElementsByTagName("CANVAS")[0].addEventListener('touchstart', mouse.touchdown, false);
			document.getElementsByTagName("CANVAS")[0].addEventListener('touchend', mouse.touchup, false);
		},
		
		blit: function() {
			if (this.upCount > 0) {mouse.isClicked = false; this.upCount = 0;}
			if (mouse.isClicked) this.upCount += 1;
		},
		getX: function() {
			return mouse.x + mouse.offsetx;
		},
		getY: function() {
			return mouse.y + mouse.offsety;
		},
		touchmove: function(event) {
			var touch = event.touches[0];
			var cam = gbox.getCamera();
			
			mouse.x = cursor.x = touch.pageX/gbox._zoom + cam.x - cursor.w - mouse.offsetx;
			mouse.y = cursor.y = touch.pageY/gbox._zoom + cam.y - cursor.h - mouse.offsety;
		},
		move: function(event) {
			var tempCanvas = document.getElementsByTagName("CANVAS")[0];
			var cam = gbox.getCamera();
			
			mouse.x = (event.layerX - tempCanvas.offsetLeft)/gbox._zoom + cam.x;
			mouse.y = (event.layerY - tempCanvas.offsetTop)/gbox._zoom + cam.y;
		},
		touchdown: function(event) {
			event.preventDefault();
			var touch = event.touches[0];
			var cam = gbox.getCamera();
			mouse.x = cursor.x = touch.pageX/gbox._zoom + cam.x - cursor.w - mouse.offsetx;
			mouse.y = cursor.y = touch.pageY/gbox._zoom + cam.y - cursor.h - mouse.offsety;
			mouse.down();
		},
		down: function(event) {
			mouse.isDown = true;
		},
		touchup: function(event) {
			event.preventDefault();
			mouse.up(event);
			
			
		},
		up: function(event) {
			
			mouse.isDown = false;
			mouse.isDragging = false;
			mouse.dragObject = null;
			mouse.isClicked = true;
			
			if (!toys.topview.callInColliding(mouse, {x: mouse.x + mouse.hw, y: mouse.y + mouse.hh, group: "moving_objects", call: "touchAction" })) {
				var cam = gbox.getCamera();
				console.log(mouse.x, mouse.y, cam.x, cam.y);
				toys.topview.callInColliding(mouse, {x: mouse.x + mouse.hw, y: mouse.y + mouse.hh, group: "mouse", call: "touchAction" });
			}
		},
		
		isColliding: function(obj) {
			return gbox.pixelcollides(mouse, obj);
		},
		
		dragCheck: function(obj) {
		  if (mouse.isDown == true && gbox.pixelcollides(mouse,obj) && mouse.isDragging == false)
			{
			mouse.isDragging = true;
			mouse.dragObject = obj;
			}
		  if (mouse.isDragging && mouse.dragObject.id == obj.id && mouse.dragObject.group == obj.group) 
			{
			obj.x = mouse.x-obj.hh;
			obj.y = mouse.y-obj.hw;
			}
		}
	}); // end gbox.addObject for mouseControl
}