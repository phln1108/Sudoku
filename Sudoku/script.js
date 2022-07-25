var matriz = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var notes = [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
];
var black_numbers = [];
var selected_x = 0;
var selected_y = 0;
var selected_cell = 'cell00';
var hearts = 3;
var note = false;
var num_used = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// ============randomizers=============== //

function cordRandom(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function random_numbers(dificulty) {
    for (let i = 0; i < dificulty; i++) {
        let flag = true;
        while (flag) {
            let x = cordRandom(0, 9);
            let y = cordRandom(0, 9);
            if (board[x][y] == 0) {
                let num = matriz[x][y];
                board[x][y] = num;
                num_used[num - 1]++;
                if (num_used[num - 1] == 9) {
                    let button = document.getElementById('button' + num);
                    button.style.visibility = 'hidden';
                }
                let img = document.getElementById('img' + x + '' + y);
                img.src = ('img/num/black/' + num + '.png');
                black_numbers.push(x + '' + y);
                flag = false;
            }
        }
    }
}

//================Reset================= //

function reset() {
    for (let x = 0; x < 9; x++) {
        let button = document.getElementById('button' + (x + 1));
        button.style.visibility = 'visible';
        num_used[x] = 0;
        for (let y = 0; y < 9; y++) {
            let img = document.getElementById('img' + x + y);
            let cell = document.getElementById('cell' + x + y);
            for (let i = 1; i < 10; i++) {
                let aux = document.getElementById('img' + x + y + '-' + i);
                aux.src = 'img/num/blank.png';
            }
            notes[x][y] = '';
            board[x][y] = 0;
            matriz[x][y] = 0;
            img.src = 'img/num/blank.png';
            cell.style.background = 'white';
        }
    }
    selected_x = 0;
    selected_y = 0;
    selected_cell = 'cell00';
    hearts = 3;
    for (let i = 1; i < 4; i++) {
        let heart = document.getElementById('vida' + i);
        heart.src = 'img/heart.png';
    }
}

function reset_collum(y) {
    for (let i = 0; i < 9; i++) {
        matriz[i][y] = 0;
    }
}

function reset_block(row, collum) {
    let x = parseInt(row / 3) * 3;
    let y = parseInt(collum / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            matriz[x + i][y + j] = 0;
        }
    }
}

// ===============map making================== //

function verify(number, row, collum) {
    let x = parseInt(row / 3) * 3;
    let y = parseInt(collum / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (matriz[x + i][y + j] == number) {
                return false
            }
        }
    }
    for (let z = 0; z < 9; z++) {
        if (matriz[z][collum] == number || matriz[row][z] == number) {
            return false;
        }
    }
    return true;
}

function possible_positions(x, y) {
    let numbers = '';
    for (let i = 1; i < 10; i++) {
        if (verify(i, x, y)) {
            numbers += i;
        }
    }
    return numbers;
}

function set_priority(x) {
    let priorities = [];
    for (let y = 0; y < 9; y++) {
        let numbers = possible_positions(x, y);
        if (numbers.length == 0) {
            priorities.push('null');
        } else {
            priorities.push(numbers);
        }
    }
    return priorities;
}

function criar_mapa() {
    let repeat = true;
    while (repeat) {
        repeat = false;
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (matriz[x][y] === 0) {
                    let possibles = possible_positions(x, y);
                    if (possibles.length == 0) {
                        matriz[x] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                        reset_collum(y)
                        repeat = true;
                    } else {
                        let index = cordRandom(0, possibles.length);
                        matriz[x][y] = possibles[index];
                    }
                }
            }
        }
    }
}

// ===============highlights=============== //

function highlight_number(x, y, color) {
    if (board[x][y] != 0) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] == board[x][y]) {
                    let cell = document.getElementById('cell' + i + j);
                    cell.style.background = color;
                }
            }
        }
    }
}

function highlight(x, y, color) {
    for (let i = 0; i < 9; i++) {
        let cellx = document.getElementById('cell' + i + y);
        let celly = document.getElementById('cell' + x + i);
        if (board[x][y] != 0 && board[x][y] == board[i][y]) {
            cellx.style.background = '#fc7474';
        } else {
            cellx.style.background = color;
        }
        if (board[x][y] != 0 && board[x][y] == board[x][i]) {
            celly.style.background = '#fc7474';
        } else {
            celly.style.background = color;
        }
    }
    let row = parseInt(x / 3) * 3;
    let collum = parseInt(y / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let cellC = document.getElementById('cell' + (row + i) + (collum + j));
            if (board[x][y] != 0 && board[x][y] == board[row + i][collum + j]) {
                cellC.style.background = '#fc7474';
            } else {
                cellC.style.background = color;
            }
        }
    }
    if (color != 'white') {
        let cellS = document.getElementById(selected_cell);
        cellS.style.background = '#caf3f1';
    }
}

