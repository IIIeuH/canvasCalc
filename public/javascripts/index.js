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
        var diametr = $('#diameter').val();
        var x = $('#coordinatesX').val();
        var y = $('#coordinatesY').val();
        var width = $('#width').val();
        var height = $('#depth').val();
        if($('#splice1').val() > width){
            Snackbar.show({
                text: 'Стык 1 не может быть больше ширины',
                textColor: '#d81616',
                pos: 'top-center',
                actionText: null
            });
        }else if($('#splice2').val() > height){
            Snackbar.show({
                text: 'Стык 2 не может быть больше высоты',
                textColor: '#d81616',
                pos: 'top-center',
                actionText: null
            });
        }else if(+x && +y < 0){
            Snackbar.show({
                text: 'Координаты центра мойки не могут быть отрицательными',
                textColor: '#d81616',
                pos: 'top-center',
                actionText: null
            });
        }else if(( +diametr + +x > +width ) || (+diametr + +y > +height) || +diametr + +x > 30){
            console.log( +diametr + +x < 30);
            Snackbar.show({
                text: 'Координаты выходят за рамки',
                textColor: '#d81616',
                pos: 'top-center',
                actionText: null
            });
        }
        draw();
    };
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
    width = +document.getElementById('width').value;
    heigth = +document.getElementById('depth').value;
    var procX = 50;
    var procY = 50;
    var count = 0;
    var w = width;
    var h = heigth;
    if(width > 1200){
        while(width > 1200){
            width = width - 1;
            count +=1;
        }

        procX = count * 100 / w;
        console.log(procX);
        h = heigth;
        heigth = ((100-procX) * heigth)/100;
        procY = heigth * 100 / h;
    }
    if(heigth > 600){
        while(heigth > 600){
            heigth = heigth - 1;
            count +=1;
        }
        procX = count * 100 / h;
        width = ((100-procX) * width)/100;
        procX = width * 100 / h;
    }
    console.log(' ПроцентX:' + procX,' ПроцентY:' + procY, width, heigth);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#90ab6e';
    ctx.translate(0, 0);
    ctx.strokeText("A", width/2, 28);
    ctx.strokeText("B", width+30, heigth/2);
    ctx.strokeText("C", width/2, heigth+60);
    ctx.strokeText("D", 0, heigth/2);
    ctx.fillRect(30, 30, width, heigth);
    ctx.beginPath();
    var x = +document.getElementById('splice1').value || 0;
    var y = +document.getElementById('splice2').value || 0;
    if(x > 0){
        procX = x * 100 / w;
        console.log(procX);
        x = Math.round(procX * width / 100);
        console.log('X',x);
        ctx.beginPath();
        ctx.strokeStyle="#000000";
        ctx.lineWidth = 1;
        ctx.moveTo(x+30,30);
        ctx.lineTo(x+30,heigth+30);
        ctx.stroke();
    }
    if(y > 0){
        procY = y * 100 / h;
        y = Math.round(procY * heigth / 100);
        ctx.beginPath();
        ctx.strokeStyle="#000000";
        ctx.lineWidth = 1;
        ctx.moveTo(30,y+30);
        ctx.lineTo(width+30, y+30);
        ctx.stroke();
    }
    if(document.querySelector('#A').checked){
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(30, 33);
        ctx.lineTo(width+30, 33);
        ctx.stroke();
    }
    if(document.querySelector('#B').checked){
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(width+27, 30);
        ctx.lineTo(width+27, heigth+30);
        ctx.stroke();
    }
    if(document.querySelector('#C').checked){
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(30, heigth+27);
        ctx.lineTo(width+30, heigth+27);
        ctx.stroke();
    }
    if(document.querySelector('#D').checked){
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.moveTo(33, 30);
        ctx.lineTo(33, heigth+30);
        ctx.stroke();
    }
    if(document.querySelector('#moi-form').value === '1'){
        var coordX = +document.querySelector('#coordinatesX').value;
        var coordY = +document.querySelector('#coordinatesY').value;
        var diametr = +document.querySelector('#diameter').value;
        procX = coordX * 100 / w;
        procY = coordY * 100 / h;
        coordX = Math.round(procX * width / 100);
        coordY = Math.round(procY * heigth / 100);
        var sq1 = w * h;
        var sq2 = width * heigth;
        var proc = sq2 * 100 / sq1;
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
    }
    if(document.querySelector('#moi-form').value === '2'){
        var coordX = +document.querySelector('#coordinatesX').value;
        var coordY = +document.querySelector('#coordinatesY').value;
        var sideA = +document.querySelector('#side-a').value;
        var sideB = +document.querySelector('#side-b').value;
        procX = coordX * 100 / w;
        procY = coordY * 100 / h;
        coordX = Math.round(procX * width / 100);
        coordY = Math.round(procY * heigth / 100);
        procX = sideA * 100 / w;
        procY = sideB * 100 / h;
        sideA = Math.round(procX * width / 100);
        sideB = Math.round(procY * heigth / 100);
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.fillRect(+coordX + 30 -(sideA / 2), +coordY + 30 -(sideB / 2), sideA, sideB);
        ctx.strokeRect(+coordX + 30 -(sideA / 2), +coordY + 30 -(sideB / 2), sideA, sideB);

    }
    if(document.querySelector('#moi-form').value === '3'){
        var coordX = +document.querySelector('#coordinatesX').value;
        var coordY = +document.querySelector('#coordinatesY').value;
        var lots = +document.querySelector('#lots').value;
        var sal = +document.querySelector('#sal').value;
        procX = coordX * 100 / w;
        procY = coordY * 100 / h;
        coordX = Math.round(procX * width / 100);
        coordY = Math.round(procY * heigth / 100);
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
    }
    if(document.querySelectorAll('.last').length !== 0){
        var mass = document.querySelectorAll('.last');
        mass.forEach(function(item){
            var inputX = item.querySelector('.inputX').value;
            var inputY = item.querySelector('.inputY').value;
            var inputD = item.querySelector('.inputD').value;
            procX = inputX * 100 / w;
            procY = inputY * 100 / h;
            inputX = Math.round(procX * width / 100);
            inputY = Math.round(procY * heigth / 100);
            var sq1 = w * h;
            var sq2 = width * heigth;
            var proc = sq2 * 100 / sq1;
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
                inputX: item.querySelector('.inputX').value,
                inputY: item.querySelector('.inputY').value,
                inputD: item.querySelector('.inputD').value
            };
            mas.push(dop);
        });

        var data = {
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
            dop:                JSON.stringify(mas)
        };
        data.sectionSide = '';
        $('input[name=sideProfile]:checked').each(function(){
            data.sectionSide += ($(this).val());
        });
        console.log(data);
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

