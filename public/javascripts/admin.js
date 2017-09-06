$(function(){
    var select;
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
        },
        error: function (err) {
            console.log(err);
        }
    });



    $('#addItem').click(function(){

        var string = '<tr class="str">' +
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
                    '<tr class="str">' +
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
                                '<input type="text" class="form-control itemPrice">' +
                            '</div>' +
                        '</td>' +
                    '</tr>' +
                '</tbody>'
        );


        $(this).addClass('hidden');
        $('#cancelItem').removeClass('hidden');
        $('#addTable').removeClass('hidden');
        $('#saveItem').removeClass('hidden');
        $('#cancelTable').removeClass('hidden');

        //при клике на добавить строчку
        $('#addTable').click(function(){
            $('.mainTable').append(string);
        });

        //при клике на удалить строчку
        $('#cancelTable').click(function(){
            $('.str').last().remove();
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
    });

    //клик на кнопку удаление в таблицу
    $('.close').click(function(){
        var name = $(this).data('name');
        var id = $(this).data('id');
        var res = confirm("Вы действительно хотите удалить материал " + name + "?");
        if(res){
            $.ajax({
                url: '/delete',
                type: 'DELETE',
                data: {id: id},
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