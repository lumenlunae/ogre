var maingame;
var tilemaps = {};
var dialogues = {};
var intro_dialogue = {};
var pathmap = [];
var frame_count = 0;
var TILES = { X: 20, Y: 15 };
var touchParams = {
    title: 'aki'
};
var fullParams = {
    title: 'aki',
    width: 320,
    height: 240,
    zoom: 2
};

window.addEventListener('load', loadResources, false);

function loadResources() {

    if (help.getDeviceConfig().touch) {

        help.akihabaraInit(touchParams);
    } else {
        help.akihabaraInit(fullParams);
    }
    document.body.style.backgroundColor = "#101010";
    //gbox.setCallback(main);
    gbox.addBundle({ file: "bundles/bundle.js" });
    gbox.loadAll(main);
}

function main() {
    gbox.setGroups(['background', 'foreground', 'player', 'movingObjects', 'objects', 'projectiles', 'sparks', 'above', 'mouse', 'game']);
    gbox.setRenderOrder(["background", "foreground", gbox.ZINDEX_LAYER, "sparks", "above", "mouse", "game"]);

    maingame = gamecycle.createMaingame('game', 'game');
    maingame.gameMenu = function () {
        return true;
    };
    // game title animation
    maingame.gameTitleIntroAnimation = function (reset) {
        if (reset)
            gbox.stopChannel("bgmusic");
        else {
            gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
            gbox.blitText(gbox.getBufferContext(), { font: "small", text: "My Little Wizard", valign: gbox.ALIGN_MIDDLE, halign: gbox.ALIGN_CENTER, dx: 0, dy: 0, dw: gbox.getScreenW(), dh: gbox.getScreenH() - 100 });
        }
    };

    // PRESS START
    maingame.pressStartIntroAnimation = function (reset) {
        if (reset) {
            toys.resetToy(this, "default-blinker");
        } else {
            toys.text.blink(this, "default-blinker", gbox.getBufferContext(), { font: "small", text: "PRESS Z TO START", valign: gbox.ALIGN_MIDDLE, halign: gbox.ALIGN_CENTER, dx: 0, dy: Math.floor(gbox.getScreenH() / 3), dw: gbox.getScreenW(), dh: Math.floor(gbox.getScreenH() / 3) * 2, blinkspeed: 10 });
            return gbox.keyIsHit("a");
        }
    };

    maingame.gameIntroAnimation = function (reset) {

        if (reset) {
            toys.resetToy(this, 'intro-animation');
        } else {
            gbox.blitFade(gbox.getBufferContext(), {
                alpha: 1
            });
            return toys.dialogue.render(this, "intro-animation", intro_dialogue.intro);
        }

    };

    maingame.changeLevel = function (level) {
        gbox.trashGroup("background");
        gbox.trashGroup("foreground");
        gbox.trashGroup("movingObjects");
        gbox.trashGroup("objects");
        gbox.trashGroup("projectiles");

        if (level == null) {
            level = 1;
        }

        dialogues = {};
        pathmap = [];

        if (tilemaps.map1) {
            delete tilemaps.map1;
            delete tilemaps.map2;
            delete tilemaps.map3;
        }

        gbox.addBundle({
            file: "bundles/level-" + level + ".js",
            onLoad: function () {
                gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
                gbox.blitText(gbox.getBufferContext(), { font: "small", text: "Now loading...", valign: gbox.ALIGN_BOTTOM, halign: gbox.ALIGN_RIGHT, dx: 0, dy: 0, dw: gbox.getScreenW(), dh: gbox.getScreenH() });
                
				tilemaps.map1.tilesetNormal = tilemaps.map1.tileset;
				tilemaps.map2.tilesetNormal = tilemaps.map2.tileset;
				tilemaps.map3.tilesetNormal = tilemaps.map3.tileset;
				
				finalizeTilemaps();
				
				addPlayer(0,0);
                tilemaps.map.addObjects();
				
				hidePlayerMenu();
            }
        });
    };
    maingame.initializeGame = function () {
		
    };

    gbox.go();
}