//Обработка изменения селекта с готовыми решениями

$(function(){
    $('.ready').change(function(ev){
        $('.last').remove();
        $('input[name=sideProfile]').prop('checked', false);;
        var data = JSON.parse($(this).val());
        var asyncData = $.ajax({
            url: '/draw',
            type: 'POST',
            data: {id: data.COUNTERTOPS_ID},
            success: function(data){
            },
            error: function(err){
                console.log(err);
            }
        });

        console.log(data);
        asyncData.then(function(Asdata){
            var side = data.SECTION_SIDE.split('');
            console.log(side);
            $('#width').val(data.WIDTH);
            $('#depth').val(data.HEIGTH);
            $('#profile-option').val(data.SECTION).change();
            $('#gluing-width').val(data.BOTTOM_GLUE_WIDTH);
            $('#profile-heigth').val(data.SECTION_HEIGHT);
            side.forEach(function(item){
                $("input:checkbox[value='"+item+"']").prop("checked", "checked");
            });
            $('#splice1').val(data.JOINT_VERTICAL);
            $('#splice2').val(data.JOINT_HORIZONTAL);
            Asdata.forEach(function(item){
                console.log(item);
                if(item.BOTTOM_MOUNT == 1){
                    if(item.ADDON_TYPE_ID == 1){
                        $('#diameter').val(item.ADDON_A);
                    }
                    if(item.ADDON_TYPE_ID == 2){
                        $('#side-a').val(item.ADDON_A);
                        $('#side-b').val(item.ADDON_B);
                    }
                    if(item.ADDON_TYPE_ID == 3){
                        $('#lots').val(item.ADDON_A);
                        $('#sal').val(item.ADDON_B);
                    }
                    $('#moi-form').val(item.ADDON_TYPE_ID).change();
                    $('#coordinatesX').val(item.ADDON_X);
                    $('#coordinatesY').val(item.ADDON_Y);
                    $('input[name=bottomMounting]').prop("checked", "checked");
                }
                else{
                    $('#dop').click();
                    $('.inputX').last().val(item.ADDON_X);
                    $('.inputY').last().val(item.ADDON_Y);
                    $('.inputD').last().val(item.ADDON_A);
                }
            });
            $('#draw').click();
        });
    });
});

