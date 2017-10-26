'use strict';

var ctx;
var width;
var heigth;
window.onload = function(){
    var canvas = document.getElementById('canvas');
    if(!document.querySelector('#moi-form').value){
        document.querySelector('#hid').classList.add('hidden');
    }
    // Проверяем понимает ли браузер canvas
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    }
    canvas.setAttribute('width', 1300);
    canvas.setAttribute('height', 700);
    start();
    document.querySelector('#draw').onclick = function(){
        $('.error').empty();
        var diametr = $('#diameter').val();
        var x = $('#coordinatesX').val();
        var y = $('#coordinatesY').val();
        var width = $('#width').val();
        var height = $('#depth').val();
        if(validateDrow() !== false){
            draw();
        }
    };
    $('#width').change(function() {
        if(validateDrow() !== false){
            draw();
        }
    });
    $('#depth').change(function() {
        if(validateDrow() !== false){
            draw();
        }
    });
    $('.checkbox-inline').click(function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $('#splice1').change(function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $('#splice2').change(function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $('#coordinatesX').change(function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $('#coordinatesY').change(function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $('#diameter').change(function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $('#side-a').change(function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $('#side-b').change(function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $('#lots').change(function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $('#sal').change(function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $(document).on('change', '.inputX', function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $(document).on('change', '.inputY', function(){
        if(validateDrow() !== false){
            draw();
        }
    });
    $(document).on('change', '.inputD', function(){
        if(validateDrow() !== false){
            draw();
        }
    });


    document.querySelector('#moi-form').onchange = function(){
        if(!document.querySelector('#moi-form').value){
            document.querySelector('#hid').classList.add('hidden');
        }else{
            document.querySelector('#hid').classList.remove('hidden');
        }
        if(document.querySelector('#moi-form').value === '2'){
            document.querySelector('.diameter-group').classList.add('hidden');
            $('.diameter-group').val('');
            document.querySelector('.lots-group').classList.add('hidden');
            $('.lots-group').val('');
            document.querySelector('.side-group').classList.remove('hidden');
            $('.side-group').val('');
        }
        if(document.querySelector('#moi-form').value === '1'){
            document.querySelector('.side-group').classList.add('hidden');
            $('.side-group').val('');
            document.querySelector('.lots-group').classList.add('hidden');
            $('.lots-group').val('');
            document.querySelector('.diameter-group').classList.remove('hidden');
            $('.diameter-group').val('');
        }
        if(document.querySelector('#moi-form').value === '3'){
            document.querySelector('.side-group').classList.add('hidden');
            $('.side-group').val('');
            document.querySelector('.diameter-group').classList.add('hidden');
            $('.diameter-group').val('');
            document.querySelector('.lots-group').classList.remove('hidden');
            $('.lots-group').val('');
        }
    };
    $('#profile-option').change(function(){
        if($(this).val() === '0'){
            $('#gluing').addClass('hidden');
        }else{
            $('#gluing').removeClass('hidden');
        }
    });
};

function validateDrow(){
    $('.error').empty();
    $('.info').empty();
    var width = +$('#width').val();
    var splice1 = +$('#splice1').val();
    var height = +$('#depth').val();
    var splice2 = +$('#splice2').val();
    var flag = true;
    //горизонтальный стык
    if(splice1 > width){
        $('.error').append(
            '<div class="alert alert-danger">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
                '<strong>Ошибка!</strong> Горизонтальный стык выходит за рамки!' +
            '</div>'
        );
        flag =  false;
    }else if(splice2 > height){
        $('.error').append(
            '<div class="alert alert-danger">' +
            '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
            '<strong>Ошибка!</strong> Вертикальный стык выходит за рамки!' +
            '</div>'
        );
        flag =  false;
    }

    if($('#moi-form').val() === '1'){
        var cordX = +$('#coordinatesX').val();
        var cordY = +$('#coordinatesY').val();
        var D = +$('#diameter').val();
        if((cordX + D/2) > width || (cordY + D/2) > height || cordY < D/2){
            $('.error').append(
                '<div class="alert alert-danger">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
                '<strong>Ошибка!</strong> Мойка выходит за рамки!' +
                '</div>'
            );
            flag =  false;
        }
    }

    if($('#moi-form').val() === '2'){
        var cordX = +$('#coordinatesX').val();
        var cordY = +$('#coordinatesY').val();
        var sideA = +$('#side-a').val();
        var sideB = +$('#side-b').val();
        if((cordX + sideA/2) > width || (cordY + sideB/2) > height || cordY < sideB/2){
            $('.error').append(
                '<div class="alert alert-danger">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
                '<strong>Ошибка!</strong> Мойка выходит за рамки!' +
                '</div>'
            );
            flag =  false;
        }
    }


    if($('#moi-form').val() === '3'){
        var cordX = +$('#coordinatesX').val();
        var cordY = +$('#coordinatesY').val();
        var lots = +$('#lots').val();
        var sal = +$('#sal').val();
        if((cordX + lots) > width || (cordY + sal) > height || cordY < sal){
            $('.error').append(
                '<div class="alert alert-danger">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
                '<strong>Ошибка!</strong> Мойка выходит за рамки!' +
                '</div>'
            );
            flag =  false;
        }
    }
    if(document.querySelectorAll('.last').length !== 0) {
        var mass = document.querySelectorAll('.last');
        mass.forEach(function (item) {
            var inputX = +item.querySelector('.inputX').value;
            var inputY = +item.querySelector('.inputY').value;
            var inputD = +item.querySelector('.inputD').value;
            if((inputX + inputD/2) > width || (inputY + inputD/2) > height || inputY < inputD/2){
                $('.error').append(
                    '<div class="alert alert-danger">' +
                    '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
                    '<strong>Ошибка!</strong> Доп. отверстие выходит за рамки!' +
                    '</div>'
                );
                flag = false;
            }
        });
    }
    return flag;
}

function start(){
    heigth = 600;
    width = 1200;
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "#ff307c";
    ctx.font = "bold 30px Helvetica";
    ctx.fillText("A", +width/2, 28);
    ctx.fillText("B", +width+30, +heigth/2);
    ctx.fillText("C", +width/2, +heigth + 60);
    ctx.fillText("D", 0, +heigth/2);
    ctx.restore();

    //нижняя состема координат
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle="#078eff";
    ctx.lineWidth = 1;
    ctx.moveTo(0, heigth+ 30);
    ctx.lineTo(width + 70, heigth+30);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();

    //верхняя состема координат
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle="#078eff";
    ctx.lineWidth = 1;
    ctx.moveTo(30, heigth + 60);
    ctx.lineTo(30, 0);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();

    //надпись длины и ширины
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.font = "bold 15px Helvetica";
    ctx.lineWidth = 1;
    ctx.fillText($('#width').val() + " мм.", width, heigth + 45);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();

    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.font = "bold 15px Helvetica";
    ctx.lineWidth = 1;
    ctx.translate(25, 60);
    ctx.rotate(270*Math.PI/180);
    ctx.fillText($('#depth').val() + " мм.", 0, 0);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();

    ctx.beginPath();
    ctx.save();
    ctx.fillStyle="#cbcbcb";
    ctx.fillRect(30, 30, width, heigth);
    ctx.fillStyle = "#000000";
    ctx.strokeRect(30, 30, width, heigth);
    ctx.restore();
}

function draw(){
    ctx.clearRect(0, 0, 1300, 700);
    width = +document.getElementById('width').value;
    heigth = +document.getElementById('depth').value;
    var procX = 50;
    var procY = 50;
    var count = 0;
    var w = width;
    var h = heigth;
    if(width > 1200){
        count = 0;
        while(width > 1200){
            width = width - 1;
            count +=1;
        }

        procX = count * 100 / w;
        h = heigth;
        heigth = ((100-procX) * heigth)/100;
        procY = heigth * 100 / h;
    }
    if(heigth > 600){
        count = 0;
        while(heigth > 600){
            heigth = heigth - 1;
            count +=1;
        }

        procX = count * 100 / h;
        width = ((100-procX) * width)/100;
        procX = width * 100 / h;
    }

    //нижняя состема координат
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle="#078eff";
    ctx.lineWidth = 1;
    ctx.moveTo(0, heigth+ 30);
    ctx.lineTo(width + 70, heigth+30);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();

    //верхняя состема координат
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle="#078eff";
    ctx.lineWidth = 1;
    ctx.moveTo(30, heigth + 60);
    ctx.lineTo(30, 0);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();

    //надпись длины и ширины
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.font = "bold 15px Helvetica";
    ctx.lineWidth = 1;
    ctx.fillText($('#width').val() + " мм.", width, heigth + 45);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();

    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.font = "bold 15px Helvetica";
    ctx.lineWidth = 1;
    ctx.translate(25, 60);
    ctx.rotate(270*Math.PI/180);
    ctx.fillText($('#depth').val() + " мм.", 0, 0);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();

    ctx.beginPath();
    ctx.save();
    ctx.fillStyle="#cbcbcb";
    ctx.fillRect(30, 30, width, heigth);
    ctx.fillStyle = "#000000";
    ctx.strokeRect(30, 30, width, heigth);
    ctx.restore();

    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "#ff307c";
    ctx.font = "bold 30px Helvetica";
    ctx.fillText("A", +width/2, 28);
    ctx.fillText("B", +width+30, +heigth/2);
    ctx.fillText("C", +width/2, +heigth + 60);
    ctx.fillText("D", 0, +heigth/2);
    ctx.restore();
    ctx.closePath();

    ctx.beginPath();
    ctx.save();
    ctx.fillStyle="#cbcbcb";
    ctx.fillRect(30, 30, width, heigth);
    ctx.fillStyle = "#000000";
    ctx.strokeRect(30, 30, width, heigth);
    ctx.closePath();
    var x = +document.getElementById('splice1').value || 0;
    var y = +document.getElementById('splice2').value || 0;
    if(x > 0){
        procX = x * 100 / w;
        x = Math.round(procX * width / 100);
        var he = 0;
        for(var i = 1; i < heigth + 60; i++){
            if((he+5)+30 < heigth + 30){
                ctx.beginPath();
                ctx.save();
                ctx.strokeStyle="#000000";
                ctx.lineWidth = 0.5;
                ctx.moveTo(x+30, he+30);
                ctx.lineTo(x+30, (he+5)+30);
                ctx.stroke();
                ctx.restore();
                ctx.closePath();
                he += 10;
            }else if((he+3)+30 < heigth + 60){
                ctx.beginPath();
                ctx.save();
                ctx.strokeStyle="#078eff";
                ctx.lineWidth = 1;
                ctx.moveTo(x+30, he+30);
                ctx.lineTo(x+30, (he+10)+30);
                ctx.stroke();
                ctx.restore();
                ctx.closePath();
                he += 10;
            }
        }
        ctx.beginPath();
        ctx.save();
        ctx.moveTo(30, heigth + 45);
        ctx.lineTo(x+30,heigth + 45);
        ctx.fillStyle="#000000";
        ctx.font = "italic 11pt Arial";
        ctx.fillStyle = "#078eff";
        ctx.fillText("стык 1 по X, "+$('#splice1').val()+" мм.", (x-30)/2, heigth + 43);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
    if(y > 0){
        procY = y * 100 / h;
        var n = y;
        y = Math.round(procY * heigth / 100);
        y = Math.round(y * 100)/heigth;
        y = 100 - y;
        y = Math.round((y*heigth)/100);
        var he = 0;
        for(var i = 1; i < width+30; i++) {
            if ((he + 5) + 30 < width+60) {
                ctx.beginPath();
                ctx.save();
                ctx.strokeStyle="#000000";
                ctx.lineWidth = 1;
                ctx.moveTo(he, y+30);
                ctx.lineTo(he+5, y+30);
                ctx.stroke();
                ctx.restore();
                ctx.closePath();
                he += 10;
            }
            ctx.beginPath();
            ctx.save();
            ctx.strokeStyle="#078eff";
            ctx.lineWidth = 1;
            ctx.moveTo(0, y+30);
            ctx.lineTo(30, y+30);
            ctx.stroke();
            ctx.restore();
            ctx.closePath();
        }
        ctx.beginPath();
        ctx.save();
        ctx.moveTo(15, heigth + 30);
        ctx.lineTo(15, y + 30);
        ctx.save();
        ctx.translate(13, (heigth + y + 60)/2);
        ctx.rotate(270*Math.PI/180);
        ctx.font = "italic 11pt Arial";
        ctx.fillStyle = "#078eff";
        ctx.fillText("cтык 2 по Y, "+$('#splice2').val()+" мм.", 0, 0);
        ctx.restore();
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
    if(document.querySelector('#A').checked){
        ctx.beginPath();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(30, 33);
        ctx.lineTo(width+30, 33);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
    if(document.querySelector('#B').checked){
        ctx.beginPath();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(width+27, 30);
        ctx.lineTo(width+27, heigth+30);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
    if(document.querySelector('#C').checked){
        ctx.beginPath();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(30, heigth+27);
        ctx.lineTo(width+30, heigth+27);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
    if(document.querySelector('#D').checked){
        ctx.beginPath();
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(33, 30);
        ctx.lineTo(33, heigth+30);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
    if(document.querySelector('#moi-form').value === '1'){
        var coordX = +document.querySelector('#coordinatesX').value;
        var coordY = +document.querySelector('#coordinatesY').value;
        var coorXOut = coordX;
        var coorYOut = coordY;
        var diametr = +document.querySelector('#diameter').value;
        procX = coordX * 100 / w;
        procY = coordY * 100 / h;
        coordX = Math.round(procX * width / 100);
        coordY = Math.round(procY * heigth / 100);
        var t = coordY;
        //Изменение системы координат
        coordY = Math.round(coordY * 100)/heigth;
        coordY = 100 - coordY;
        coordY = Math.round((coordY*heigth)/100);

        var proc = heigth * 100 / h;
        diametr = Math.round(proc * diametr / 100);
        ctx.save();
        ctx.beginPath();
        ctx.arc(+coordX+30, +coordY+30, diametr/2, 0, 2*Math.PI, true);
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
        //Подпись координа
        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.font = "11px Helvetica";
        ctx.lineWidth = 1;
        ctx.fillText("D("+diametr+")"+coorXOut+";"+coorYOut, coordX , coordY+15);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
        //линии из центра
        var he = 0;
        for(var i = 1; i < width+30; i++) {
            if(he + 30 < coordX + 30){
                ctx.beginPath();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.moveTo(he + 30, coordY + 30);
                ctx.lineTo((he +3) + 30, coordY + 30);
                ctx.stroke();
                ctx.closePath();
                he += 6;

            }
        }
        he = 0;
        for(var i = 1; i < width+30; i++) {
            if(he + 3 <= t){
                ctx.beginPath();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.moveTo(coordX + 30, heigth + 30 - he);
                ctx.lineTo(coordX + 30, heigth + 30 - (he + 3));
                ctx.stroke();
                ctx.closePath();
                he += 6;
            }
        }
    }
    if(document.querySelector('#moi-form').value === '2'){
        var coordX = +document.querySelector('#coordinatesX').value;
        var coordY = +document.querySelector('#coordinatesY').value;
        var coorXOut = coordX;
        var coorYOut = coordY;
        var sideA = +document.querySelector('#side-a').value;
        var sideB = +document.querySelector('#side-b').value;
        procX = coordX * 100 / w;
        procY = coordY * 100 / h;
        coordX = Math.round(procX * width / 100);
        coordY = Math.round(procY * heigth / 100);
        var t = coordY;
        //Изменение системы координат
        coordY = Math.round(coordY * 100)/heigth;
        coordY = 100 - coordY;
        coordY = Math.round((coordY*heigth)/100);

        procX = sideA * 100 / w;
        procY = sideB * 100 / h;
        sideA = Math.round(procX * width / 100);
        sideB = Math.round(procY * heigth / 100);
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.fillRect(+coordX + 30 -(sideA / 2), +coordY + 30 -(sideB / 2), sideA, sideB);
        ctx.strokeRect(+coordX + 30 -(sideA / 2), +coordY + 30 -(sideB / 2), sideA, sideB);
        //Подпись координа
        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.font = "11px Helvetica";
        ctx.lineWidth = 1;
        ctx.fillText("("+sideA+"x"+sideB+")"+coorXOut+";"+coorYOut, coordX, coordY+15);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
        //линии из центра
        var he = 0;
        for(var i = 1; i < width+30; i++) {
            if(he + 30 < coordX + 30){
                ctx.beginPath();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.moveTo(he + 30, coordY + 30);
                ctx.lineTo((he +3) + 30, coordY + 30);
                ctx.stroke();
                ctx.closePath();
                he += 6;

            }
        }
        he = 0;
        for(var i = 1; i < width+30; i++) {
            if(he + 3 <= t){
                ctx.beginPath();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.moveTo(coordX + 30, heigth + 30 - he);
                ctx.lineTo(coordX + 30, heigth + 30 - (he + 3));
                ctx.stroke();
                ctx.closePath();
                he += 6;
            }
        }


    }
    if(document.querySelector('#moi-form').value === '3'){
        var coordX = +document.querySelector('#coordinatesX').value;
        var coordY = +document.querySelector('#coordinatesY').value;
        var coorXOut = coordX;
        var coorYOut = coordY;
        var lots = +document.querySelector('#lots').value;
        var sal = +document.querySelector('#sal').value;
        procX = coordX * 100 / w;
        procY = coordY * 100 / h;
        coordX = Math.round(procX * width / 100);
        coordY = Math.round(procY * heigth / 100);
        var t = coordY;
        //Изменение системы координат
        coordY = Math.round(coordY * 100)/heigth;
        coordY = 100 - coordY;
        coordY = Math.round((coordY*heigth)/100);

        procX = lots * 100 / w;
        procY = sal * 100 / h;
        lots = Math.round(procX * width / 100);
        sal = Math.round(procY * heigth / 100);
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
        //Подпись координа
        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.font = "11px Helvetica";
        ctx.lineWidth = 1;
        ctx.fillText("a("+lots+") b("+sal+") "+coorXOut+";"+coorYOut, coordX, coordY+15);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
        //линии из центра
        var he = 0;
        for(var i = 1; i < width+30; i++) {
            if(he + 30 < coordX + 30){
                ctx.beginPath();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.moveTo(he + 30, coordY + 30);
                ctx.lineTo((he +3) + 30, coordY + 30);
                ctx.stroke();
                ctx.closePath();
                he += 6;

            }
        }
        he = 0;
        for(var i = 1; i < width+30; i++) {
            if(he + 3 <= t){
                ctx.beginPath();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.moveTo(coordX + 30, heigth + 30 - he);
                ctx.lineTo(coordX + 30, heigth + 30 - (he + 3));
                ctx.stroke();
                ctx.closePath();
                he += 6;
            }
        }

    }
    if(document.querySelectorAll('.last').length !== 0){
        var mass = document.querySelectorAll('.last');
        mass.forEach(function(item){
            var inputX = item.querySelector('.inputX').value;
            var inputY = item.querySelector('.inputY').value;
            var inputD = item.querySelector('.inputD').value;
            var d = inputD;
            var coorXOut = inputX;
            var coorYOut = inputY;
            procX = inputX * 100 / w;
            procY = inputY * 100 / h;
            inputX = Math.round(procX * width / 100);
            inputY = Math.round(procY * heigth / 100);
            var t = inputY;
            //Изменение системы координат
            inputY = Math.round(inputY * 100)/heigth;
            inputY = 100 - inputY;
            inputY = Math.round((inputY*heigth)/100);

            var proc = heigth * 100 / h;
            inputD = Math.round(proc * inputD / 100);
            ctx.save();
            ctx.beginPath();
            ctx.arc(+inputX+30, +inputY+30, inputD/2, 0, 2*Math.PI, true);
            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.closePath();
            //Подпись координа
            ctx.beginPath();
            ctx.save();
            ctx.fillStyle = "#000";
            ctx.font = "11px Helvetica";
            ctx.lineWidth = 1;
            ctx.fillText("d("+d+")"+coorXOut+";"+coorYOut, inputX, inputY+15);
            ctx.stroke();
            ctx.restore();
            ctx.closePath();
            //линии из центра
            //линии из центра
            var he = 0;
            for(var i = 1; i < width+30; i++) {
                if(he + 30 < inputX + 30){
                    ctx.beginPath();
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1;
                    ctx.moveTo(he + 30, inputY + 30);
                    ctx.lineTo((he +3) + 30, inputY + 30);
                    ctx.stroke();
                    ctx.closePath();
                    he += 6;
                }
            }
            he = 0;
            for(var i = 1; i < width+30; i++) {
                if(he + 3 <= t){
                    ctx.beginPath();
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1;
                    ctx.moveTo(inputX + 30, heigth + 30 - he);
                    ctx.lineTo(inputX + 30, heigth + 30 - (he + 3));
                    ctx.stroke();
                    ctx.closePath();
                    he += 6;
                }
            }
        });
    }
    var coorder = {};
    coorder.width = width;
    coorder.heigth = heigth;
    console.log(width, heigth);
    return coorder;
}

var count;
function addDop(){
    var dopChild = $('#dopChild');
    count = Number($('.last').last().find('td:first-child ').text());
    count += 1;
    dopChild.append("<tr class='last'><td>"+ count +"</td><td><input class='inputX form-control'></td><td><input class='inputY form-control'></td><td><input class='inputD form-control'></td><td class='hidden'><input class='dopId hidden'></td></tr></table>");
}
function drop(){
    var elem = document.getElementsByClassName('last');
    var parent = document.querySelector('#dopChild');
    parent.removeChild(elem[elem.length - 1]);
}

$(function(){

    var width,              //Ширина
        heigth,             //Высота
        section,            //Вариант профиля
        bottomGlueWidth,    //ширина нижней подклейки
        sectionSide,        //Стороны профиля
        sectionHeight,      //Высота профиля
        joinVertical,       //Расположение стыка 1, мм.
        joinHorizontal,     //Расположение стыка 2, мм.
                            //Параметры сантехники и отверстия
        moiForm,
        coordinatesX,
        coordinatesY,
        bottomMounting,
                            //для круга
        diameter,
                            //Для Прямоугольника
        sideA,
        sideB,
                            //Для эллипса
        lots,
        sal;
    $('#save').click(function(){
        var tab = document.querySelectorAll('.last');
        var mas = [];
        tab.forEach(function(item){
            var dop = {
                dopId:  item.querySelector('.dopId').value,
                inputX: item.querySelector('.inputX').value,
                inputY: item.querySelector('.inputY').value,
                inputD: item.querySelector('.inputD').value
            };
            mas.push(dop);
        });

        var data = {
            name:               $('#topName').val(),
            comments:           $('#comments').val(),
            width :             $('#width').val(),
            heigth :            $('#depth').val(),
            section :           $('#profile-option').val(),
            bottomGlueWidth :   $('#gluing-width').val(),
            sectionHeight :     $('#profile-heigth').val(),
            joinVertical :      $('#splice1').val(),
            joinHorizontal :    $('#splice2').val(),
            coordinatesX:       $('#coordinatesX').val(),
            coordinatesY:       $('#coordinatesY').val(),
            bottomMounting:     $('input[name=bottomMounting]:checked').val() || 0,
            diameter:           $('#diameter').val(),
            moiForm:            $('#moi-form').val(),
            sideA:              $('#side-a').val(),
            sideB:              $('#side-b').val(),
            lots:               $('#lots').val(),
            sal:                $('#sal').val(),
            dop:                JSON.stringify(mas),
            price:              $('.price h2').text().replace(/[^0-9]/gim,''),
            itemId:             $('#material').val(),
            counterTopId:       getCookie('refere') || 0,
            moiFormId:          $('#idFormMoi').val()
        };
        data.sectionSide = '';
        $('input[name=sideProfile]:checked').each(function(){
            data.sectionSide += ($(this).val());
        });
        $.ajax({
           url: '/',
           type: 'PUT',
           data: data,
           success: function(data){
               Snackbar.show({
                   text: 'Данные успешно сохраненны!',
                   textColor: '#52ce80',
                   pos: 'bottom-left',
                   actionText: null
               });
           },
           error: function(data){
               Snackbar.show({
                   text: 'Произошла ошибка',
                   textColor: '#d81616',
                   pos: 'bottom-left',
                   actionText: null
               });
           }
        });
    });
});

//select выбор материала
var select;
var selectMas = [];
var items = $.ajax({
    url: '/selectitems',
    type: 'GET',
    success: function(data){
        select ='<option><input class="type-search" type="text" /></option>';
        data.forEach(function (item) {
            var obj ={};
            if(item.ITEM_TYPES_ID === 1){
                obj.id = item.ITEMID;
                obj.text = item.ITEMNAME;
                selectMas.push(obj);
                select += '<option value="'+ item.ITEMID +'">'+ item.ITEMNAME +'</option>';
            }
        });
    },
    error: function (err) {
        console.log(err);
    }
});

$(function(){
    items.then(function(data){
        // $('#material').append(
        //     select
        // );
        $('#material').select2({
            data: selectMas,
            minimumResultsForSearch: 6
        })
    });
});
//END select выбор материала

//Выбор высоты профиля исходя из типа материала
$(function(){
    $('.input-group').on('change', '#material', function(){
        var inputSelect;
        var elem;
        var itemid = $(this).val();
        items.then(function(data){
            data.forEach(function(item){
                if(item.ITEMID == itemid){
                    inputSelect = item;
                }
            });
            if(inputSelect.ITEMWIDTH < +$('#width').val() || inputSelect.ITEMHEIGHT < +$('#depth').val()){
                $('.hidwidth').removeClass('hidden')
            }else{
                $('.hidwidth').addClass('hidden')
            }
            $('.info').empty();
            $('.info').append(
                '<div class="alert alert-info">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
                '<strong>Внимание!</strong> Максимальная ширина столешницы без стыка не более '+inputSelect.ITEMWIDTH+' мм.' +
                '</div>'
            );
            $('.warning').empty();
            $('.warning').append(
                '<div class="alert alert-warning">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
                '<p>Материал: '+inputSelect.ITEMNAME+', Высота: '+inputSelect.ITEMHEIGHT+' Ширина: '+inputSelect.ITEMWIDTH+', Толщина: '+inputSelect.ITEMTHIN+'</p>' +
                '</div>'
            );
            if($('#profile-option').val() === '1') {
                elem =
                    '<div class="input-group" style="width: 150px;">'+
                    '<select class="form-control profile-heigth" id="profile-heigth">' +
                    '<option value="'+((inputSelect.ITEMTHIN * 2) + 20)+'">'+((inputSelect.ITEMTHIN * 2) + 20)+'</option>' +
                    '<option value="'+((inputSelect.ITEMTHIN * 2) + 30)+'">'+((inputSelect.ITEMTHIN * 2) + 30)+'</option>' +
                    '<option value="'+((inputSelect.ITEMTHIN * 2) + 40)+'">'+((inputSelect.ITEMTHIN * 2) + 40)+'</option>' +
                    '<option value="'+((inputSelect.ITEMTHIN * 2) + 60)+'">'+((inputSelect.ITEMTHIN * 2) + 60)+'</option>' +
                    '</select>'+
                    '</div>';
            }
            if($('#profile-option').val() === '0') {
                elem =
                    '<div class="input-group" style="width: 150px;">'+
                    '<select class="form-control  profile-heigth" id="profile-heigth">' +
                    '<option value="'+(inputSelect.ITEMTHIN + 20)+'">'+(inputSelect.ITEMTHIN + 20)+'</option>' +
                    '<option value="'+(inputSelect.ITEMTHIN + 30)+'">'+(inputSelect.ITEMTHIN + 30)+'</option>' +
                    '<option value="'+(inputSelect.ITEMTHIN + 40)+'">'+(inputSelect.ITEMTHIN + 40)+'</option>' +
                    '<option value="'+(inputSelect.ITEMTHIN + 60)+'">'+(inputSelect.ITEMTHIN + 60)+'</option>' +
                    '</select>'+
                    '</div>';
            }
            $('#profile-heigth').remove();
            $('#sel').append(elem);
        });
    });

    $('#width').change(function() {
        var inputSelect;
        var itemid = $('#material').val();
        var that = $(this);
        items.then(function (data) {
            data.forEach(function (item) {
                if (item.ITEMID == itemid) {
                    inputSelect = item;
                }
            });
            if(inputSelect.ITEMWIDTH < +$('#width').val() || inputSelect.ITEMHEIGHT < +$('#depth').val()){
                $('.hidwidth').removeClass('hidden')
            }else{
                $('.hidwidth').addClass('hidden')
            }
            if(inputSelect){
                if (inputSelect.ITEMWIDTH < that.val()) {
                    $('#splice1').val(inputSelect.ITEMWIDTH);
                    draw();
                }else{
                    $('#splice1').val(0);
                    draw();
                }
            }
        });
    });

    $('#depth').change(function() {
        var inputSelect;
        var itemid = $('#material').val();
        var that = $(this);
        items.then(function (data) {
            data.forEach(function (item) {
                if (item.ITEMID == itemid) {
                    inputSelect = item;
                }
            });
            if(inputSelect.ITEMWIDTH < +$('#width').val() || inputSelect.ITEMHEIGHT < +$('#depth').val()){
                $('.hidwidth').removeClass('hidden')
            }else{
                $('.hidwidth').addClass('hidden')
            }
            if(inputSelect){
                if (inputSelect.ITEMHEIGHT < that.val()) {
                    $('#splice2').val(inputSelect.ITEMHEIGHT);
                    draw();
                }else{
                    $('#splice2').val(0);
                    draw();
                }
            }
        });
    });


    $('.input-group').on('change','#profile-option', function(){
        var elem;
        var inputSelect;
        var itemid = $('#material').val();
        if(itemid){
            items.then(function(data){
                data.forEach(function(item){
                    if(item.ITEMID == itemid){
                        inputSelect = item;
                    }
                });
                if($('#profile-option').val() === '1') {
                    elem =
                        '<select class="form-control profile-heigth" id="profile-heigth">' +
                        '<option value="'+((inputSelect.ITEMTHIN * 2) + 20)+'">'+((inputSelect.ITEMTHIN * 2) + 20)+'</option>' +
                        '<option value="'+((inputSelect.ITEMTHIN * 2) + 30)+'">'+((inputSelect.ITEMTHIN * 2) + 30)+'</option>' +
                        '<option value="'+((inputSelect.ITEMTHIN * 2) + 40)+'">'+((inputSelect.ITEMTHIN * 2) + 40)+'</option>' +
                        '<option value="'+((inputSelect.ITEMTHIN * 2) + 60)+'">'+((inputSelect.ITEMTHIN * 2) + 60)+'</option>' +
                        '</select>';
                }
                if($('#profile-option').val() === '0') {
                    elem =
                        '<select class="form-control profile-heigth" id="profile-heigth">' +
                        '<option value="'+(inputSelect.ITEMTHIN + 20)+'">'+(inputSelect.ITEMTHIN + 20)+'</option>' +
                        '<option value="'+(inputSelect.ITEMTHIN + 30)+'">'+(inputSelect.ITEMTHIN + 30)+'</option>' +
                        '<option value="'+(inputSelect.ITEMTHIN + 40)+'">'+(inputSelect.ITEMTHIN + 40)+'</option>' +
                        '<option value="'+(inputSelect.ITEMTHIN + 60)+'">'+(inputSelect.ITEMTHIN + 60)+'</option>' +
                        '</select>';
                }
                $('#profile-heigth').remove();
                $('#sel').append(elem);
            });
        }
    });
});
//END Выбор высоты профиля исходя из типа материала


//при изменении варианта профиля его высота должна пресчитаться

$(function(){

});

//END при изменении варианта профиля его высота должна пресчитаться

//Обработка изменения селекта с готовыми решениями

function getCookie(name) {
    var cookie = " " + document.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = cookie.indexOf(";", offset);
            if (end == -1) {
                end = cookie.length;
            }
            setStr = unescape(cookie.substring(offset, end));
        }
    }
    return(setStr);
}

$(function(){
    $('#ready').on('change', function(){
        var data = $(this).val() || 0;
        $('.last').remove();
        $('input[name=sideProfile]').prop('checked', false);
        var asyncData = $.ajax({
            url: '/draw',
            type: 'POST',
            data: {id: data},
            success: function(data){
            },
            error: function(err){
                console.log(err);
            }
        });
        asyncData.then(function(Asdata){
            if(Asdata.length){
                var side = Asdata[0].SECTION_SIDE.split('');
                $('#topName').val(Asdata[0].TOP_NAME);
                $('#material').val(Asdata[0].ITEMID).change();
                $('#profile-option').val(Asdata[0].SECTION).change();
                $('#width').val(Asdata[0].WIDTH);
                $('#depth').val(Asdata[0].HEIGTH);

                $('#gluing-width').val(Asdata[0].BOTTOM_GLUE_WIDTH);

                setTimeout(function(){
                    $('#profile-heigth').val(Asdata[0].SECTION_HEIGHT);
                },10);

                $('#comments').val(Asdata[0].COMMENTS);
                side.forEach(function(item){
                    $("input:checkbox[value='"+item+"']").prop("checked", "checked");
                });
                $('#splice1').val(Asdata[0].JOINT_VERTICAL);
                $('#splice2').val(Asdata[0].JOINT_HORIZONTAL);
                $('.price').find('h2').text(Asdata[0].PRICE).priceFormat({
                    prefix: '',
                    centsLimit: 0,
                    suffix: ' руб.',
                    thousandsSeparator: ' '
                });
                $('.pricedoubl').find('h2').text(Asdata[0].PRICE).priceFormat({
                    prefix: '',
                    centsLimit: 0,
                    suffix: ' руб.',
                    thousandsSeparator: ' '
                });
                //$("#profile-heigth option[value=" + Asdata[0].SECTION_HEIGHT + "]").attr('selected', 'true').text(Asdata[0].SECTION_HEIGHT);
                Asdata[1].forEach(function(item){
                    if(item.BOTTOM_MOUNT === 0 || item.BOTTOM_MOUNT === 1){
                        $('#idFormMoi').val(item.COUNTERTOPS_ADDON_ID);
                        if(item.ADDON_TYPE_ID === 1){
                            $("#moi-form [value='1']").attr("selected", "selected");
                            $('#diameter').val(item.ADDON_A);
                        }
                        if(item.ADDON_TYPE_ID == 2){
                            $("#moi-form [value='2']").attr("selected", "selected");
                            $('#side-a').val(item.ADDON_A);
                            $('#side-b').val(item.ADDON_B);
                        }
                        if(item.ADDON_TYPE_ID === 3){
                            $("#moi-form [value='3']").attr("selected", "selected");
                            $('#lots').val(item.ADDON_A);
                            $('#sal').val(item.ADDON_B);
                        }
                        $('#moi-form').val(item.ADDON_TYPE_ID).change();
                        $('#coordinatesX').val(item.ADDON_X);
                        $('#coordinatesY').val(item.ADDON_Y);
                        $('input[name=bottomMounting]').prop("checked", "checked");
                    }
                    if(item.ADDON_TYPE_ID === 9999){
                        $('#dop').click();
                        $('.inputX').last().val(item.ADDON_X);
                        $('.inputY').last().val(item.ADDON_Y);
                        $('.inputD').last().val(item.ADDON_A);
                        $('.dopId').last().val(item.COUNTERTOPS_ADDON_ID);
                    }
                });
                $('#draw').click();
            }
        });
    });
});

//расчет
$(function(){
    $('#calc').click(function(){
        $('.error').empty();
        if($('#material').val() === ''){
            $('.error').append(
                '<div class="alert alert-danger">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
                '<strong>Ошибка!</strong> Вы не выбрали материал!' +
                '</div>'
            );
            return false;
        }
        $('.parametr').remove();
        $('#parametr').append('<h2 class="h2 parametr"></h2>');
        var sideA= 0, sideB= 0, sideC= 0, sideD= 0 ;
        var profileLenght = 0;
        var width = +$('#width').val();
        var height = +$('#depth').val();
        var perimeter = (width + height)*2;
        var adjacentCut = 0;
        var materialQty;
        $('input[name=sideProfile]:checked').each(function(){
            switch($(this).val()){
                case 'A':
                    sideA  = +$('#width').val();
                    break;
                case 'B':
                    sideB = +$('#depth').val();
                    break;
                case 'C':
                    sideC = +$('#width').val();
                    break;
                case 'D':
                    sideD = +$('#depth').val();
                    break;
            }
        });
        if(sideA){
            profileLenght += +width;
        }
        if(sideB){
            profileLenght += +height;
        }
        if(sideC){
            profileLenght += +width;
        }
        if(sideD){
            profileLenght += +height;
        }
        if(profileLenght > 0){
            var glueingPerimeter = (profileLenght + +$('#profile-heigth').val()) * 2;
        }else{
            var glueingPerimeter = 0;
        }
        if(sideA && sideB){
            adjacentCut += +$('#profile-heigth').val()
        }
        if(sideC && sideB){
            adjacentCut += +$('#profile-heigth').val()
        }
        if(sideC && sideD){
            adjacentCut += +$('#profile-heigth').val()
        }
        if(sideA && sideD){
            adjacentCut += +$('#profile-heigth').val()
        }

        if($('#profile-option').val() === '0'){
            materialQty = ( (profileLenght * +$('#profile-heigth').val()) + (width * height) )/1000000 * 1.5;
            materialQty = materialQty.toFixed(2);
        }else{
            materialQty =( (width * height) + (profileLenght * +$('#profile-heigth').val()) + ($('#gluing-width').val() * profileLenght )) / 1000000 * 1.5;
            materialQty = materialQty.toFixed(2);
        }

        var gidrorezCutQty;
        var gidrorezCutQty45;

        gidrorezCutQty= 0;
        gidrorezCutQty += (perimeter - (+sideA + +sideB + +sideC + +sideD));
        gidrorezCutQty += (glueingPerimeter / 2);
        gidrorezCutQty -= (adjacentCut * 2);

        gidrorezCutQty45 = ((sideA + sideB+ sideC+ sideD) + (glueingPerimeter / 2) + +adjacentCut*2);
        if($('#profile-option').val() === '1' && profileLenght > 0){
            gidrorezCutQty += (+$('#gluing-width').val() + +profileLenght );
            gidrorezCutQty += $('#gluing-width').val() * 2;
            gidrorezCutQty45 += +profileLenght * 2;
        }
        $('.last').each(function(){
            var D = $(this).find('.inputD ').val();
            gidrorezCutQty += 2 * Math.PI * (+D/2);
        });

        if($('#moi-form').val() === '1'){
            var D = $('#diameter').val();
            gidrorezCutQty += (2 * Math.PI * (+D/2));
        }

        if($('#moi-form').val() === '2'){
            gidrorezCutQty += (+$('#side-a').val() + +$('#side-b').val())*2;
        }

        if($('#moi-form').val() === '3'){
            gidrorezCutQty += Math.PI;
        }

        $('.parametr').append(
            '<div>Периметр столешницы: perimeter = '+ perimeter +'</div>'+
            '<div>Длина профиля: profileLenght = '+ profileLenght +'</div>'+
            '<div>Площадь материала: materialQty = '+ materialQty +'</div>' +
            '<div>gidrorezCutQty = '+ gidrorezCutQty +'</div>' +
            '<div>gidrorezCutQty45 = '+ gidrorezCutQty45 +'</div>' +
            '<div>glueingPerimeter = '+ glueingPerimeter +'</div>' +
            '<div>adjacentCut = '+ adjacentCut +'</div>'
        );

        gidrorezCutQty = gidrorezCutQty/1000;
        gidrorezCutQty45 = gidrorezCutQty45/1000;

        var _BomParams = $.ajax({
            url: '/selectbomparams',
            type: 'get',
            success: function(data){

            },
            error: function (err) {
                console.log(err);
            }
        });
        var bomType;
        var bomTypeKley;
        var spliceGlueQty;
        var profileGlueQty;
        var materialCost;
        var profileGlueCost;
        var spliceGlueCost;
        var profileCost;
        var gidrorezCutCost;
        var assemCost;
        var lowerAssemCost;
        var countertopCost;
        var profileHight;
        var profileWidht;

        if($('#profile-heigth').val() === 42 || $('#profile-heigth').val() === 50){
            profileHight = 30;
            profileWidht = 30;
        }
        if($('#profile-heigth').val() === 72 || $('#profile-heigth').val() === 82){
            profileHight = 60;
            profileWidht = 60;
        }
        if($('#profile-heigth').val() === 36 || $('#profile-heigth').val() === 41){
            profileHight = 30;
            profileWidht = 30;
        }
        if($('#profile-heigth').val() === 66 || $('#profile-heigth').val() === 71){
            profileHight = 60;
            profileWidht = 60;
        }
        if($('#profile-heigth').val() === 42 || $('#profile-heigth').val() === 52){
            profileHight = 30;
            profileWidht = 60;
        }


        _BomParams.then(function(data){
            data.forEach(function(item){
                if(item.BOMTYPE === 0){
                    bomType = item;
                }
            });

            spliceGlueQty  = gidrorezCutQty45 / 2 * bomType.ITEMCONSUMPQTY / bomType.ITEMCONSUMPERQTY /1000;
            spliceGlueQty.toFixed(3);

            $('.parametr').append(
                '<div>Кличество стыкового клея: spliceGlueQty = '+ spliceGlueQty.toFixed(3) +'</div>'

            );

            var itemid = $('#material').val();
            var metProfileQty = null;
            items.then(function(item){
                item.forEach(function(it){
                    if (it.ITEMID == itemid) {
                        if($('#install-option').val() === 'Консоль'){
                            metProfileQty  = perimeter;
                        }
                        if($('#install-option').val() === 'Консоль' && it.ITEMTHIN > 12){
                            metProfileQty  = 0;
                        }
                        if($('#install-option').val() === 'Мебельные базы'){
                            metProfileQty = perimeter+(width/600*heigth);
                        }
                    }
                });

            });


            data.forEach(function(item){
                if(item.BOMTYPE === 1){
                    bomTypeKley = item;
                }
            });

            profileGlueQty = (+metProfileQty * +bomTypeKley.ITEMCONSUMPQTY  / +bomTypeKley.ITEMCONSUMPERQTY) / 1000000;
            profileGlueQty.toFixed(3);



            var inputSelect;
            items.then(function(data) {
                data.forEach(function (item) {
                    if (item.ITEMID == itemid) {
                        materialCost = materialQty * item.ITEMPRICE;
                    }
                    if(item.ITEM_TYPES_ID === 4){
                        profileGlueCost = profileGlueQty * item.ITEMPRICE;
                    }
                    if(item.ITEM_TYPES_ID === 5){
                        spliceGlueCost = spliceGlueQty * item.ITEMPRICE;
                    }
                    if(item.ITEM_TYPES_ID === 6 && item.HEIGHT === profileHight && item.WIDTH === profileWidht){
                        profileCost = metProfileQty / 1000 * item.ITEMPRICE;
                    }

                    if(item.ITEMTHIN <= 6 ){
                        if(item.ITEM_TYPES_ID === 2 && item.ITEMTHIN === 6){
                            gidrorezCutCost  = gidrorezCutQty * item.ITEMPRICE;
                        }
                        if(item.ITEM_TYPES_ID === 3 && item.ITEMTHIN === 6){
                            gidrorezCutCost  += gidrorezCutQty45 * item.ITEMPRICE;
                        }
                    }

                    if(item.ITEMTHIN > 6 ){
                        if(item.ITEM_TYPES_ID === 2 && item.ITEMTHIN === 12){
                            gidrorezCutCost  = gidrorezCutQty * item.ITEMPRICE;
                        }
                        if(item.ITEM_TYPES_ID === 3 && item.ITEMTHIN === 12){
                            gidrorezCutCost  += gidrorezCutQty45 * item.ITEMPRICE;
                        }
                    }

                });


                $('.parametr').append(
                    '<div>Стоимость материала: materialCost = '+ materialCost +'</div>' +
                    '<div>Стоимость профильного клея: profileGlueCost = '+ profileGlueCost +'</div>' +
                    '<div>Стоимость стыкового клея  : spliceGlueCost = '+ spliceGlueCost +'</div>' +
                    '<div>Стоимость профилей  : profileCost = '+ profileCost +'</div>' +
                    '<div>Стоимость раскроя на гидрорезе  : gidrorezCutCost = '+ gidrorezCutCost +'</div>'
                );

                var _jobParams = $.ajax({
                    url: '/selectjobparams',
                    type: 'GET',
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
                var jobParams;
                _jobParams.then(function (item) {

                    item.forEach(function (data) {
                        if (data.JOBID === 5) {
                            assemCost = data.JOBPRICE * profileLenght/1000;
                        }

                    });

                    item.forEach(function (data) {
                        if(data.JOBID === 6){
                            jobParams= data;
                        }
                    });
                    lowerAssemCost = 0;
                    if($('#moi-form').val() === '1' && $('input[name=bottomMounting]').prop("checked")){
                        lowerAssemCost = jobParams.JOBPRICE * (2 * Math.PI * (+$('#diameter').val() / 2) / 1000) ;
                    }

                    if($('#moi-form').val() === '2' && $('input[name=bottomMounting]').prop("checked")){
                        lowerAssemCost = jobParams.JOBPRICE * ((+$('#side-a').val() + +$('#side-b').val()) * 2 / 1000);
                    }

                    if($('#moi-form').val() === '3' && $('input[name=bottomMounting]').prop("checked")){
                        lowerAssemCost = jobParams.JOBPRICE * Math.PI * ((+$('#lots').val() + +$('#sal').val()) / 1000);
                    }


                    $('.parametr').append(
                        '<div>Стоимость склейки: assemCost = '+ assemCost +'</div>' +
                        '<div>Стоимость обработки нависания мойки : lowerAssemCost = '+ lowerAssemCost +'</div>'
                    );

                    countertopCost = Math.round(materialCost + profileGlueCost+ spliceGlueCost + profileCost + gidrorezCutCost  + lowerAssemCost);

                    //console.log(materialCost , profileGlueCost, spliceGlueCost , profileCost , gidrorezCutCost  , lowerAssemCost);
                    $('.price h2').text(countertopCost).priceFormat({
                        prefix: '',
                        centsLimit: 0,
                        suffix: ' руб.',
                        thousandsSeparator: ' '
                    });
                    $('.pricedoubl h2').text(countertopCost).priceFormat({
                        prefix: '',
                        centsLimit: 0,
                        suffix: ' руб.',
                        thousandsSeparator: ' '
                    });

                })

            });

        });

    });
    $('.price h2').priceFormat({
        prefix: '',
        centsLimit: 0,
        suffix: ' руб.',
        thousandsSeparator: ' '
    });
    $('.pricedoubl h2').priceFormat({
        prefix: '',
        centsLimit: 0,
        suffix: ' руб.',
        thousandsSeparator: ' '
    });
});

// function newWind(){
//
//     window.open('/', '_blank');
//     var data = getCookie('nomenK');
//     $('.last').remove();
//     $('input[name=sideProfile]').prop('checked', false);
//     var asyncData = $.ajax({
//         url: '/draw',
//         type: 'POST',
//         data: {id: data},
//         success: function(data){
//         },
//         error: function(err){
//             console.log(err);
//         }
//     });
//     asyncData.then(function(Asdata){
//         if(Asdata.length){
//             var side = Asdata[0].SECTION_SIDE.split('');
//             $('#topName').val(Asdata[0].TOP_NAME);
//             $('#material').val(Asdata[0].ITEMID).change();
//             $('#profile-option').val(Asdata[0].SECTION).change();
//             $('#width').val(Asdata[0].WIDTH);
//             $('#depth').val(Asdata[0].HEIGTH);
//
//             $('#gluing-width').val(Asdata[0].BOTTOM_GLUE_WIDTH);
//
//             setTimeout(function(){
//                 $('#profile-heigth').val(Asdata[0].SECTION_HEIGHT);
//             },10);
//
//             $('#comments').val(Asdata[0].COMMENTS);
//             side.forEach(function(item){
//                 $("input:checkbox[value='"+item+"']").prop("checked", "checked");
//             });
//             $('#splice1').val(Asdata[0].JOINT_VERTICAL);
//             $('#splice2').val(Asdata[0].JOINT_HORIZONTAL);
//             $('.price').find('h2').text(Asdata[0].PRICE);
//             //$("#profile-heigth option[value=" + Asdata[0].SECTION_HEIGHT + "]").attr('selected', 'true').text(Asdata[0].SECTION_HEIGHT);
//             Asdata[1].forEach(function(item){
//                 if(item.BOTTOM_MOUNT === 0 || item.BOTTOM_MOUNT === 1){
//                     $('#idFormMoi').val(item.COUNTERTOPS_ADDON_ID);
//                     if(item.ADDON_TYPE_ID === 1){
//                         $("#moi-form [value='1']").attr("selected", "selected");
//                         $('#diameter').val(item.ADDON_A);
//                     }
//                     if(item.ADDON_TYPE_ID == 2){
//                         $("#moi-form [value='2']").attr("selected", "selected");
//                         $('#side-a').val(item.ADDON_A);
//                         $('#side-b').val(item.ADDON_B);
//                     }
//                     if(item.ADDON_TYPE_ID === 3){
//                         $("#moi-form [value='3']").attr("selected", "selected");
//                         $('#lots').val(item.ADDON_A);
//                         $('#sal').val(item.ADDON_B);
//                     }
//                     $('#moi-form').val(item.ADDON_TYPE_ID).change();
//                     $('#coordinatesX').val(item.ADDON_X);
//                     $('#coordinatesY').val(item.ADDON_Y);
//                     $('input[name=bottomMounting]').prop("checked", "checked");
//                 }
//                 if(item.ADDON_TYPE_ID === 9999){
//                     $('#dop').click();
//                     $('.inputX').last().val(item.ADDON_X);
//                     $('.inputY').last().val(item.ADDON_Y);
//                     $('.inputD').last().val(item.ADDON_A);
//                     $('.dopId').last().val(item.COUNTERTOPS_ADDON_ID);
//                 }
//             });
//             $('#draw').click();
//         }
//     });
// }

$(function(){
    $('#modal').click(function(){
        $('#saveModal').arcticmodal();
    });
    $('.clickSave').click(function(){
        var data = $(this).find('.itemNameId').text() || 0;
        document.cookie = 'refere='+data;
        $('.last').remove();
        $('input[name=sideProfile]').prop('checked', false);
        var asyncData = $.ajax({
            url: '/draw',
            type: 'POST',
            data: {id: data},
            success: function(data){
            },
            error: function(err){
                console.log(err);
            }
        });
        asyncData.then(function(Asdata){
            if(Asdata.length){
                $('.idNameTable').text(Asdata[0].COUNTERTOPS_ID);
                var side = Asdata[0].SECTION_SIDE.split('');
                $('#topName').val(Asdata[0].TOP_NAME);
                $('#material').val(Asdata[0].ITEMID).change();
                $('#profile-option').val(Asdata[0].SECTION).change();
                $('#width').val(Asdata[0].WIDTH);
                $('#depth').val(Asdata[0].HEIGTH);

                $('#gluing-width').val(Asdata[0].BOTTOM_GLUE_WIDTH);

                setTimeout(function(){
                    $('#profile-heigth').val(Asdata[0].SECTION_HEIGHT);
                },10);

                $('#comments').val(Asdata[0].COMMENTS);
                side.forEach(function(item){
                    $("input:checkbox[value='"+item+"']").prop("checked", "checked");
                });
                $('#splice1').val(Asdata[0].JOINT_VERTICAL);
                $('#splice2').val(Asdata[0].JOINT_HORIZONTAL);
                $('.price').find('h2').text(Asdata[0].PRICE).priceFormat({
                    prefix: '',
                    centsLimit: 0,
                    suffix: ' руб.',
                    thousandsSeparator: ' '
                });
                $('.pricedoubl').find('h2').text(Asdata[0].PRICE).priceFormat({
                    prefix: '',
                    centsLimit: 0,
                    suffix: ' руб.',
                    thousandsSeparator: ' '
                });
                //$("#profile-heigth option[value=" + Asdata[0].SECTION_HEIGHT + "]").attr('selected', 'true').text(Asdata[0].SECTION_HEIGHT);
                Asdata[1].forEach(function(item){
                    if(item.BOTTOM_MOUNT === 0 || item.BOTTOM_MOUNT === 1){
                        $('#idFormMoi').val(item.COUNTERTOPS_ADDON_ID);
                        if(item.ADDON_TYPE_ID === 1){
                            $("#moi-form [value='1']").attr("selected", "selected");
                            $('#diameter').val(item.ADDON_A);
                        }
                        if(item.ADDON_TYPE_ID == 2){
                            $("#moi-form [value='2']").attr("selected", "selected");
                            $('#side-a').val(item.ADDON_A);
                            $('#side-b').val(item.ADDON_B);
                        }
                        if(item.ADDON_TYPE_ID === 3){
                            $("#moi-form [value='3']").attr("selected", "selected");
                            $('#lots').val(item.ADDON_A);
                            $('#sal').val(item.ADDON_B);
                        }
                        $('#moi-form').val(item.ADDON_TYPE_ID).change();
                        $('#coordinatesX').val(item.ADDON_X);
                        $('#coordinatesY').val(item.ADDON_Y);
                        $('input[name=bottomMounting]').prop("checked", "checked");
                    }
                    if(item.ADDON_TYPE_ID === 9999){
                        $('#dop').click();
                        $('.inputX').last().val(item.ADDON_X);
                        $('.inputY').last().val(item.ADDON_Y);
                        $('.inputD').last().val(item.ADDON_A);
                        $('.dopId').last().val(item.COUNTERTOPS_ADDON_ID);
                    }
                });
                $('#draw').click();
                //$('#calc').click();
                $.arcticmodal('close');
            }
        });
    });
    $('#print').click(function(){
        window.print();
    });
});