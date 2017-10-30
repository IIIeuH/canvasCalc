$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();

    //input file
    var inp = $('#upload'),
        lbl = $('.file_upload div');

    inp.change(function(){
        lbl.text(inp.prop('files')[0].name);
    });
});
//Параметры материала
var select;
var string;
var selectItem;
var itemType = $.ajax({
    url: "/itemType",
    type: 'GET',
    success: function(data){
        itemType = data;
        select = '<select class="form-control">' +
            '<option></option>';
        data.forEach(function (item) {
            select += '<option value="'+ item.ITEM_TYPES_ID +'">'+ item.ITEM_TYPE +'</option>';
        });

        select += '</select>';
        selectItem = select;
        string = '<tr class="str">' +
            '<td>' +
            '<div class="form-group">' +
            '<input type="text" class="form-control">' +
            '</div>' +
            '</td>' +
            '<td>' +
            '<div class="form-group">' +
            '<input type="text" class="form-control itemName">' +
            '</div>' +
            '</td>' +
            '<td>' +
            '<div class="form-group">' +
            select+
            '</div>' +
            '</td>' +
            '<td>' +
            '<div class="form-group">' +
            '<input type="number" class="form-control itemHight">' +
            '</div>' +
            '</td>' +
            '<td>' +
            '<div class="form-group">' +
            '<input type="number" class="form-control itemWidth">' +
            '</div>' +
            '</td>' +
            '<td>' +
            '<div class="form-group">' +
            '<input type="number" class="form-control itemThin">' +
            '</div>' +
            '</td>' +
            '<td>' +
            '<div class="form-group">' +
            '<input type="number" class="form-control itemPrice">' +
            '</div>' +
            '</td>' +
            '</tr>';
    },
    error: function (err) {
        console.log(err);
    }
});