function addUnit(data) {
    var td = gbox.getTiles(tilemaps.map1.tileset);
	var id = data.id ? data.id : null;
    gbox.addObject({
		id: id,
        group: 'movingObjects',
        tileset: 'unitTiles',
		frame: data.frame,
        zindex: 0,
        movingstill: true,
        framespeed: 5,
        speed: 2,
        moveRandom: true,
        currentAnim: [0],
        stilltimer: 0,
        invultimer: 0,
        waypointCount: 0,
        waypointMax: 5,
        timerCallback: function () {

        },
        initialize: function () {
            toys.topview.initialize(this, {});

            this.x = data.x * td.tilew;
            this.y = data.y * td.tileh;
			var tileset = gbox.getTiles(this.tileset); 
			this.colh = tileset.tileh;
			this.colw = tileset.tilew;
			this.coly = tileset.tileh - this.colh;
			this.colhh = Math.floor(this.colh/2);
			this.colhw = Math.floor(this.colw/2);

        },
        first: function () {
			if (this.invultimer) this.invultimer--;
            if (this.stilltimer) {
                this.stilltimer--;
                if (!this.stilltimer) {
                    this.timerCallback();
                    this.timerCallback = function () { };
                }
            } else {
				
			}
			if (this.movingTo) {
				
				var distX = this.movingTo.x - this.x;
				var distY = this.movingTo.y - this.y;
				
				var dist = Math.sqrt(distX*distX + distY*distY);
				
				var dx = distX / dist * this.speed;
				var dy = distY / dist * this.speed;
				this.xpushing = true;
				this.ypushing = true;
				this.accx = dx;
				this.accy = dy;
				
				if (distX < 1 && distX > -1 && distY < 1 && distY > -1) {
					this.movingTo = null;
					this.xpushing = false;
					this.ypushing = false;
					this.accx = 0;
					this.accy = 0;
					this.x = Math.floor(this.x);
					this.y = Math.floor(this.y);
				}
			}
            else if (this.still) {
                //this.counter = (this.counter + 1) % 60;
                //this.frame = help.decideFrame(this.counter, this.currentAnim);

            } else {
                //generalAnimFramesAndFacing(this);
				
            }
            generalCollisionCheck(this);
            npcCollisionCheck(this);
        },
        blit: function () {
			if ((this.invultimer%2)==0) {
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
				gbox.blitRect(gbox.getBufferContext(), {
					color: 'rgb(255,0,0)',
					x: this.colx + this.x,
					y: this.coly + this.y,
					w: this.colw,
					h: this.colh,
					camera: this.camera,
					alpha: 0.1
				});
			}
        },
        addTimerCallback: function (fn) {
            if (this.timerCallback) {
                var old = this.timerCallback;
                this.timerCallback = function () {
                    old();
                    fn();
                }
            } else {
                this.timerCallback = fn;
            }
        },
        collisionEnabled: function () {
            return !maingame.gameIsHold() && !this.killed && !this.invultimer && !this.isPaused;
        },
        resetAnimationFlip: function () {
            this.fliph = false;
            this.flipv = false;
        },
        followObj: function (obj) {
            if (!this.stilltimer) {
                this.accx = 0;
                this.accy = 0;
                this.following = obj;
                this.nodes = a_star([Math.floor(this.x / 16), Math.floor(this.y / 16)], [Math.floor(this.following.x / 16), Math.floor(this.following.y / 16)], pathmap, TILES.X, TILES.Y);

                if (this.nodes.length > 0) {
                    this.waypoint = [16 * this.nodes[1].x, 16 * this.nodes[1].y];
                } else {
                    this.waypoint = null;
                }
            }
        },
        walkAction: function(data) {
			this.movingTo = data;
		},
		touchAction: function() {
			if (!cursor.onPlayerMenu) {
				this.invultimer = 20;
				showPlayerMenu(this);
			}
		}
    });
}
function createFireball(obj) {
    var leftRight = false;
    var fireFrames = { speed: 3, frames: [0, 1, 2] };
    if (obj.facing == toys.FACE_RIGHT) {
        fireFrames.frames = [3, 4, 5];
        leftRight = true;
    } else if (obj.facing == toys.FACE_DOWN) {
        fireFrames.frames = [6, 7, 8];
    } else if (obj.facing == toys.FACE_LEFT) {
        fireFrames.frames = [9, 10, 11];
        leftRight = true;
    }
    var fireball = toys.topview.e.fireBullet("projectiles", null, {
        fullhit: false,
        collidegroup: "movingObjects",
        map: tilemaps.map2,
        mapindex: "map",
        defaulttile: 0,
        from: obj,
        sidex: obj.facing,
        sidey: obj.facing,
        tileset: "fireball",
        frames: fireFrames,
        acc: 1,
        fliph: false,
        flipv: false,
        spritewalls: "objects",
        facing: obj.facing,
        angle: toys.FACES_ANGLE[obj.facing]

    });

    var oldInit = fireball.initialize;
    fireball.initialize = function () {
        // Rest of init
        fireball.y += 6;

        oldInit();
        if (leftRight) {
            if (fireball.facing == toys.FACE_LEFT) {
                fireball.colx += 3;
            } else {
            }
            fireball.coly -= 2;
            fireball.colw -= 3;
            fireball.colh -= 7;
        } else {
            // shooting up or down
            if (fireball.facing == toys.FACE_UP) {
                fireball.coly -= 9;
            } else {
                fireball.coly -= 8;
            }

            fireball.colx += 7;
            fireball.colw -= 15;
            fireball.colh += 2;
        }
    }
    var oldBlit = fireball.blit;
    fireball.blit = function () {
        oldBlit();
        // debug bounding box
        gbox.blitRect(gbox.getBufferContext(), {
            color: 'rgb(255,0,0)',
            x: fireball.colx + fireball.x,
            y: fireball.coly + fireball.y,
            w: fireball.colw,
            h: fireball.colh,
            alpha: 0.5
        });

    }
}

