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

//let rect;
//let rect_dir = 1;

let field_center = canvas_w/2 + canvas_w/8;

let canvas_bg, eggcups_bg;

let huevos_max = 100;

let huevera_b, huevera_m, huevera_d;
let huevera_x = 128;

let huevo_b, huevo_m, huevo_d;


let huevo_shadow;

let sprite_scale = .6;

let countdown = 20;
let countdown_text;
let countdown_interval;

let huevos = [];

let huevos_speed = 1;

let huevos_interval;

let huevos_interval_time = 3000;

let huevo_current = 0;





let music = {
	background: null,
	game_over: null
};

let fx = {
	mouseclick: null,
	bad: null,
	good: null
};


function precarga ()
{
	this.load.image('grass_bg', 'imgs/grass_bg.png');
	this.load.image('straw_bg', 'imgs/straw_bg.png');
	this.load.image('huevera', 'imgs/huevera.png');
	this.load.image('huevo', 'imgs/huevo.png');

	this.load.audio('background_music', 'audio/apple_cider.mp3');
	this.load.audio('game_over_music', 'audio/GameOver.mp3');
	this.load.audio('game_over_music', 'audio/GameOver.mp3');

	this.load.audio('mouseclick_fx', 'audio/mouseclick.mp3');
}

function crea ()
{
	let blanco = Phaser.Display.Color.GetColor(255, 255, 255);
	let marron = Phaser.Display.Color.GetColor(192, 128, 16);
	let dorado = Phaser.Display.Color.GetColor(255, 215, 0);

	canvas_bg = this.add.image(canvas_w/2, canvas_h/2, 'grass_bg');

	eggcups_bg = this.add.image(huevera_x, canvas_h/2, 'straw_bg');
	eggcups_bg.setScale(.5);
	eggcups_bg.angle = 90;


	huevera_d = this.add.image(huevera_x, canvas_h/2 - 128, 'huevera');
	huevera_d.setScale(sprite_scale);
	huevera_d.setTint(dorado);
	huevera_d.huevera_type = "d";

	huevera_m = this.add.image(huevera_x, canvas_h/2, 'huevera');
	huevera_m.setScale(sprite_scale);
	huevera_m.setTint(marron);
	huevera_m.huevera_type = "m";


	huevera_b = this.add.image(huevera_x, canvas_h/2 + 128 , 'huevera');
	huevera_b.setScale(sprite_scale);
	huevera_b.huevera_type = "b";


	huevo_shadow = this.add.image(-10000, -1000, 'huevo');
	huevo_shadow.setTint("#000000");
	huevo_shadow.alpha = .5;
	huevo_shadow.setScale(1.3);


	let offset_x_min = field_center - 224;
	let offset_x_max = field_center + 224;

	for (let i = 0; i < huevos_max; i++){
		let huevo_tmp_x = Phaser.Math.Between(offset_x_min, offset_x_max);
		let huevo_tmp_y = -64;

		let huevo_tmp = this.add.image(huevo_tmp_x, huevo_tmp_y, 'huevo');

		if (i == 0)
			huevo_tmp.falling = true;
		else
			huevo_tmp.falling = false;

		let color = blanco;
		let huevo_type = "b";

		let random_num = Phaser.Math.Between(1, 100);
		
		if (random_num % 4 == 0){
			color = marron;
			huevo_type = "m";
		}
		else if (random_num % 9 == 0){
			color = dorado;
			huevo_type = "d";
		}

		huevo_tmp.setTint(color);

		huevo_tmp.huevo_type = huevo_type;

		huevo_tmp.setInteractive({ draggable:true });

		huevo_tmp.on('pointerdown', function (){
			this.falling = false;

			let huevo_color = "blanco";
			if (this.huevo_type == "m")
				huevo_color = "marrón";
			else if (this.huevo_type == "d")
				huevo_color = "dorado";
				
			console.log("Huevo "+huevo_color);

			huevo_shadow.x = this.x + 8;
			huevo_shadow.y = this.y + 8;
	
			fx.mouseclick.play();

			this.setScale(1.3);
		});


		huevos.push(huevo_tmp);
	}

	this.input.on('drag', function (pointer, object, x, y) {
		object.x = x;
		object.y = y;
		huevo_shadow.x = x + 8;
		huevo_shadow.y = y + 8;

	});

	this.input.on('dragend', function (pointer, object, x, y) {
		object.setScale(1);
		huevo_shadow.x = -10000;
		huevo_shadow.y = -10000;

		if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_b.getBounds(), object.getBounds())){
			if (object.huevo_type == "b"){
				countdown += 5;
				
				console.log("Huevo dentro de huevera!!!");
			}
			else{
				countdown -= 5;
				
				console.log("Huevo dentro de huevera equivocada!!!");
			}
			countdown_text.text = countdown;
		}
		else if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_m.getBounds(), object.getBounds())){
			if (object.huevo_type == "m"){
				countdown += 5;
				
				console.log("Huevo dentro de huevera!!!");
			}
			else{
				countdown -= 5;
				
				console.log("Huevo dentro de huevera equivocada!!!");
			}
			countdown_text.text = countdown;
		}
		else if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_d.getBounds(), object.getBounds())){
			if (object.huevo_type == "d"){
				countdown += 5;
				
				console.log("Huevo dentro de huevera!!!");
			}
			else{
				countdown -= 5;
				
				console.log("Huevo dentro de huevera equivocada!!!");
			}
			countdown_text.text = countdown;
		}
	});

	
	countdown_text = this.add.text(field_center, 16,
		countdown, {"fontSize":	48, "fontStyle": "bold"} );

	
	music.background = this.sound.add('background_music', {
			loop: true,
			volume: 0.5
		});

	music.background.play();

	music.game_over = this.sound.add('game_over_music');

	fx.mouseclick = this.sound.add('mouseclick_fx');


}


function actualiza ()
{
	if (countdown == 10){
		music.background.rate = 1.25;
	}


	for (let i = 0; i < huevos.length; i++){
		if (huevos[i].falling){
			huevos[i].y += huevos_speed;

			if (huevos[i].y > canvas_h +64){
				huevos[i].falling = false;

			}
		}
	}

}


countdown_interval = setInterval(function(){
	countdown--;

	countdown_text.text = countdown;

	if (countdown <= 0){
		console.log("Game Over");
		music.background.stop();
		music.game_over.play();

		clearInterval(countdown_interval);
	}
}, 1000);


function next_huevo ()
{
	huevo_current++;
	if (huevo_current >= huevos.length){
		console.log("Se acabaron los huevos");

		return;
	}

	huevos[huevo_current].falling = true;

	huevos_interval_time -= 100;
	if (huevos_interval_time < 400)
		huevos_interval_time = 400;

	huevos_interval = setTimeout(next_huevo, huevos_interval_time);
}


huevos_interval = setTimeout(next_huevo, huevos_interval_time);
