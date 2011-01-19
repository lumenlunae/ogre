var cursor; 
function addPlayer(x, y) {
    var td = gbox.getTiles(tilemaps.map1.tileset);
	var tileset = "cursor";
	if (help.getDeviceConfig().touch) {
		tileset = "cursor_touch";
	}
    cursor = gbox.addObject({
        id: 'player',
        group: 'player',
        tileset: tileset,
        zindex: 0,
        stilltimer: 0,
        invultimer: 0,
        isPaused: false,
        flipside: false,
		camspeed: 6,
        nodiagonals: false,
        initialize: function () {
            toys.topview.initialize(this, {});
            this.x = x * td.tilew;
            this.y = y * td.tileh;

            this.frames = [0];
			createPlayerMenu();
        },
        first: function () {
            if (this.stilltimer || maingame.gameIsHold() || this.isPaused || this.killed)
                toys.topview.controlKeys(this, {});
            else if (this.onPlayerMenu) {
				
			} else { 
                if (gbox.keyIsPressed("left")) {
					gbox.setCameraX(gbox.getCamera().x - this.camspeed, tilemaps.map1);
					
				} else if (gbox.keyIsPressed("right")) {
					gbox.setCameraX(gbox.getCamera().x + this.camspeed, tilemaps.map1);
				}
				
				if (gbox.keyIsPressed("up")) {
					gbox.setCameraY(gbox.getCamera().y - this.camspeed, tilemaps.map1);
				} else if (gbox.keyIsPressed("down")) {
					gbox.setCameraY(gbox.getCamera().y + this.camspeed, tilemaps.map1);
				}
			}
	
            if (!this.stilltimer && !this.isPaused && !maingame.gameIsHold()) {
                if (gbox.keyIsHit("a")) {
                 
                } else if (gbox.keyIsHit("b")) {
                     if (this.onPlayerMenu) { 
						hidePlayerMenu();
					 }
				} else if (gbox.keyIsHit("c")) {
					
				}

            }
			if (mouse.isClicked && cursor.onPlayerWalk) {
				console.log(mouse.getX(), mouse.getY());
				cursor.onPlayerWalk = false;
				cursor.onObj.walkAction({x: Math.floor(mouse.getX()-cursor.onObj.hw), y: Math.floor(mouse.getY()-cursor.onObj.hh)});
				cursor.onObj = null;
			}
        },
        blit: function () {
            if (true) {
                gbox.blitTile(gbox.getBufferContext(), {
                    tileset: this.tileset,
                    tile: this.frame,
                    dx: this.x,
                    dy: this.y,
                    fliph: this.fliph,
                    flipv: this.flipv,
                    camera: this.camera,
                    alpha: 1.0
                });
            }
        },
        doPause: function (p) {
            this.isPaused = p;
        }
    });
}

function createPlayerMenuItem(data) {
	gbox.addObject({
        id: data.id,
        group: 'mouse',
        tileset: 'menu',
        frame: data.frame,
		dx: data.dx,
		dy: data.dy,
		x: data.dx, 
		y: data.dy,
		jump: true,
		colx: 6, coly: 6, colw: 20, colh: 20,
		isActive: function() {
			return cursor.onPlayerMenu;
		},
        initialize: function () {
            toys.topview.initialize(this, {});
        },
        first: function () {
			var cam = gbox.getCamera();
			this.x = this.dx + cam.x;
			this.y = this.dy + cam.y;
        },
        blit: function () {
			if (cursor.onPlayerMenu) {
				
				gbox.blitTile(gbox.getBufferContext(), {
					tileset: this.tileset,
					tile: this.frame,
					dx: this.x,
					dy: this.y,
					fliph: this.fliph,
					flipv: this.flipv,
					camera: this.camera,
					alpha: 1.0
				});
				if (this.jump) {
					gbox.blitRect(gbox.getBufferContext(), {
						color: 'rgb(255,0,0)',
						x: this.colx + this.dx,
						y: this.coly + this.dy,
						w: this.colw,
						h: this.colh,
						alpha: 0.1
					});
				}
			}
        },
		touchAction: data.action
    });
}
function menuWalkAction() {
	if (this.isActive()) {
		mouse.isClicked = false;
		cursor.onPlayerMenu = false;
		cursor.onPlayerWalk = true;
	}
}
function menuStatusAction() {
	if (this.isActive()) {
		console.log("status");
	}
}
function createPlayerMenu() {
	var cam = gbox.getCamera();
	var x = cam.w / 2 - 16;
	var y = cam.h / 2 - 16;
	
	createPlayerMenuItem({id: "menu_walk", frame: 0, dx: x, dy: y - 30, action: menuWalkAction});
	createPlayerMenuItem({id: "menu_status", frame: 1, dx: x- 30, dy: y, action: menuStatusAction});
}