function actionStopGrabbing(obj) {
    //console.log("stop grabbing");
    if (obj.grabbingObj) obj.grabbingObj.playerStopGrabbing();
    obj.grabbing = false;
    obj.grabbingObj = false;
}
// This is our function for adding the map object -- this keeps our main game code nice and clean
function addMap(layer, groupid, layerid) {
    gbox.addObject({
        id: layerid, // This is the object ID
        group: groupid,    // We use the 'backround' group we created above with our 'setGroups' call.
        first: function () {
            frame_count = (frame_count + 1) % 60;
        },
        // The blit function is what happens during the game's draw cycle. Everything related to rendering and drawing goes here.
        blit: function () {

            //followCamera(gbox.getObject('player', 'player'), {w: layer.w,h: layer.h});
            // First let's clear the whole screen. Blitfade draws a filled rectangle over the given context (in this case, the screen)
            gbox.blitFade(gbox.getBufferContext(), {
                alpha: 1
            });

            // Since we blitted the tilemap to 'map_canvas' back in our main function, we now draw 'map_canvas' onto the screen. The 'map_canvas' is
            //  just a picture of our tilemap, and by blitting it here we're making sure that the picture re-draws every frame.


            gbox.blit(gbox.getBufferContext(), gbox.getCanvas('map_canvas'), {
                dx: 0,
                dy: 0,
                dw: gbox.getCanvas('map_canvas').width,
                dh: gbox.getCanvas('map_canvas').height,
                sourcecamera: true
            });

        }
    });
}
function addMap2(layer, groupid, layerid, canvas) {
    gbox.addObject({
        id: layerid, // This is the object ID
        group: groupid,    // We use the 'backround' group we created above with our 'setGroups' call.
        first: function () {
            //frame_count++;
        },
        // The blit function is what happens during the game's draw cycle. Everything related to rendering and drawing goes here.
        blit: function () {

            //followCamera(gbox.getObject('player', 'player_id'), { w: layer.w, h: layer.h });
            // First let's clear the whole screen. Blitfade draws a filled rectangle over the given context (in this case, the screen)
            //gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });

            // Since we blitted the tilemap to 'map_canvas' back in our main function, we now draw 'map_canvas' onto the screen. The 'map_canvas' is
            //  just a picture of our tilemap, and by blitting it here we're making sure that the picture re-draws every frame.
            //gbox.getCanvasContext(canvas).translate(0.5, 0.5);
            gbox.blit(gbox.getBufferContext(), gbox.getCanvas(canvas), {
                dx: 0,
                dy: 0,
                dw: gbox.getCanvas(canvas).width,
                dh: gbox.getCanvas(canvas).height,
                sourcecamera: true
            });
            //gbox.getCanvasContext(canvas).translate(0.5, 0.5);

        }
    });
}