$(function(){
    //itemType с цифр на названия
    itemType.then(function(data){
        $.each($('tr').find('td.itemType'), function(){
            var that = $(this);
            data.forEach(function(item){
                if(that.text() == item.ITEM_TYPES_ID){
                    that.text(item.ITEM_TYPE);
                }
            });
        });
    });


    //Обработка клика на кнопку добавить
    $('#addItem').click(function(){
        $('.addItemtable').append(
            '<table class="table table-bordered addItemTable">' +
                '<thead>' +
                    '<th>axapta_id</th>' +
                    '<th>ItemName(Название)</th>' +
                    '<th>ItemType(Тип)</th>' +
                    '<th>ItemHeight(Высота, мм)</th>' +
                    '<th>ItemWidth(Ширина, мм)</th>' +
                    '<th> ItemThin(Толщина, мм)</th>' +
                    '<th>ItemPrice(Цена)</th>' +
                '</thead>' +
                '<tbody class="mainTable">' +
                    string+
                '</tbody>'
        );

        $(this).addClass('hidden');
        $('#cancelItem').removeClass('hidden');
        $('#addTable').removeClass('hidden');
        $('.saveItem').removeClass('hidden');
        $('#cancelTable').removeClass('hidden');


    });

    //при клике на отмена
    $('#cancelItem').click(function(){
        $('.addItemTable').remove();
        $('#addItem').removeClass('hidden');
        $(this).addClass('hidden');
        $('#addTable').addClass('hidden');
        $('.saveItem').addClass('hidden');
        $('#cancelTable').addClass('hidden');
    });

    //при клике сохранить
    $('.saveItem').click(function(){
        var data = [];
        var col = [];
        $('.str').each(function(i){
            var mas = [];
            col.push(i+1);
            $(this).find('.form-group').children().each(function(){
                mas.push($(this).val());
            });
            data.push(mas);
        });
        $.ajax({
            url: '/admin/items/',
            type: 'POST',
            data: {data: JSON.stringify(data), col: JSON.stringify(col)},
            success: function(data){
                window.location.reload();
            },
            error: function(err){
                console.log(err);
            }
        })
    });

    //при клике на удалить строчку
    $('#cancelTable').click(function(){
        $('.str').last().remove();
    });

    //при клике на добавить строчку
    $('#addTable').click(function(ev){
        ev.preventDefault();
        $('.mainTable').append(string);
    });

    //клик на кнопку удаление в таблицу
    $('.close').click(function(){
        var id = $(this).data('id');
        var nameId = $(this).data('nameid');
        var table = window.location.pathname.split('/')[2];
        var res = confirm("Вы действительно хотите удалить эту строчку?");
        if(res){
            $.ajax({
                url: '/delete',
                type: 'DELETE',
                data: {id: id, table: table, nameId: nameId},
                success: function (data) {
                    window.location.reload();
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
    });

    //при клике на редактирование
    $('.redactor').click(function(){
        $('.redactor').addClass('hidden');
        var id = $(this).data('red');
        var tr = $(this).parent().parent();
        var td = tr.children('td');
        var text = [];
        $.each(td, function(i){
            text.push($(this).text());
            if(!$(this).is(':has(button)')){
                $(this).empty();
                $(this).append('<input type="text" class="form-control" value="'+ text[i] +'">');
            }
            if($(this).is('.itemType')){
                $(this).empty();
                $(this).append(select);
                $('select :contains('+text[i]+')').first().attr("selected", "selected");
            }
        });

        //создание кнопок
        $('.btn-top-panel').append(
            '<button class="btn btn-danger" type="button" id="cancelRedactor"> Отменить' +
            '<button class="btn btn-success" type="button" id="saveRedactor"> Сохранить'
        );

        //обработка клика на кнопку отменить
        $(document).on('click', '#cancelRedactor', function(){
            $('.redactor').removeClass('hidden');
            $.each(td, function(i){
                if(!$(this).is(':has(button)')){
                    $(this).empty();
                    $(this).text(text[i]);
                }
            });
            $(this).remove();
            $('#saveRedactor').remove();
        });

        //обработка клика на кнопку сохранить
        $(document).on('click', '#saveRedactor', function(){
            var btn = $('#'+id);
            var tr = btn.parent().parent();
            var td = tr.children('td');
            var saveItem = [];
            $.each(td, function(i){
                if(!$(this).is(':has(button)')){
                    saveItem.push($(this).find(':first-child').val());
                }
            });
            $.ajax({
                type: 'PUT',
                data: {data: JSON.stringify(saveItem), id: id},
                success: function(data){
                    window.location.reload();
                },
                error: function(err){
                    console.log(err);
                }
            })
        });
    });


    //Сохранение CSV
    //при клике сохранить
    $('.saveItemCSV').click(function(){
        var data = [];
        var col = [];
        $('.str').each(function(i){
            var mas = [];
            col.push(i+1);
            $(this).find('.form-group').children().each(function(){
                mas.push($(this).val());
            });
            data.push(mas);
        });
        $.ajax({
            url: '/admin/itemsCSV/',
            type: 'POST',
            data: {data: JSON.stringify(data), col: JSON.stringify(col)},
            success: function(data){
                window.location.reload();
            },
            error: function(err){
                console.log(err);
            }
        })
    });
});
//Конец параметры материала


//Начало Параматры работы
$(function(){
    var select;
    var string;
    var selectJobType;
    var jobUomsId = $.ajax({
        url: "/jobuom",
        type: 'GET',
        success: function(data){
            select = '<select class="form-control">' +
                '<option></option>';
            data.forEach(function (item) {
                select += '<option value="'+ item.UOMS_ID +'">'+ item.UOM +'</option>';
            });
            select += '</select>';
            selectJobType = select;
            string = '<tr class="str">' +
                '<td>' +
                '<div class="form-group">' +
                '<input type="text" class="form-control jobDesc">' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="form-group">' +
                '<input type="number" class="form-control jobPrice">' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="form-group">' +
                select+
                '</div>' +
                '</td>' +
                '<td>' +
                '</tr>';
        },
        error: function (err) {
            console.log(err);
        }
    });

    //itemType с цифр на названия
    jobUomsId.then(function(data){
        $.each($('tr').find('td.jobUomsId'), function(){
            var that = $(this);
            data.forEach(function(item){
                if(that.text() == item.UOMS_ID){
                    that.text(item.UOM);
                }
            });
        });
    });
    jobUomsId.then(function(data){
        $.each($('tr').find('td.specOne'), function(){
            var that = $(this);
            data.forEach(function(item){
                if(that.text() == item.UOMS_ID){
                    that.text(item.UOM);
                }
            });
        });
    });
    jobUomsId.then(function(data){
        $.each($('tr').find('td.specTwo'), function(){
            var that = $(this);
            data.forEach(function(item){
                if(that.text() == item.UOMS_ID){
                    that.text(item.UOM);
                }
            });
        });
    });
    $.each($('tr').find('td.bomtype'), function(){
        if($(this).text() === '0'){
            $(this).text('Клей для стыков');
        }
        if($(this).text() === '1'){
            $(this).text('Клей для профилей');
        }
    });
    $('#addItemJob').click(function(){

        $('.addItemtable').append(
            '<table class="table table-bordered addItemTable">' +
            '<thead>' +
            '<th>Описание работы</th>' +
            '<th>Цена работы</th>' +
            '<th>Единица измерения</th>' +
            '</thead>' +
            '<tbody class="mainTable">' +
            string+
            '</tbody>'
        );

        $(this).addClass('hidden');
        $('#cancelItemJob').removeClass('hidden');
        $('#addTableJob').removeClass('hidden');
        $('#saveItemJob').removeClass('hidden');
        $('#cancelTableJob').removeClass('hidden');


    });

    //при клике на отмена
    $('#cancelItemJob').click(function(){
        $('.addItemTable').remove();
        $('#addItemJob').removeClass('hidden');
        $(this).addClass('hidden');
        $('#addTableJob').addClass('hidden');
        $('#saveItemJob').addClass('hidden');
        $('#cancelTableJob').addClass('hidden');
    });

    //при клике сохранить
    $('#saveItemJob').click(function(){
        var data = [];
        var col = [];
        $('.str').each(function(i){
            var mas = [];
            col.push(i+1);
            $(this).find('.form-group').children().each(function(){
                mas.push($(this).val());
            });
            data.push(mas);
        });
        $.ajax({
            url: '/admin/jobparams/',
            type: 'POST',
            data: {data: JSON.stringify(data), col: JSON.stringify(col)},
            success: function(data){
                window.location.reload();
            },
            error: function(err){
                console.log(err);
            }
        })
    });

    //при клике на удалить строчку
    $('#cancelTableJob').click(function(){
        $('.str').last().remove();
    });

    //при клике на добавить строчку
    $('#addTableJob').click(function(ev){
        $('.mainTable').append(string);
    });

    $('.redactorJob').click(function(){
        $('.redactorJob').addClass('hidden');
        var id = $(this).data('red');
        var tr = $(this).parent().parent();
        var td = tr.children('td');
        var text = [];
        $.each(td, function(i){
            text.push($(this).text());
            if(!$(this).is(':has(button)')){
                $(this).empty();
                $(this).append('<input type="text" class="form-control" value="'+ text[i] +'">');
            }
            if($(this).is('.jobUomsId')){
                $(this).empty();
                $(this).append(select);
                $('select :contains('+text[i]+')').first().attr("selected", "selected");
            }
        });

        //создание кнопок
        $('.btn-top-panel').append(
            '<button class="btn btn-danger" type="button" id="cancelRedactor"> Отменить' +
            '<button class="btn btn-success" type="button" id="saveRedactor"> Сохранить'
        );

        //обработка клика на кнопку отменить
        $(document).on('click', '#cancelRedactor', function(){
            $('.redactorJob').removeClass('hidden');
            $.each(td, function(i){
                if(!$(this).is(':has(button)')){
                    $(this).empty();
                    $(this).text(text[i]);
                }
            });
            $(this).remove();
            $('#saveRedactor').remove();
        });

        //обработка клика на кнопку сохранить
        $(document).on('click', '#saveRedactor', function(){
            var btn = $('#'+id);
            var tr = btn.parent().parent();
            var td = tr.children('td');
            var saveItem = [];
            $.each(td, function(i){
                if(!$(this).is(':has(button)')){
                    saveItem.push($(this).find(':first-child').val());
                }
            });
            $.ajax({
                type: 'PUT',
                data: {data: JSON.stringify(saveItem), id: id},
                success: function(data){
                    window.location.reload();
                },
                error: function(err){
                    console.log(err);
                }
            })
        });
    });

});
//Конец параметры работы


//Начало Спецификации
$(function(){
    var select;
    var selectItem;
    var string;
    var selectUoms;

    var items = $.ajax({
        url: "/items",
        type: 'GET',
        success: function(data){
            selectItem = '<select class="form-control">' +
                '<option></option>';
            data.forEach(function (item) {
                selectItem += '<option value="'+ item.ITEMID +'">'+ item.ITEMNAME +'</option>';
            });

            selectItem += '</select>';
        },
        error: function (err) {
            console.log(err);
        }
    });


    items.then(function(data){
        $.each($('tr').find('td.nomen'), function(){
            var that = $(this);
            data.forEach(function(item){
                if(that.text() == item.ITEMID){
                    that.text(item.ITEMNAME);
                }
            });
        });
    });

    items.then(function(data){
        $.ajax({
            url: "/jobuom",
            type: 'GET',
            success: function(data){
                select = '<select class="form-control">' +
                    '<option></option>';
                data.forEach(function (item) {
                    select += '<option value="'+ item.UOMS_ID +'">'+ item.UOM +'</option>';
                });

                select += '</select>';
                selectUoms = select;
                string = '<tr class="str">' +
                    '<td>' +
                    '<div class="form-group">' +
                    selectItem+
                    '</div>' +
                    '</td>' +
                    '<td>' +
                    '<div class="form-group">' +
                    '<select class="form-control"><option></option><option value="0">Клей для стыков</option><option value="1">Клей для профилей</option></select>' +
                    '</div>' +
                    '</td>' +
                    '<td>' +
                    '<div class="form-group">' +
                    '<input type="number" class="form-control">' +
                    '</div>' +
                    '</td>' +
                    '<td>' +
                    '<div class="form-group">' +
                    select+
                    '</div>' +
                    '</td>' +
                    '<td>' +
                    '<div class="form-group">' +
                    '<input type="number" class="form-control">' +
                    '</div>' +
                    '</td>' +
                    '<td>' +
                    '<div class="form-group">' +
                    select+
                    '</div>' +
                    '</td>' +
                    '</tr>';
            },
            error: function (err) {
                console.log(err);
            }
        });
    });


    $('#addItemBom').click(function(){

        $('.addItemtable').append(
            '<table class="table table-bordered addItemTableBom">' +
            '<thead>' +
            '<th>Номенклатура</th>' +
            '<th>Тип спецификации</th>' +
            '<th>Расход</th>' +
            '<th>ItemConsumpUOM(Ед. изм.)</th>' +
            '<th>На кол-во</th>' +
            '<th>ItemConsumpPerUOM(Ед. изм.)</th>' +
            '</thead>' +
            '<tbody class="mainTable">' +
            string+
            '</tbody>'
        );

        $(this).addClass('hidden');
        $('#cancelItemBom').removeClass('hidden');
        $('#addTableBom').removeClass('hidden');
        $('#saveItemBom').removeClass('hidden');
        $('#cancelTableBom').removeClass('hidden');


    });

    //при клике на отмена
    $('#cancelItemBom').click(function(){
        $('.addItemTableBom').remove();
        $('#addItemBom').removeClass('hidden');
        $(this).addClass('hidden');
        $('#addTableBom').addClass('hidden');
        $('#saveItemBom').addClass('hidden');
        $('#cancelTableBom').addClass('hidden');
    });

    //при клике сохранить
    $('#saveItemBom').click(function(){
        var data = [];
        var col = [];
        $('.str').each(function(i){
            var mas = [];
            col.push(i+1);
            $(this).find('.form-group').children().each(function(){
                mas.push($(this).val());
            });
            data.push(mas);
        });
        $.ajax({
            url: '/admin/bomparams/',
            type: 'POST',
            data: {data: JSON.stringify(data), col: JSON.stringify(col)},
            success: function(data){
                window.location.reload();
            },
            error: function(err){
                console.log(err);
            }
        })
    });

    //при клике на удалить строчку
    $('#cancelTableBom').click(function(){
        $('.str').last().remove();
    });

    //при клике на добавить строчку
    $('#addTableBom').click(function(ev){
        $('.mainTable').append(string);
    });

    //клик редактировать
    $('.redactorBom').click(function(){
        $('.redactorBom').addClass('hidden');
        var id = $(this).data('red');
        var tr = $(this).parent().parent();
        var td = tr.children('td');
        var text = [];
        $.each(td, function(i){
            text.push($(this).text());
            if(!$(this).is(':has(button)')){
                $(this).empty();
                $(this).append('<input type="text" class="form-control" value="'+ text[i] +'">');
            }
            if($(this).is('.nomen')){
                $(this).empty();
                $(this).append(selectItem);
                $('select :contains('+text[i]+')').first().attr("selected", "selected");
            }
            if($(this).is('.bomtype')){
                $(this).empty();
                $(this).append('<select class="form-control"><option></option><option value="0">Клей для стыков</option><option value="1">Клей для профилей<option></select>');
                $('select :contains('+text[i]+')').first().attr("selected", "selected");
            }
            if($(this).is('.specTwo')){
                $(this).empty();
                $(this).append(selectUoms);
                $(this).find('select :contains('+text[i]+')').first().attr("selected", "selected");
            }
            if($(this).is('.specOne')){
                $(this).empty();
                $(this).append(selectUoms);
                $(this).find('select :contains('+text[i]+')').last().attr("selected", "selected");
            }
        });
        //создание кнопок
        $('.btn-top-panel').append(
            '<button class="btn btn-danger" type="button" id="cancelRedactor"> Отменить' +
            '<button class="btn btn-success" type="button" id="saveRedactor"> Сохранить'
        );

        //обработка клика на кнопку отменить
        $(document).on('click', '#cancelRedactor', function(){
            $('.redactorBom').removeClass('hidden');
            $.each(td, function(i){
                if(!$(this).is(':has(button)')){
                    $(this).empty();
                    $(this).text(text[i]);
                }
            });
            $(this).remove();
            $('#saveRedactor').remove();
        });

        //обработка клика на кнопку сохранить
        $(document).on('click', '#saveRedactor', function(){
            var btn = $('#'+id);
            var tr = btn.parent().parent();
            var td = tr.children('td');
            var saveItem = [];
            $.each(td, function(i){
                if(!$(this).is(':has(button)')){
                    saveItem.push($(this).find(':first-child').val());
                }
            });
            $.ajax({
                type: 'PUT',
                data: {data: JSON.stringify(saveItem), id: id},
                success: function(data){
                    window.location.reload();
                },
                error: function(err){
                    console.log(err);
                }
            })
        });
    });

    //При клике редактировать UOM
    $('.redactorUom').click(function(){
        $('.redactorUom').addClass('hidden');
        var id = $(this).data('red');
        var tr = $(this).parent().parent();
        var td = tr.children('td');
        var text = [];
        $.each(td, function(i){
            text.push($(this).text());
            if(!$(this).is(':has(button)')){
                $(this).empty();
                $(this).append('<input type="text" class="form-control" value="'+ text[i] +'">');
            }
        });
        //создание кнопок
        $('.btn-top-panel').append(
            '<button class="btn btn-danger" type="button" id="cancelRedactor"> Отменить' +
            '<button class="btn btn-success" type="button" id="saveRedactor"> Сохранить'
        );

        //обработка клика на кнопку отменить
        $(document).on('click', '#cancelRedactor', function(){
            $('.redactorUom').removeClass('hidden');
            $.each(td, function(i){
                if(!$(this).is(':has(button)')){
                    $(this).empty();
                    $(this).text(text[i]);
                }
            });
            $(this).remove();
            $('#saveRedactor').remove();
        });

        //обработка клика на кнопку сохранить
        $(document).on('click', '#saveRedactor', function(){
            var btn = $('#'+id);
            var tr = btn.parent().parent();
            var td = tr.children('td');
            var saveItem = [];
            $.each(td, function(i){
                if(!$(this).is(':has(button)')){
                    saveItem.push($(this).find(':first-child').val());
                }
            });
            $.ajax({
                type: 'PUT',
                data: {data: JSON.stringify(saveItem), id: id},
                success: function(data){
                    window.location.reload();
                },
                error: function(err){
                    console.log(err);
                }
            })
        });
    });
    //Конец Клика редактировать UOM


});
//Конец Спецификации


//Начало Единицы измерения
$(function(){
    var select;
    var string;
    string = '<tr class="str">' +
        '<td>' +
        '<div class="form-group">' +
        '<input type="text" class="form-control">' +
        '</div>' +
        '</td>' +
        '</tr>';
    $('#addItemUom').click(function(){

        $('.addItemtable').append(
            '<table class="table table-bordered addItemTableUom">' +
            '<thead>' +
            '<th>Единица измерения</th>' +
            '</thead>' +
            '<tbody class="mainTable">' +
            string+
            '</tbody>'
        );

        $(this).addClass('hidden');
        $('#cancelItemUom').removeClass('hidden');
        $('#addTableUom').removeClass('hidden');
        $('#saveItemUom').removeClass('hidden');
        $('#cancelTableUom').removeClass('hidden');


    });

    //при клике на отмена
    $('#cancelItemUom').click(function(){
        $('.addItemTableUom').remove();
        $('#addItemUom').removeClass('hidden');
        $(this).addClass('hidden');
        $('#addTableUom').addClass('hidden');
        $('#saveItemUom').addClass('hidden');
        $('#cancelTableUom').addClass('hidden');
    });

    //при клике сохранить
    $('#saveItemUom').click(function(){
        var data = [];
        var col = [];
        $('.str').each(function(i){
            var mas = [];
            col.push(i+1);
            $(this).find('.form-group').children().each(function(){
                mas.push($(this).val());
            });
            data.push(mas);
        });
        $.ajax({
            url: '/admin/uom/',
            type: 'POST',
            data: {data: JSON.stringify(data), col: JSON.stringify(col)},
            success: function(data){
                window.location.reload();
            },
            error: function(err){
                console.log(err);
            }
        })
    });

    //при клике на удалить строчку
    $('#cancelTableUom').click(function(){
        $('.str').last().remove();
    });

    //при клике на добавить строчку
    $('#addTableUom').click(function(ev){
        $('.mainTable').append(string);
    });

});
//Конец Единицы измерения





//Начало users

$(function(){
    var select;
    var string;
    var users;
    var top_users = $.ajax({
        url: "/location",
        type: 'GET',
        success: function(data){
            users = data;
            select = '<select class="form-control">' +
                '<option></option>';
            data.forEach(function (item) {
                select += '<option value="'+ item.TOP_LOCATION_ID +'">'+ item.TOP_LOCATION_NAME +'</option>';
            });
            var select2 = '<select class="form-control"><option></option><option value="0">Обычный</option><option value="1">Администратор</option></select>';
            select += '</select>';
            selectItem = select;
            string = '<tr class="str">' +
                '<td>' +
                '<div class="form-group">' +
                select +
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="form-group">' +
                select2+
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="form-group">' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="input-group">' +
                '<input type="text" class="form-control genPwd">' +
                '<span class="input-group-addon generator" data-toggle="tooltip" data-placement="top" title="Как масть ляжет!">&spades;</span>' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="form-group">' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="form-group">' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="form-group">' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<div class="form-group">' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '</td>' +
                '</tr>';
        },
        error: function (err) {
            console.log(err);
        }
    });
    $('#addItemUsers').click(function(){

        $('.addItemtable').append(
            '<table class="table table-bordered addItemTableUsers">' +
            '<thead>' +
            '<th>Местоположение</th>' +
            '<th>Уровень доступа</th>' +
            '<th>Логин</th>' +
            '<th>Пароль</th>' +
            '<th>Фио</th>' +
            '<th>Адрес</th>' +
            '<th>Телефон</th>' +
            '<th>Email</th>' +
            '</thead>' +
            '<tbody class="mainTable">' +
            string+
            '</tbody>'
        );

        $(this).addClass('hidden');
        $('#cancelItemUsers').removeClass('hidden');
        $('#addTableUsers').removeClass('hidden');
        $('#saveItemUsers').removeClass('hidden');
        $('#cancelTableUsers').removeClass('hidden');


    });

    //при клике на отмена
    $('#cancelItemUsers').click(function(){
        $('.addItemTableUsers').remove();
        $('#addItemUsers').removeClass('hidden');
        $(this).addClass('hidden');
        $('#addTableUsers').addClass('hidden');
        $('#saveItemUsers').addClass('hidden');
        $('#cancelTableUsers').addClass('hidden');
    });

    //при клике сохранить
    $('#saveItemUsers').click(function(){
        var data = [];
        var col = [];
        $('.str').each(function(i){
            var mas = [];
            col.push(i+1);
            $(this).find('.form-group').children().each(function(){
                mas.push($(this).val());
            });
            mas.push($(this).find('.input-group input').val());
            data.push(mas);
        });
        $.ajax({
            url: '/admin/top_users/',
            type: 'POST',
            data: {data: JSON.stringify(data), col: JSON.stringify(col)},
            success: function(data){
                window.location.reload();
            },
            error: function(err){
                console.log(err);
            }
        })
    });

    //при клике на удалить строчку
    $('#cancelTableUsers').click(function(){
        $('.str').last().remove();
    });

    //при клике на добавить строчку
    $('#addTableUsers').click(function(ev){
        $('.mainTable').append(string);
    });

    top_users.then(function(users){
        $.each($('.locationName'), function(){
            var that = $(this);
            users.forEach(function(item){
                if(that.text() == item.TOP_LOCATION_ID){
                    that.text(item.TOP_LOCATION_NAME);
                }
            });
        });
    });

    $.each($('.userRole'), function(){
        var that = $(this);
        if(that.text() == 0){
            that.text('Обычный');
        }else{
            that.text('Администратор');
        }
    });


    //клик редактировать
    $('.redactorUser').click(function() {
        $('.redactorUser').addClass('hidden');
        var id = $(this).data('red');
        var tr = $(this).parent().parent();
        var td = tr.children('td');
        var text = [];
        $.each(td, function (i) {
            text.push($(this).text());
            if (!$(this).is(':has(button)')) {
                $(this).empty();
                $(this).append('<input type="text" class="form-control" value="' + text[i] + '">');
            }
            // if($(this).is('.pwdDis')){
            //     $('.pwdDis').find('input').attr('disabled', 'disabled' );
            // }
            if ($(this).is('.locationName')) {
                $(this).empty();
                $(this).append(selectItem);
                $('select :contains(' + text[i] + ')').first().attr("selected", "selected");
            }
            if ($(this).is('.userRole')) {
                $(this).empty();
                $(this).append('<select class="form-control"><option></option><option value="0">Обычный</option><option value="1">Администратор<option></select>');
                $('select :contains(' + text[i] + ')').first().attr("selected", "selected");
            }
        });
        //создание кнопок
        $('.btn-top-panel').append(
            '<button class="btn btn-danger" type="button" id="cancelRedactor"> Отменить' +
            '<button class="btn btn-success" type="button" id="saveRedactor"> Сохранить'
        );

        //обработка клика на кнопку отменить
        $(document).on('click', '#cancelRedactor', function () {
            $('.redactorUser').removeClass('hidden');
            $.each(td, function (i) {
                if (!$(this).is(':has(button)')) {
                    $(this).empty();
                    $(this).text(text[i]);
                }
            });
            $(this).remove();
            $('#saveRedactor').remove();
        });

        //обработка клика на кнопку сохранить
        $(document).on('click', '#saveRedactor', function () {
            var btn = $('#' + id);
            var tr = btn.parent().parent();
            var td = tr.children('td');
            var saveItem = [];
            $.each(td, function (i) {
                if (!$(this).is(':has(button)')) {
                    saveItem.push($(this).find(':first-child').val());
                }
            });
            $.ajax({
                type: 'PUT',
                data: {data: JSON.stringify(saveItem), id: id},
                success: function (data) {
                    window.location.reload();
                },
                error: function (err) {
                    console.log(err);
                }
            })
        });
    });

});
//Конец users


$(function(){
    //Start TOP_LOCATIONS
    //Обработка клика на кнопку добавить
    var string = '<tr class ="str">' +
        '<td>' +
        '<div class="form-group">' +
        '<input type="text" class="form-control">' +
        '</div>' +
        '</td>' +
        '</tr>';

    $('#addItemLoc').click(function(){
        $('.addItemtableLoc').append(
            '<table class="table table-bordered">' +
            '<thead>' +
            '<th>Название</th>' +
            '</thead>' +
            '<tbody class="mainTable">' +
            string +
            '</tbody>'
        );

        $(this).addClass('hidden');
        $('#cancelItemLoc').removeClass('hidden');
        $('#addTableLoc').removeClass('hidden');
        $('#saveItemLoc').removeClass('hidden');
        $('#cancelTableLoc').removeClass('hidden');


    });

    //при клике на отмена
    $('#cancelItemLoc').click(function(){
        $('.addItemtableLoc').empty();
        $('#addItemLoc').removeClass('hidden');
        $(this).addClass('hidden');
        $('#addTableLoc').addClass('hidden');
        $('#saveItemLoc').addClass('hidden');
        $('#cancelTableLoc').addClass('hidden');
    });

    //при клике сохранить
    $('#saveItemLoc').click(function(){
        var data = [];
        var col = [];
        $('.str').each(function(i){
            var mas = [];
            col.push(i+1);
            $(this).find('.form-group').children().each(function(){
                mas.push($(this).val());
            });
            data.push(mas);
        });
        $.ajax({
            url: '/admin/top_locations/',
            type: 'POST',
            data: {data: JSON.stringify(data), col: JSON.stringify(col)},
            success: function(data){
                window.location.reload();
            },
            error: function(err){
                console.log(err);
            }
        })
    });

    //при клике на удалить строчку
    $('#cancelTableLoc').click(function(){
        $('.str').last().remove();
    });

    //при клике на добавить строчку
    $('#addTableLoc').click(function(ev){
        $('.mainTable').append(string);
    });

    $('.redactorLoc').click(function() {
        $('.redactorLoc').addClass('hidden');
        var id = $(this).data('red');
        var tr = $(this).parent().parent();
        var td = tr.children('td');
        var text = [];
        $.each(td, function (i) {
            text.push($(this).text());
            if (!$(this).is(':has(button)')) {
                $(this).empty();
                $(this).append('<input type="text" class="form-control" value="' + text[i] + '">');
            }
        });

        //создание кнопок
        $('.btn-top-panel').append(
            '<button class="btn btn-danger" type="button" id="cancelRedactor"> Отменить' +
            '<button class="btn btn-success" type="button" id="saveRedactor"> Сохранить'
        );

        //обработка клика на кнопку отменить
        $(document).on('click', '#cancelRedactor', function () {
            $('.redactorLoc').removeClass('hidden');
            $.each(td, function (i) {
                if (!$(this).is(':has(button)')) {
                    $(this).empty();
                    $(this).text(text[i]);
                }
            });
            $(this).remove();
            $('#saveRedactor').remove();
        });

        //обработка клика на кнопку сохранить
        $(document).on('click', '#saveRedactor', function () {
            var btn = $('#' + id);
            var tr = btn.parent().parent();
            var td = tr.children('td');
            var saveItem = [];
            $.each(td, function (i) {
                if (!$(this).is(':has(button)')) {
                    saveItem.push($(this).find(':first-child').val());
                }
            });
            $.ajax({
                type: 'PUT',
                data: {data: JSON.stringify(saveItem), id: id},
                success: function (data) {
                    window.location.reload();
                },
                error: function (err) {
                    console.log(err);
                }
            })
        });
    });
    //End TOP_LOCATIONS
});

//Начало Сохраненные вариант
$(function(){
    var users = $.ajax({
        url: '/users',
        type: 'GET',
        success: function(data){
        },
        error: function(err){
            console.log(err);
        }
    });
    users.then(function(data){
        data.forEach(function(item){
            $('.userNameAdmin').each(function(){
                if(item.TOP_USER_ID == $(this).text()){
                    $(this).text(item.TOP_USER);
                }
            });

        });

    });
});
//Конец Сохраненные вариант



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


//start redirect for admin
$(function(){
    $('.mouseClick').click(function(){
        document.cookie = 'redId='+$(this).find('.idRedirect').text() +'; path=/;';
        var data = getCookie('redId') || 0;
        window.open('/res/'+data, '_blank');
    });
});
//end redirect for admin

$(function(){
    $(document).on('click', '.generator', function(){
        var pwd = str_rand();
        $('.genPwd').val(pwd);
    });

    //клик редактировать
    $('.sendMail').click(function() {
        var mail = $(this).data('mail');
        var id = $(this).data('id');
        $.ajax({
            url: '/mail',
            type: 'GET',
            data: {mail: mail, id: id},
            success: function(data){
                alert('На почтовый ящик '+mail+" был отправлен пароль");
            },
            error: function(err){
                console.log(err);
            }
        });
    });

    //Загрузка CSV
    $('.file_upload button').click(function(){
        var input = $('#upload').prop('files')[0];
        var data = new FormData();
        if(!input){
            return false;
        }
        data.append('csv', input);
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: data,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            beforeSend: function(){
                $('.file_upload button').button('loading');
            },
            success: function(data){
                $('.file_upload button').button('reset');
                $('#loadCsv').arcticmodal({
                    afterOpen: function(){
                        data.forEach(function(item){
                            $('#csvContent').append(
                                '<tr class="str">'+
                                '<td>' +
                                    '<div class="form-group">' +
                                        '<input type="text" class="form-control" value="'+item.ITEM_AX_ID+'">' +
                                    '</div>' +
                                '</td>' +
                                '<td>' +
                                '<div class="form-group">' +
                                '<input type="text" class="form-control" value="'+item.ITEMNAME+'">' +
                                '</div>' +
                                '</td>' +
                                '<td>' +
                                '<div class="form-group">' +
                                '<input type="text" class="form-control" value="'+item.ITEM_TYPES_ID+'">' +
                                '</div>' +
                                '</td>' +
                                '<td>' +
                                '<div class="form-group">' +
                                '<input type="text" class="form-control" value="'+item.ITEMTHIN+'">' +
                                '</div>' +
                                '</td>' +
                                '<td>' +
                                '<div class="form-group">' +
                                '<input type="text" class="form-control" value="'+item.ITEMWIDTH+'">' +
                                '</div>' +
                                '</td>' +
                                '<td>' +
                                '<div class="form-group">' +
                                '<input type="text" class="form-control" value="'+item.ITEMHEIGHT+'">' +
                                '</div>' +
                                '</td>' +
                                '<td>' +
                                '<div class="form-group">' +
                                '<input type="text" class="form-control" value="'+item.ITEMPRICE+'">' +
                                '</div>' +
                                '</td>'
                            );
                        });
                    }
                });
            },
            error: function(err){
                console.log(err);
            }
        });
    });


});
//генерация пароля
function str_rand() {
    var result       = '';
    var words        = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    var max_position = words.length - 1;
    for( i = 0; i < 11; ++i ) {
        position = Math.floor ( Math.random() * max_position );
        result = result + words.substring(position, position + 1);
    }
    return result;
}
