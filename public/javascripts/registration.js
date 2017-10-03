$(function(){
    //Вход под гостем
    $(function(){
        $('#guest').click(function(){
            console.log(123);
            $('#inputEmail').val('Guest');
            $('#inputPassword').val('Guest');
            $('.login').click();
        });
    });
});
// $(function(){
//     $( ".next" ).on( "click", function( event ) {
//         var location = $('#location');
//         var username = $('#username');
//         var pwd1 = $('#pwd1');
//         var pwd2 = $('#pwd2');
//         var fio = $('#fio');
//         var data = {};
//         data.location = +location.val();
//         data.username = username.val();
//         data.pwd1 = pwd1.val();
//         data.fio = fio.val();
//         if(validate(location, username, pwd1, pwd2, fio)){
//             $(this).attr('type', 'submit');
//             $(this).click();
//         }else{
//             return false;
//         }
//     });
// });
//
// function validate(location, username, pwd1, pwd2, fio){
//     var flag = true;
//
//     if(location.val() === ''){
//         Snackbar.show({
//             text: 'Заполните все поля',
//             textColor: '#d81616',
//             pos: 'top-center',
//             actionText: null
//         });
//         location.parent().addClass('has-error');
//         flag =  false;
//     }else {
//         location.parent().removeClass('has-error');
//         location.parent().addClass('has-success');
//         flag = true;
//     }
//     if(username.val() === ''){
//         Snackbar.show({
//             text: 'Заполните все поля',
//             textColor: '#d81616',
//             pos: 'top-center',
//             actionText: null
//         });
//         username.parent().addClass('has-error');
//         flag =  false;
//     }else{
//         username.parent().removeClass('has-error');
//         username.parent().addClass('has-success');
//         flag = true;
//     }
//     if(pwd1.val() === ''){
//         Snackbar.show({
//             text: 'Заполните все поля',
//             textColor: '#d81616',
//             pos: 'top-center',
//             actionText: null
//         });
//         pwd1.parent().addClass('has-error');
//         flag =  false;
//     }else{
//         pwd1.parent().removeClass('has-error');
//         pwd1.parent().addClass('has-success');
//         flag = true;
//     }
//     if(pwd2.val() === ''){
//         Snackbar.show({
//             text: 'Заполните все поля',
//             textColor: '#d81616',
//             pos: 'top-center',
//             actionText: null
//         });
//         pwd2.parent().addClass('has-error');
//         flag =  false;
//     }else{
//         pwd2.parent().removeClass('has-error');
//         pwd2.parent().addClass('has-success');
//         flag = true;
//     }
//     if(fio.val() === ''){
//         Snackbar.show({
//             text: 'Заполните все поля',
//             textColor: '#d81616',
//             pos: 'top-center',
//             actionText: null
//         });
//         fio.parent().addClass('has-error');
//         flag =  false;
//     }else{
//         fio.parent().removeClass('has-error');
//         fio.parent().addClass('has-success');
//         flag = true;
//     }
//
//
//     if(username.val().length <= 2 || username.val().length > 11){
//         Snackbar.show({
//             text: 'Логин должен содержать от 3 до 12 символов',
//             textColor: '#d81616',
//             pos: 'top-center',
//             actionText: null
//         });
//         username.parent().addClass('has-error');
//         flag =  false;
//     }else{
//         username.parent().removeClass('has-error');
//         username.parent().addClass('has-success');
//         flag =  true;
//     }
//     if(pwd1 && pwd2){
//         if(pwd1.val() !== pwd2.val()){
//             Snackbar.show({
//                 text: 'Пароли не совпадают',
//                 textColor: '#d81616',
//                 pos: 'top-center',
//                 actionText: null
//             });
//             pwd1.parent().addClass('has-error');
//             pwd2.parent().addClass('has-error');
//             flag = false;
//         }else{
//             pwd1.parent().removeClass('has-error');
//             pwd2.parent().removeClass('has-error');
//             pwd1.parent().addClass('has-success');
//             pwd2.parent().addClass('has-success');
//             flag = true;
//         }
//         if(pwd1.val().length < 6 || pwd1.val().length > 11 || pwd2.val().length < 6 || pwd2.val().length > 11){
//             Snackbar.show({
//                 text: 'Пароль должен содержать от 5 до 12 символов',
//                 textColor: '#d81616',
//                 pos: 'top-center',
//                 actionText: null
//             });
//             pwd1.parent().addClass('has-error');
//             pwd2.parent().addClass('has-error');
//             flag = false;
//         }else{
//             pwd1.parent().removeClass('has-error');
//             pwd2.parent().removeClass('has-error');
//             pwd1.parent().addClass('has-success');
//             pwd2.parent().addClass('has-success');
//             flag = true;
//         }
//     }
//     return flag;
// }