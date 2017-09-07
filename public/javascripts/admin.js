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
// $(function(){
//     var select;
//     var string;
//     $.ajax({
//         url: "/jobuom",
//         type: 'GET',
//         success: function(data){
//             select = '<select class="form-control">' +
//                 '<option></option>';
//             data.forEach(function (item) {
//                 select += '<option value="'+ item.UOMS_ID +'">'+ item.UOM +'</option>';
//             });
//
//             select += '</select>';
//             string = '<tr class="str">' +
//                 '<td>' +
//                 '<div class="form-group">' +
//                 '<input type="text" class="form-control jobDesc">' +
//                 '</div>' +
//                 '</td>' +
//                 '<td>' +
//                 '<div class="form-group">' +
//                 '<input type="number" class="form-control jobPrice">' +
//                 '</div>' +
//                 '</td>' +
//                 '<td>' +
//                 '<div class="form-group">' +
//                 select+
//                 '</div>' +
//                 '</td>' +
//                 '<td>' +
//                 '</tr>';
//         },
//         error: function (err) {
//             console.log(err);
//         }
//     });
//     $('#addItemJob').click(function(){
//
//         $('.addItemtable').append(
//             '<table class="table table-bordered addItemTableJob">' +
//             '<thead>' +
//             '<th>Описание работы</th>' +
//             '<th>Цена работы</th>' +
//             '<th>Единица измерения</th>' +
//             '</thead>' +
//             '<tbody class="mainTable">' +
//             string+
//             '</tbody>'
//         );
//
//         $(this).addClass('hidden');
//         $('#cancelItemJob').removeClass('hidden');
//         $('#addTableJob').removeClass('hidden');
//         $('#saveItemJob').removeClass('hidden');
//         $('#cancelTableJob').removeClass('hidden');
//
//
//     });
//
//     //при клике на отмена
//     $('#cancelItemJob').click(function(){
//         $('.addItemTable').remove();
//         $('#addItemJob').removeClass('hidden');
//         $(this).addClass('hidden');
//         $('#addTableJob').addClass('hidden');
//         $('#saveItemJob').addClass('hidden');
//         $('#cancelTableJob').addClass('hidden');
//     });
//
//     //при клике сохранить
//     $('#saveItemJob').click(function(){
//         var data = [];
//         var col = [];
//         $('.str').each(function(i){
//             var mas = [];
//             col.push(i+1);
//             $(this).find('.form-group').children().each(function(){
//                 mas.push($(this).val());
//             });
//             data.push(mas);
//         });
//         console.log(data);
//         $.ajax({
//             url: '/admin/jobparams/',
//             type: 'POST',
//             data: {data: JSON.stringify(data), col: JSON.stringify(col)},
//             success: function(data){
//                 window.location.reload();
//             },
//             error: function(err){
//                 console.log(err);
//             }
//         })
//     });
//
//     //при клике на удалить строчку
//     $('#cancelTableJob').click(function(){
//         $('.str').last().remove();
//     });
//
//     //при клике на добавить строчку
//     $('#addTableJob').click(function(ev){
//         $('.mainTable').append(string);
//     });
//
// });
//Конец Спецификации