function select_cell(id) {
    highlight(selected_x, selected_y, 'white');
    highlight_number(selected_x, selected_y, 'white');
    new_cell = document.getElementById(id);
    selected_x = id[4];
    selected_y = id[5];
    selected_cell = id;
    highlight_number(selected_x, selected_y, '#d5d5d5');
    highlight(selected_x, selected_y, '#d5d5d5');
}

function errou() {
    let heart = document.getElementById('vida' + hearts);
    hearts--;
    heart.src = 'img/blank_heart.png';
}
function toggle_note() {
    note = !note;
    document.getElementById('note').src = ('img/' + note + '.png');
}

function erase_note(x, y, num) {
    let cell_note = notes[x][y];
    let img_note = document.getElementById('img' + x + y + '-' + num);
    img_note.src = ('img/num/blank.png');
    let = new_note = '';
    for (let i = 0; i < cell_note.length; i++) {
        if (cell_note[i] != num) {
            new_note += cell_note[i];
        }
    }
    notes[x][y] = new_note;
}

function erase_number_select(num) {
    let x = selected_x;
    let y = selected_y;
    for (let i = 0; i < 9; i++) {
        if (notes[x][i].includes(num)) {
            erase_note(x, i, num);
        }
        if (notes[i][y].includes(num)) {
            erase_note(i, y, num)
        }
    }
    let row = parseInt(x / 3) * 3;
    let collum = parseInt(y / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (notes[row + i][collum + j].includes(num)) {
                erase_note(row + i, collum + j, num);
            }
        }
    }
}

function select_number(num) {
    let cell = document.getElementById('img' + selected_x + selected_y);
    if (num == board[selected_x][selected_y]) {
        cell.src = 'img/num/blank.png';
        highlight_number(selected_x, selected_y, 'white');
        board[selected_x][selected_y] = 0;
    } else {
        if (num == matriz[selected_x][selected_y]) {
            cell.src = ('img/num/blue/' + num + '.png');
            erase_number_select(num)
            num_used[num - 1]++
            if (num_used[num - 1] == 9) {
                let button = document.getElementById('button' + num);
                button.style.visibility = 'hidden';
            }
        } else {
            errou();
            cell.src = ('img/num/red/' + num + '.png');
        }
        board[selected_x][selected_y] = num;
        highlight_number(selected_x, selected_y, '#d5d5d5');
    }
    highlight(selected_x, selected_y, '#d5d5d5');
}

function select_number_note(num) {
    let x = selected_x;
    let y = selected_y;
    if (notes[x][y].includes(num)) {
        erase_note(x, y, num);
    } else {
        notes[x][y] += num;
        let img_note = document.getElementById('img' + x + y + '-' + num);
        img_note.src = ('img/num/black/' + num + '.png');
    }
}

function play_number(num) {
    let x = selected_x;
    let y = selected_y;
    if (!black_numbers.includes(x + '' + y) && hearts > 0) {
        let img = document.getElementById('img' + x + y);
        if (board[x][y] != 0 && board[x][y] == matriz[x][y]) {
            num_used[board[x][y] - 1]--;
            let button = document.getElementById('button' + board[x][y]);
            button.style.visibility = 'visible';
        }
        if (note) {
            img.src = ('img/num/blank.png');
            img.style.height = '0px';
            img.style.margin = '0px';
            board[x][y] = 0;
            select_number_note(num);
        } else {
            notes[x][y] = '';
            for (let i = 1; i < 10; i++) {
                img.style.height = '65%';
                img.style.margin = '15%';
                let img_note = document.getElementById('img' + x + y + '-' + i);
                img_note.src = ('img/num/blank.png');
            }
            select_number(num);
        }
    }
}

function start(dificulty) {
    let interface = document.getElementById("dificulty");
    let buttons = document.getElementsByClassName("buttons_dificulty");
    for(let i = 0; i<buttons.length;i++){
        buttons[i].style.transition = '0s';
    }
    let blocos = document.getElementById("grupo_blocos");
    interface.style.visibility = 'hidden';
    blocos.style.visibility = 'visible';
    black_numbers = [];
    reset();
    criar_mapa();
    random_numbers(dificulty);

}

function hover(ids){
    for(let i = 0; i<ids.length;i++){
        let letra = document.getElementById(ids[i]);
        letra.src = "img/letters/color/"+(ids[i].split('_')[1].length == 1 ? ids[i].split('_')[1]:ids[i].split('_')[1][0])+".png";
    }
}

function notHover(ids){
    for(let i = 0; i<ids.length;i++){
        let letra = document.getElementById(ids[i]);
        letra.src = "img/letters/blank/"+(ids[i].split('_')[1].length == 1 ? ids[i].split('_')[1]:ids[i].split('_')[1][0])+".png";
    }
}

function select_dificult(){
    let interface = document.getElementById("dificulty");
    let blocos = document.getElementById("grupo_blocos");
    interface.style.visibility = 'visible';
    blocos.style.visibility = 'hidden';
    let buttons = document.getElementsByClassName("buttons_dificulty");
    for(let i = 0; i<buttons.length;i++){
        buttons[i].style.transition = '0.5s';
    }
}
