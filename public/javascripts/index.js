'use strict';

var ctx;
var width;
var heigth;
var dashList = [3, 3]; //пунктирная линия 3 на 3 пикселя
window.onload = function(){
    var canvas = document.getElementById('canvas');
    if(!document.querySelector('#moi-form').value){
        document.querySelector('#hid').classList.add('hidden');
    }
    // Проверяем понимает ли браузер canvas
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    }
    start();
    document.querySelector('#draw').onclick = function(){
        draw();
    };
    document.querySelector('#moi-form').onchange = function(){
        if(!document.querySelector('#moi-form').value){
            document.querySelector('#hid').classList.add('hidden');
        }else{
            document.querySelector('#hid').classList.remove('hidden');
        }
        if(document.querySelector('#moi-form').value === 'Прямоугольная'){
            document.querySelector('.diameter-group').classList.add('hidden');
            document.querySelector('.lots-group').classList.add('hidden');
            document.querySelector('.side-group').classList.remove('hidden');
        }
        if(document.querySelector('#moi-form').value === 'Круглая'){
            document.querySelector('.side-group').classList.add('hidden');
            document.querySelector('.lots-group').classList.add('hidden');
            document.querySelector('.diameter-group').classList.remove('hidden');
        }
        if(document.querySelector('#moi-form').value === 'Эллипс'){
            document.querySelector('.side-group').classList.add('hidden');
            document.querySelector('.diameter-group').classList.add('hidden');
            document.querySelector('.lots-group').classList.remove('hidden');
        }
    };
};

function start(){
    ctx.fillStyle="#90ab6e";
    heigth = 600;
    width = 1200;
    ctx.strokeStyle = "#000000";
    ctx.font = "25px Helvetica";
    ctx.strokeText("A", +width/2, 28);
    ctx.strokeText("B", +width+30, +heigth/2);
    ctx.strokeText("C", +width/2, +heigth + 60);
    ctx.strokeText("D", 0, +heigth/2);
    ctx.fillRect(30, 30, width, heigth);
}

function draw(){
    ctx.clearRect(0, 0, 1300, 700);
    width = document.getElementById('width').value;
    heigth = document.getElementById('depth').value;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#90ab6e';
    ctx.translate(0, 0);
    ctx.strokeText("A", +width/2, 28);
    ctx.strokeText("B", +width+30, +heigth/2);
    ctx.strokeText("C", +width/2, +heigth + 60);
    ctx.strokeText("D", 0, +heigth/2);
    ctx.fillRect(30, 30, +width, +heigth);
    ctx.beginPath();
    var x = +document.getElementById('splice1').value || 0;
    var y = +document.getElementById('splice2').value || 0;
    if(x > 0){
        ctx.beginPath();
        ctx.strokeStyle="#000000";
        ctx.lineWidth = 1;
        ctx.moveTo(x+30,30);
        ctx.lineTo(x+30, +heigth+30);
        ctx.stroke();
    }
    if(y > 0){
        ctx.beginPath();
        ctx.strokeStyle="#000000";
        ctx.lineWidth = 1;
        ctx.moveTo(30,y+30);
        ctx.lineTo(+width+30, y+30);
        ctx.stroke();
    }
    if(document.querySelector('#A').checked){
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(30, 33);
        ctx.lineTo(+width+30, 33);
        ctx.stroke();
    }
    if(document.querySelector('#B').checked){
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(+width + 27, 30);
        ctx.lineTo(+width + 27, +heigth + 30);
        ctx.stroke();
    }
    if(document.querySelector('#C').checked){
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(30, +heigth + 27);
        ctx.lineTo(+width+30, +heigth + 27);
        ctx.stroke();
    }
    if(document.querySelector('#D').checked){
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(33, 30);
        ctx.lineTo(33, +heigth+30);
        ctx.stroke();
    }
    if(document.querySelector('#moi-form').value === 'Круглая'){
        var coordX = +document.querySelector('#coordinatesX').value;
        var coordY = +document.querySelector('#coordinatesY').value;
        var diametr = +document.querySelector('#diameter').value;
        ctx.save();
        ctx.beginPath();
        ctx.arc(+coordX+30, +coordY+30, diametr, 0, 2*Math.PI, true);
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
    if(document.querySelector('#moi-form').value === 'Прямоугольная'){
        var coordX = +document.querySelector('#coordinatesX').value;
        var coordY = +document.querySelector('#coordinatesY').value;
        var sideA = +document.querySelector('#side-a').value;
        var sideB = +document.querySelector('#side-b').value;
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.fillRect(+coordX + 30 -(sideA / 2), +coordY + 30 -(sideB / 2), sideA, sideB);
        ctx.strokeRect(+coordX + 30 -(sideA / 2), +coordY + 30 -(sideB / 2), sideA, sideB);

    }
    if(document.querySelector('#moi-form').value === 'Эллипс'){
        var coordX = +document.querySelector('#coordinatesX').value;
        var coordY = +document.querySelector('#coordinatesY').value;
        var lots = +document.querySelector('#lots').value;
        var sal = +document.querySelector('#sal').value;
        ctx.save();
        ctx.beginPath();
        ctx.translate(+coordX + 30, +coordY + 30);
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.scale(lots / sal, 1);
        ctx.arc( 0, 0, sal, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
    if(document.querySelectorAll('.last').length !== 0){
        var mass = document.querySelectorAll('.last');
        mass.forEach(function(item){
            var inputX = item.querySelector('.inputX').value;
            var inputY = item.querySelector('.inputY').value;
            var inputD = item.querySelector('.inputD').value;
            ctx.save();
            ctx.beginPath();
            ctx.arc(+inputX+30, +inputY+30, inputD, 0, 2*Math.PI, true);
            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.closePath();
        });
    }
}
var count;
function addDop(){
    var dopChild = $('#dopChild');
    count = Number($('.last').last().find('td:first-child ').text());
    count += 1;
    dopChild.append("<tr class='last'><td>"+ count +"</td><td><input class='inputX form-control'></td><td><input class='inputY form-control'></td><td><input class='inputD form-control'></td></tr></table>");
}
function drop(){
    var elem = document.getElementsByClassName('last');
    var parent = document.querySelector('#dopChild');
    parent.removeChild(elem[elem.length - 1]);
}