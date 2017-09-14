//Параметры материала
$(function(){
    var select;
    var string;
    $.ajax({
        url: "/itemType",
        type: 'GET',
        success: function(data){
            select = '<select class="form-control">' +
                '<option></option>';
            data.forEach(function (item) {
                select += '<option value="'+ item.ITEM_TYPES_ID +'">'+ item.ITEM_TYPE +'</option>';
            });

            select += '</select>';
            string = '<tr class="str">' +
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

    $('#addItem').click(function(){

        $('.addItemtable').append(
            '<table class="table table-bordered addItemTable">' +
                '<thead>' +
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
        $('#saveItem').removeClass('hidden');
        $('#cancelTable').removeClass('hidden');


    });

    //при клике на отмена
    $('#cancelItem').click(function(){
        $('.addItemTable').remove();
        $('#addItem').removeClass('hidden');
        $(this).addClass('hidden');
        $('#addTable').addClass('hidden');
        $('#saveItem').addClass('hidden');
        $('#cancelTable').addClass('hidden');
    });

    //при клике сохранить
    $('#saveItem').click(function(){
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
        console.log(data);
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
        console.log($(this));
        ev.preventDefault();
        $('.mainTable').append(string);
    });

    //клик на кнопку удаление в таблицу
    $('.close').click(function(){
        var id = $(this).data('id');
        var nameId = $(this).data('nameid');
        console.log(nameId);
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
        var id = $(this).data('red');
        var tr = $(this).parent().parent();
        var td = tr.children('td');
        console.log(tr);
        console.log(td);
        var text = [];
        $.each(td, function(i){
            text.push($(this).text());
            if(!$(this).is(':has(button)')){
                $(this).empty();
                $(this).append('<input type="text" class="form-control" value="'+ text[i] +'">');
            }
            if($(this).is('.itemType')){
                console.log($(this));
                $(this).empty();
                $(this).append(select);
                $('select option[value="' +text[i]+ '"]').prop("selected", true);
            }
        });

        //создание кнопок
        $('.addItemtable').before(
            '<button class="btn btn-danger" type="button" id="cancelRedactor"> Отменить' +
            '<button class="btn btn-success" type="button" id="saveRedactor"> Сохранить'
        );

        //обработка клика на кнопку отменить
        $(document).on('click', '#cancelRedactor', function(){
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
            console.log(btn);
            var tr = btn.parent().parent();
            var td = tr.children('td');
            console.log(td);
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
//Конец параметры материала


//Начало Параматры работы
$(function(){
    var select;
    var string;
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
        console.log(data);
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

});
//Конец параметры работы


//Начало Спецификации
$(function(){
    var select;
    var selectItem;
    var string;

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
        console.log(data);
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
        console.log(data);
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