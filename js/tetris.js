"use strict";
var Polyominos = {
	STRAIT: 0,
	SQUARE: 1,
	T: 2,
	J: 3,
	L: 4,
	S: 5,
	Z: 6
};
var color_array = [0xff0000, 0x00ff00, 0x0000ff];
var color_index = 0;
class Piece {
    constructor(north, south, west, east) {
        this.i = 4;
        this.j = 0;
        this.north = north;
        this.south = south;
        this.west = west;
        this.east = east;
    }
    down() {
        this.j++
    }
    up() {
        this.j--
    }
    left() {
        this.i--;
        if (this.i - this.west < 0) {
            this.i = 0 + this.west;
        }
    }
    right() {
        this.i++;
        if ((this.i + this.east) > 9) {
            this.i = 9 - this.east ;
        }
    }

    rotate()
    {
    	if(this.east + this.west == this.south + this.north) {
    		return;
    	}
    	var temp = this.north;
    	this.north = this.east;
    	this.east = this.south;
    	this.south = this.west;
    	this.west = temp;
    	for (var i = 0; i < this.values.length; i++) {
    		var temp = this.values[i][0];
    		this.values[i][0] = this.values[i][1];
    		this.values[i][1] = temp*(-1);
    	}
    	if ((this.i + this.east) > 9)
    		this.i = 9 - this.east;
    	else if ((this.i - this.west) < 0)
    		this.i = 0 + this.west;
    	else if ((this.j - this.north) < 0)
    		this.j = 0 + this.north;
    	else if ((this.j + this.south) > 19)
    		this.j = 19 - this.south;
    }

    draw(matrix) {
        for (var i = 0; i < this.values.length; i++) {
            var cell = matrix[this.i + this.values[i][0]][this.j + this.values[i][1]];
            cell.visible = true;
            cell.color = this.color;
            cell.draw()
        }
    }
    fill(matrix, row_count) {
        for (var i = 0; i < this.values.length; i++) {
        	row_count[(this.j + this.values[i][1])]++;
            var cell = matrix[this.i + this.values[i][0]][this.j + this.values[i][1]];
            cell.visible = true;
            cell.color = this.color;
            cell.filled = true;
            cell.draw()
        }
    }
    conflict(matrix) {
        for (var i = 0; i < this.values.length; i++) {
            var i_offset = this.i + this.values[i][0];
            var j_offset = this.j + this.values[i][1];
            if (j_offset >= 20)
            	return true;
            var cell = matrix[i_offset][j_offset];
            console.log(cell);
            if (cell.filled)
            	return true;
        }
        return false
    }
}

class Square_Polyomino extends Piece {
	constructor() {
		super(0, 1, 0, 1);
		this.color = 0xffcc00;
		this.values = [
                [0, 0],
                [0, 1],
                [1, 0],
                [1, 1]
            ];
	}
}

class Straight_Polyomino extends Piece {
	constructor() {
		super(0, 0, 1, 2);
		this.values = [
			[-1, 0],
			[0, 0],
			[1, 0],
			[2, 0]
		];
		this.color = 0x06eff2;
	}
}

class T_Polyomino extends Piece {
	constructor() {
		super(0, 1, 1, 1);
		this.values = [
                [-1, 0],
                [0, 0],
                [0, 1],
                [1, 0]
            ];
        this.color = 0xff02ff;
	}
}

class J_Polyomino extends Piece {
	constructor() {
		super(0, 1, 1, 1);
		this.values = [
                [-1, 0],
                [0, 0],
                [1, 0],
                [1, 1]
            ];
        this.color = 0x0000ff;
	}
}

class L_Polyomino extends Piece {
	constructor() {
		super(0, 1, 1, 1);
		this.values = [
			[-1, 0],
			[-1, 1],
			[0, 0],
			[1, 0]
		];
		this.color = 0xff8001;
	}
}

class S_Polyomino extends Piece {
	constructor() {
		super(0, 1, 1, 1);
		this.values = [
			[-1, 1],
			[0, 0],
			[0, 1],
			[1, 0]
		];
		this.color = 0x00ff01;
	}
}

class Z_Polyomino extends Piece {
	constructor() {
		super(0, 1, 1, 1);
		this.values = [
			[-1, 0],
			[0, 0],
			[0, 1],
			[1, 1]
		];
		this.color = 0xff0000;
	}
}