function followCamera(obj, viewdata) {
    xbuf = 96;
    ybuf = 96;
    xcam = gbox.getCamera().x;
    ycam = gbox.getCamera().y;
    if ((obj.x - xcam) > (gbox._screenw - xbuf)) {
        gbox.setCameraX(xcam + (obj.x - xcam) - (gbox._screenw - xbuf), viewdata);
    }
    if ((obj.x - xcam) < (xbuf)) {
        gbox.setCameraX(xcam + (obj.x - xcam) - xbuf, viewdata)
    }
    if ((obj.y - ycam) > (gbox._screenh - ybuf)) {
        gbox.setCameraY(ycam + (obj.y - ycam) - (gbox._screenh - ybuf), viewdata);
    }
    if ((obj.y - ycam) < ybuf) {
        gbox.setCameraY(ycam + (obj.y - ycam) - ybuf, viewdata);
    }

}
function generalCollisionCheck(obj) {
    obj.pastaccx = obj.accx;
    obj.pastaccy = obj.accy;
    obj.pastaccz = obj.accz;
    toys.topview.e.handleAccelerations(obj);
    toys.topview.handleGravity(obj);
    if (!obj.stilltimer) toys.topview.applyForces(obj);
    toys.topview.applyGravity(obj); // z-gravity
    toys.topview.tileCollision(obj, tilemaps.map1, 'map', null, {
        tolerance: 2,
        approximation: 2
    });
    toys.topview.tileCollision(obj, tilemaps.map2, 'map', null, {
        tolerance: 2,
        approximation: 2
    });
    toys.topview.floorCollision(obj);

}

function objectCollisionCheck(obj) {
    generalCollisionCheck(obj);
    toys.topview.adjustZindex(obj);
}

function playerCollisionCheck(obj) {

    // Handles "touching" objects.
    // Executed before spritewall pushes the player to an adjusted coordinate
    //var collision = toys.topview.e.callWhenColliding(obj, 'movingObjects', 'doPlayerCollide');
    //var collision2 = toys.topview.e.callWhenColliding(obj, 'objects', 'doPlayerCollide');

    toys.topview.e.objectwallCollision(obj, { group: "movingObjects", objcall: "doPlayerCollide" });
    toys.topview.e.objectwallCollision(obj, { group: "objects", objcall: "doPlayerCollide" }); // Doors and tresaure chests are sprites that acts like a wall.
    toys.topview.adjustZindex(obj);
}

function npcCollisionCheck(obj, data) {


    if (data == null) {
        data = {};
    }
    if (data.objcall == null) {
        data.objcall = "doNpcCollide";
    }
    toys.topview.e.objectwallCollision(obj, { group: "movingObjects", objcall: data.objcall, selfcall: data.selfcall });
    toys.topview.e.objectwallCollision(obj, { group: "objects", objcall: data.objcall, selfcall: data.selfcall });
    toys.topview.adjustZindex(obj);
}

function generalAnimFramesAndFacing(obj) {
    obj.counter = (obj.counter + 1) % 60;
    toys.topview.setFrame(obj);
}

function generalAnimList(obj) {
    return {
        standup: {
            speed: 1,
            frames: [1]
        },
        standright: {
            speed: 1,
            frames: [4]
        },
        standdown: {
            speed: 1,
            frames: [7]
        },
        standleft: {
            speed: 1,
            frames: [10]
        },
        movingup: {
            speed: obj.framespeed,
            frames: [0, 1, 2, 1]
        },
        movingright: {
            speed: obj.framespeed,
            frames: [3, 4, 5, 4]
        },
        movingdown: {
            speed: obj.framespeed,
            frames: [6, 7, 8, 7]
        },
        movingleft: {
            speed: obj.framespeed,
            frames: [9, 10, 11, 10]
        },
        pushingup: {
            speed: obj.framespeed,
            frames: [0, 1, 2, 1]
        },
        pushingright: {
            speed: obj.framespeed,
            frames: [3, 4, 5, 4]
        },
        pushingdown: {
            speed: obj.framespeed,
            frames: [6, 7, 8, 7]
        },
        pushingleft: {
            speed: obj.framespeed,
            frames: [9, 10, 11, 10]
        }
    }
}

