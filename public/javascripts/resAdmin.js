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
    var data = getCookie('redId') || 0;
    console.log(data);
    $('.last').remove();
    $('input[name=sideProfile]').prop('checked', false);
    var asyncData = $.ajax({
        url: '/drawAdmin',
        type: 'POST',
        data: {id: data},
        success: function(data){
        },
        error: function(err){
            console.log(err);
        }
    });
    asyncData.then(function(Asdata){
        console.log(Asdata);
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
            $('.price').find('h2').text(Asdata[0].PRICE);
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