//расчет
$(function(){
    $('#calc').click(function(){
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
        var glueingPerimeter = profileLenght + +$('#profile-heigth').val();
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
            materialQty =( (profileLenght * +$('#profile-heigth').val()) + (width * height) )/1000000 * 1.5;
        }else{
            materialQty =( (width * height) + (profileLenght * +$('#profile-heigth').val()) + ($('#gluing-width').val() * profileLenght )) / 1000000 * 1.5;
        }

        var gidrorezCutQty;
        var gidrorezCutQty45;

        gidrorezCutQty= (perimeter - (sideA + sideB+ sideC+ sideD))  + (glueingPerimeter / 2) - adjacentCut*2;


        gidrorezCutQty45 = (sideA + sideB+ sideC+ sideD) + (glueingPerimeter / 2) + +adjacentCut*2;
        if($('#profile-option').val() === '1'){
            gidrorezCutQty += (+$('#gluing-width').val() + +profileLenght ) * 2;
            gidrorezCutQty45 += +profileLenght * 2;
        }
        $('.last').each(function(){
            var D = $(this).find('.inputD ').val();
            gidrorezCutQty += 2 * 3.14 * (D/2);
        });

        if($('#moi-form').val() === '1'){
            gidrorezCutQty += (2 * 3.14);
        }

        if($('#moi-form').val() === '2'){
            gidrorezCutQty += (+$('#side-a').val() + +$('#side-b').val())*2;
        }

        if($('#moi-form').val() === '3'){
            gidrorezCutQty += 3.14;
        }
        //var spliceGlueQty  = gidrorezCutQty45 / 2 * BomParams.ItemConsumpQty/BomParams.ItemConsumpPerQty /1000;
        var spliceGlueQty  = +gidrorezCutQty45 / 2 * 10/2 /1000;

        var metProfileQty  = +perimeter;

        //var profileGlueQty =( metProfileQty * BomParams.ItemConsumpQty / BomParams.ItemConsumpPerQty) / 1000
        var profileGlueQty =( +metProfileQty * 10 / 2) / 1000;

        //var materialCost = materialQty * MatParams.ItemPrice
        var materialCost = +materialQty * 70;

        //var profileGlueCost = profileGlueQty * MatParams.ItemPrice
        var profileGlueCost = +profileGlueQty * 70;

        //var spliceGlueCost = spliceGlueQty * MatParams.ItemPrice
        var spliceGlueCost = +spliceGlueQty * 70;

        //var profileCost = metProfileQty /1000 * MatParams.itemPrice;
        var profileCost = +metProfileQty /1000 * 100;

        //var gidrorezCutCost  = gidrorezCutQty * MatParams.ItemPrice
        var gidrorezCutCost  = +gidrorezCutQty * 1;
        //var gidrorezCutCost  += gidrorezCutQty45 * MatParams.ItemPrice

        //var assemCost = JobParams.JobPrice * profileLenght
        var assemCost = 300;
        var lowerAssemCost = 0;
        if($('#moi-form').val() === '1'){
            lowerAssemCost = 10 * 2 * 3.14;
        }

        if($('#moi-form').val() === '2'){
            lowerAssemCost = 10 * (+$('#side-a').val() + +$('#side-b').val())*2;
        }

        if($('#moi-form').val() === '3'){
            lowerAssemCost = 10 * 3.14;
        }

        var countertopCost = materialCost + profileGlueCost+ spliceGlueCost + profileCost + gidrorezCutCost  + lowerAssemCost;
        console.log(materialCost ,profileGlueCost, spliceGlueCost , profileCost, gidrorezCutCost  , lowerAssemCost);

        //console.log(sideA,sideB,sideC,sideD, profileLenght, perimeter, glueingPerimeter, adjacentCut, materialQty, 'gidrorezCutQty - ' + gidrorezCutQty, 'gidrorezCutQty45 - ' + gidrorezCutQty45);
        console.log('Итог = '+ countertopCost, gidrorezCutQty);

        $('.price h2').text('Итог = '+ countertopCost, gidrorezCutQty);
    });

});