function showPlayerMenu(obj) {
	cursor.onPlayerMenu = true;
	cursor.onObj = obj;
	/*
	var cam = gbox.getCamera();
	var x = cam.w / 2 - 16;
	var y = cam.h / 2 - 16;
	maingame.hud.setWidget("menu_walk", {widget: "blit", value: 0, tileset: "menu", dx:x, dy: y - 30});
	maingame.hud.setWidget("menu_status", {widget: "blit", value: 1, tileset: "menu", dx:x - 30, dy: y });
	maingame.hud.setWidget("menu_item", {widget: "blit", value:2, tileset: "menu", dx:x + 30, dy: y });
	maingame.hud.setWidget("menu_attack", {widget: "blit", value: 3, tileset: "menu", dx:x, dy: y + 30});
	maingame.hud.showWidgets(["menu_status","menu_walk", "menu_item", "menu_attack"]);
	*/
}

function hidePlayerMenu() {
	//maingame.hud.hideWidgets(["menu_status","menu_walk", "menu_item", "menu_attack"]);
	cursor.onPlayerMenu = false;
}
function createPathFromTileMap(pathMap, tileMap) {
    // initialize
    if (pathMap.length == 0) {
        for (i = 0; i < TILES.X; i++) {
            pathMap.push([]);
        }
    }
    for (i = 0; i < TILES.Y; i++) {
        for (j = 0; j < TILES.X; j++) {
            var solid = tileMap.tileIsSolid(tileMap, tileMap.map[i][j]);
            if (pathMap[j][i] == null) {
                pathMap[j][i] = solid;
            } else {
                // OR with what we have
                pathMap[j][i] = (solid || pathMap[j][i]);
            }
        }
    }
}

function objectIsAlive(obj) {
    return trigo.getDistance(obj, gbox.getCamera()) < 800;
}

function zoomOut() {
	tilemaps.map1.tileset = tilemaps.map1.tilesetSmall;
	tilemaps.map2.tileset = tilemaps.map2.tilesetSmall;
	tilemaps.map3.tileset = tilemaps.map3.tilesetSmall;
	
	finalizeTilemaps();
	for (var id in gbox._objects["movingObjects"]) {
		var obj = gbox.getObject("movingObjects", id);
		obj.x = obj.x / 2;
		obj.y = obj.y / 2;
	}
	gbox.setCameraX(gbox.getCamera().x / 2, tilemaps.map1);
	gbox.setCameraY(gbox.getCamera().y / 2, tilemaps.map1);
}

function zoomIn() {
	tilemaps.map1.tileset = tilemaps.map1.tilesetNormal;
	tilemaps.map2.tileset = tilemaps.map2.tilesetNormal;
	tilemaps.map3.tileset = tilemaps.map3.tilesetNormal;
	
	finalizeTilemaps();
	
	for (var id in gbox._objects["movingObjects"]) {
		var obj = gbox.getObject("movingObjects", id);
		obj.x = obj.x * 2;
		obj.y = obj.y * 2;
	}
	gbox.setCameraX(gbox.getCamera().x * 2, tilemaps.map1);
	gbox.setCameraY(gbox.getCamera().y * 2, tilemaps.map1);
}

function finalizeTilemaps() {
	help.finalizeTilemap(tilemaps.map1);
	help.finalizeTilemap(tilemaps.map2);
	help.finalizeTilemap(tilemaps.map3);

	gbox.createCanvas('map_canvas', {
		w: tilemaps.map1.w,
		h: tilemaps.map1.h
	});

	gbox.blitTilemap(gbox.getCanvasContext('map_canvas'), tilemaps.map1);

	gbox.createCanvas('map_canvas2', {
		w: tilemaps.map2.w,
		h: tilemaps.map2.h
	});

	gbox.blitTilemap(gbox.getCanvasContext('map_canvas2'), tilemaps.map2);

	gbox.createCanvas('map_canvas3', {
		w: tilemaps.map3.w,
		h: tilemaps.map3.h
	});

	gbox.blitTilemap(gbox.getCanvasContext('map_canvas3'), tilemaps.map3);
}