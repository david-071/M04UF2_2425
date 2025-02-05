let canvas_w = 800;
let canvas_h = 450;

let config = {
	width: canvas_w,
	height: canvas_h,
	scene: {
		preload: precarga,
		create: crea,
		update: actualiza
	}
};

let game = new Phaser.Game(config);

let canvas_bg, eggcups_bg;

let huevera_b, huevera_m, huevera_d;
let huevera_x = 128;

let huevo_b, huevo_m, huevo_d;

let huevo_shadow;

let huevos;
let huevos_dir = 2;
let huevos_y = 0;

let sprite_scale = .6;

let countdown = 60;
let countdown_text;
let countdown_interval;

function precarga ()
{
	this.load.image('grass_bg', 'imgs/grass_bg.png');
	this.load.image('straw_bg', 'imgs/straw_bg.png');
	this.load.image('huevera', 'imgs/huevera.png');
	this.load.image('huevo', 'imgs/huevo.png');
}

function crea ()
{
	let dorado = Phaser.Display.Color.GetColor(255, 215, 0);
	let marron = Phaser.Display.Color.GetColor(192, 128, 16);


	canvas_bg = this.add.image(canvas_w/2, canvas_h/2, 'grass_bg');

	eggcups_bg = this.add.image(huevera_x, canvas_h/2, 'straw_bg');
	eggcups_bg.setScale(.5);
	eggcups_bg.angle = 90;


	huevera_d = this.add.image(huevera_x, canvas_h/2 - 128, 'huevera');
	huevera_d.setScale(sprite_scale);
	huevera_d.setTint(dorado);

	huevera_m = this.add.image(huevera_x, canvas_h/2, 'huevera');
	huevera_m.setScale(sprite_scale);
	huevera_m.setTint(marron);

	huevera_b = this.add.image(huevera_x, canvas_h/2 + 128 , 'huevera');
	huevera_b.setScale(sprite_scale);

	huevo_shadow = this.add.image(-10000, -1000, 'huevo');
	huevo_shadow.setTint("#000000");
	huevo_shadow.alpha = .5;
	huevo_shadow.setScale(1.3);

	huevo_m = this.add.image(400, -50, 'huevo');
	huevo_m.setTint(marron);
	
	huevo_d = this.add.image(300, -50, 'huevo');
	huevo_d.setTint(dorado);
	
	huevo_b = this.add.image(500, -50, 'huevo');
	
	huevo_m.setInteractive({ draggable:true });

	huevo_m.on('pointerdown', function (){
		console.log("Huevo marrón");
		huevo_shadow.x = this.x + 8;
		huevo_shadow.y = this.y + 8;
		this.setScale(1.3);
	});
	
	huevo_d.setInteractive({ draggable:true });

	huevo_d.on('pointerdown', function (){
		console.log("Huevo dorado");
		huevo_shadow.x = this.x + 8;
		huevo_shadow.y = this.y + 8;
		this.setScale(1.3);
	});
	
	huevo_b.setInteractive({ draggable:true });

	huevo_b.on('pointerdown', function (){
		console.log("Huevo blanco");
		huevo_shadow.x = this.x + 8;
		huevo_shadow.y = this.y + 8;
		this.setScale(1.3);
	});

	this.input.on('drag', function (pointer, object, x, y) {
		object.x = x;
		object.y = y;
		huevo_shadow.x = x + 8;
		huevo_shadow.y = y + 8;

		if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_m.getBounds(), object.getBounds())){
			console.log("Huevo dentro de huevera!!!");
		}
	});

	this.input.on('dragend', function (pointer, object, x, y) {
		object.setScale(1);
		huevo_shadow.x = -10000;
		huevo_shadow.y = -10000;
	});

	countdown_text = this.add.text(canvas_w/2 + canvas_w/8, 16, countdown, {"fontSize": 48, "fontStyle": "bold"} );
	
	huevos = null;
}

function actualiza ()
{
	if (huevos === null) {
	
		let tipoHuevo = Phaser.Math.Between(1, 3);
		let color = null;

		if (tipoHuevo === 2) color = Phaser.Display.Color.GetColor(192, 128, 16); 
		if (tipoHuevo === 3) color = Phaser.Display.Color.GetColor(255, 215, 0); 

		huevos = this.add.image(Phaser.Math.Between(200, 600), huevos_y, 'huevo');
		if (color) {
			huevos.setTint(color);
		}
	} 
	else {
		huevos.y += huevos_dir;

		if (huevos.y >= canvas_h) {
			huevos.destroy();
			huevos = null; 
		}
	}
}


function actualiza_rect ()
{
	
	rect.x += rect_dir;

	if (rect.x <= 0 || rect.x >= canvas_w){
		rect_dir = -rect_dir;
	}
		

}

countdown_interval = setInterval (function(){
	countdown--;

	countdown_text.text = countdown;

	if (countdown <= 0){
		console.log("Game Over");
		clearInterval(countdown_interval);
	}
}, 1000);
