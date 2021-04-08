import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import '../../../public/dist/css/register.css';
import 'regenerator-runtime/runtime';
import axios from 'axios';


const $form = $('#register-form');
const $countryListSelect = $('#country');

$(document).ready(async function(){

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

    // Get country list from an api
    const countryListObj = await getCountryList();
    let countryListData = countryListObj;
    console.log(countryListData);
    // for(const data in countryListData) {
    //     console.log(countryListData[data].country);
    // }


});

const getCountryList = async () => {
    return axios.get('https://restcountries.eu/rest/v2/all');
};