class Cell {
    constructor(container, i, j) {
        this.square = new PIXI.Graphics();
        container.addChild(this.square);
        this.square.x = i * 25;
        this.square.y = j * 25;
        this.square.mouseover = function() {
            console.log("mouse over")
        };
        this.filled = false;
        this.color = 0xffffff
    }
    draw() {
        this.square.clear();
        this.square.beginFill(this.color);
        this.square.lineStyle(1, 0xFFFFFF);
        this.square.drawRect(0, 0, 25, 25);
        this.square.endFill()
    }
    set visible(value) {
        this.square.visible = value
    }
}
class Tetris {
    constructor(stage) {
        console.log("constructor for tetris");
        score = 0;
        this.set_up_board();
        this.set_up_next();
		this.board_row_count = [];
		for (var i = 0; i < 20; i++)
			this.board_row_count[i] = 0;
        this.current_piece = this.random_piece();
        this.next_piece = this.random_piece();
        this.draw_piece();
        this.draw_next();
        this.key_event_handler = this.handle_key_presses.bind(this);
        // document.addEventListener('keydown', this.handle_key_presses.bind(this));
        // this.start_game_loop();
    }

    set_up_board() {
        this.board = new PIXI.Sprite();
        this.outline = new PIXI.Graphics();
        this.board.x = 50;
        this.board.y = 55;
        this.draw_outline();
        this.board.addChild(this.outline);
        this.build_matrix(this.board);
        stage.addChild(this.board);
    }

    set_up_next() {
        this.next_board = new PIXI.Sprite();
        this.next_outline = new PIXI.Graphics();
        this.next_board.x = 325;
        this.next_board.y = 55;
        this.draw_next_piece_outline();
        this.next_board.addChild(this.next_outline);
        this.build_next_matrix(this.next_board);
        stage.addChild(this.next_board);
    }

    start_game_loop() {
    	this.interval = setInterval(this.tick.bind(this), 300);
    }

    end_game_loop() {
    	clearInterval(this.interval);
    	// document.removeEventListener('keydown', this.handle_key_presses.bind(this));
    	set_opaque();
    }

    tick() {
    	this.handle_key_presses("ArrowDown");
    }

    random_piece(){
    	var random = Math.floor(Math.random() * 7);
    	switch(random){
    		case Polyominos.STRAIT:
    			return new Straight_Polyomino();
    			break;
    		case Polyominos.SQUARE:
    			return new Square_Polyomino();
    			break;
    		case Polyominos.T:
    			return new T_Polyomino();
    			break;
    		case Polyominos.J:
    			return new J_Polyomino();
    			break;
    		case Polyominos.L:
    			return new L_Polyomino();
    			break;
    		case Polyominos.S:
    			return new S_Polyomino();
    			break;
    		case Polyominos.Z:
    			return new Z_Polyomino();
    			break;
    	}
    }
    remove_rows() {
    	var j = 19;
    	var drop_x_rows = 0;
    	while (j > 0) {
    		if (this.board_row_count[j] == 0) {
    			break;
    		}
    		if (this.board_row_count[j] == 10) {
    			drop_x_rows++;

    			var j2 = j-1;
    			while (this.board_row_count[j2] != 10 && j2 != 0
    				&& (this.board_row_count[j2] != 0 || this.board_row_count[j2+drop_x_rows] != 0)) {
    				for (var i = 0; i < 10; i++) {
						var currentCell = this.board_matrix[i][j2];
						var belowCell = this.board_matrix[i][j2+drop_x_rows];

						belowCell.visible = currentCell.visible;
						belowCell.color = currentCell.color;
						belowCell.filled = currentCell.filled;
					}
					this.board_row_count[j2+drop_x_rows] = this.board_row_count[j2--];
    			}

    			j = j2;
    		}
    		else {
    			j--;
    		}
    	}
    	var s = drop_x_rows * drop_x_rows;
    	score += s;
    	this.clear_board();
    	increment_score(score);
    }
    handle_key_presses(key) {
        if (key.code == "ArrowDown" || key == "ArrowDown") {
            this.current_piece.down();
            if (this.current_piece.conflict(this.board_matrix)) {
                this.current_piece.up();
                this.current_piece.fill(this.board_matrix, this.board_row_count);
            	if(this.board_row_count[0] > 0) {
            		this.end_game_loop();
            	}
                this.remove_rows();
                this.next_piece.i = 4;
		    	this.next_piece.j = 0;
                this.current_piece = this.next_piece;
                this.next_piece = this.random_piece();
                this.draw_piece();
                this.clear_next_matrix();
                this.draw_next();
            }
        }
        if (key.code == "ArrowLeft") {
            this.current_piece.left();
            if (this.current_piece.conflict(this.board_matrix)) {
                this.current_piece.right()
            }
        }
        if (key.code == "ArrowRight") {
            this.current_piece.right();
            if (this.current_piece.conflict(this.board_matrix)) {
                this.current_piece.left()
            }
        }
        if (key.keyCode == 32) {
        	this.current_piece.rotate();
        }
        this.clear_board();
        this.draw_piece()
    }
    draw_piece() {
        this.current_piece.draw(this.board_matrix)
    }
    draw_next() {
    	this.next_piece.i = 1;
    	this.next_piece.j = 1;
    	this.next_piece.draw(this.next_matrix);
    }
    build_next_matrix(container) {
    	this.next_matrix = [];
    	for (var i = 0; i < 4; i++) {
            this.next_matrix[i] = [];
            for (var j = 0; j < 4; j++) {
                this.next_matrix[i][j] = new Cell(container, i, j);
                this.next_matrix[i][j].visible = false
            }
        }
    }
    clear_next_matrix() {
		for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                this.next_matrix[i][j].draw();
                if (this.next_matrix[i][j].filled) {
                    this.next_matrix[i][j].visible = true
                } else {
                    this.next_matrix[i][j].visible = false
                }
            }
        }
    }

    build_matrix(container) {
        this.board_matrix = [];
        for (var i = 0; i < 10; i++) {
            this.board_matrix[i] = [];
            for (var j = 0; j < 20; j++) {
                this.board_matrix[i][j] = new Cell(container, i, j);
                this.board_matrix[i][j].visible = false
            }
        }
    }
    clear_board() {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 20; j++) {
                this.board_matrix[i][j].draw();
                if (this.board_matrix[i][j].filled) {
                    this.board_matrix[i][j].visible = true
                } else {
                    this.board_matrix[i][j].visible = false
                }
            }
        }
    }
    draw_outline() {
        this.outline.clear();
        this.outline.lineStyle(2, 0xCCCCCC);
        this.outline.beginFill();
        this.outline.drawRect(0, 0, 250, 500);
        this.outline.endFill()
    }
    draw_next_piece_outline() {
    	this.next_outline.clear();
        this.next_outline.lineStyle(2, 0xCCCCCC);
        this.next_outline.beginFill();
        this.next_outline.drawRect(0, 0, 100, 100);
        this.next_outline.endFill()
    }
}
var stage;
var renderer;
var score;
var game;
var opaque;

