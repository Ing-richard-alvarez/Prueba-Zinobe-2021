import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import '../../../public/dist/css/login.css';

const $form = $('#login-form');

$(document).ready(function(){
    
    $form    
        .attr({
            'method' : 'post',
            'action' : 'javascript:void(0)'
        })
        .on('submit',function(e){
            e.preventDefault();
            return false;
        })
    ;

});