function get_high_scores(player_name, player_score)
{
	$.ajax(
		((player_name == null || player_score == null) ?
			{
				type:'POST',
			    url: "submit_score.php",
			    dataType: "json",
			}
			:
			{
				type:'POST',
			    url: "submit_score.php",
			    data: "name=" + player_name + "&score=" + player_score,
			    dataType: "json",
			}
		)
	)
	.done( function ( data )
	{
		$('#high_scores').html(data.html);
	})
	.fail( function ( text, options, err )
	{

	});
}

function after_load() {
    stage = new PIXI.Container();
    stage.interactive = true;
    renderer = PIXI.autoDetectRenderer(450, 630, null);
    document.body.appendChild(renderer.view);
    requestAnimationFrame(animate);
	game = new Tetris(stage)
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage)
}
after_load();

function start_game() {
	opaque = $("#screen").detach();
	document.addEventListener('keydown', game.key_event_handler);
    game.start_game_loop();
}

function set_opaque() {
	document.removeEventListener('keydown', game.key_event_handler);
	$(opaque).insertBefore("canvas");
	$("#submit_score").removeClass("has-error");
	$(".text-danger").remove();
	$("#sumbit_score_value").html("<h2 class='text-pulse'>" + score + "</h2>");
	$("#submit_score").modal("show");
}

function increment_score(score) {
	$("#score").html(score);
}

$(function(){
	var element = $("canvas").detach();
	$("#parent").append(element);
	get_high_scores();

	$("#send_score").submit(function( event ) {
		var player_name = $("#player_name").val();
		if (player_name.length < 3 || player_name.length > 25) {
			event.preventDefault();
			$("#player_name").parent().addClass("has-error");
			if (player_name.length < 3)
				var error_text = '<span class="text-danger" data-valmsg-for="player_name">Names must be at least 3 characters long.</span>';
			$(error_text).insertAfter("#player_name");
			return;
		}
		get_high_scores(player_name, score);
	});

	$("#submit_score").on("hidden.bs.modal", function() {
		game = new Tetris(stage);
	});
});