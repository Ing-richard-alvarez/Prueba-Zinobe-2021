import "core-js/stable";
import "regenerator-runtime/runtime";

import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';

import axios from 'axios';
import _ from 'lodash';

//datatable
import 'datatables.net'
import 'datatables.net-dt';

$(document).ready(async function(){
    
    let contactList = {};
    
    const $inputSearch = $('#txt-search-contact');
    const $inputCurrentId = $('#current-id');
    const $btnSearch = $("#btn-search-contact");
    const $modalSearchResult = $("#modal-result-search");
    const $modalContactList = $("#modal-loading-contact-list");
    const $dataTableContact = $('#table_contact');
    
    // get all contacts from the api
    if($dataTableContact.length > 0) {
        $dataTableContact.addClass('d-none');
        $modalContactList.modal('show');
        const contact = await getContactList();
        contactList = contact.data.objects;
        $modalContactList.modal('hide');
        
        console.log('contact list has been created');
    }
    

    // init datatable
    const table = $dataTableContact
        .DataTable( {
            "data": contactList,
            "columns": [
                { "data": "id" },
                { "data": "first_name" },
                { "data": "last_name" },
                { "data": "email" },
                { "data": "document" },
                { "data": "job_title" },
                { "data": "country" }
            ],
            "pagingType": "simple_numbers",
            "language": {
                "decimal":        "",
                "emptyTable":     "Datos no disponible en la tabla",
                "info":           "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                "infoEmpty":      "Mostrando 0 a 0 de 0 entradas",
                "infoFiltered":   "(filtrado desde _MAX_ entradas)",
                "infoPostFix":    "",
                "thousands":      ",",
                "lengthMenu":     "Ver _MENU_ entradas",
                "loadingRecords": "Cargando...",
                "processing":     "Procesando...",
                "search":         "Buscar:",
                "zeroRecords":    "Ningún registro encontrado",
                "paginate": {
                    "first":      "Primero",
                    "last":       "Último",
                    "next":       "Siguiente",
                    "previous":   "Anterior"
                },
                "aria": {
                    "sortAscending":  ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                }
            }
        } )
    ;

    $dataTableContact.removeClass('d-none');

    // Saving result of the search 
    table.on('search.dt', async function(){
        
        const valueFilter = table.search();
        let inputCurrentId = $inputCurrentId.val();

        let metadata = '';

        console.log(valueFilter);

        const userDocumentFound =  
            _.findKey(
                contactList, 
                function(contact) { 
                    return contact.document == valueFilter.charAt(0).toUpperCase() + valueFilter.slice(1); 
                }
            )
        ;
        const userNameFound =  
            _.findKey(
                contactList, 
                function(contact) { 
                    return contact.first_name == valueFilter.charAt(0).toUpperCase() + valueFilter.slice(1); 
                }
            )
        ;
        const userEmailFound = 
            _.findKey(
                contactList, 
                function(contact) { 
                    return contact.email == valueFilter; 
                }
            )
        ;

        // validating result of the search
        if(contactList[userDocumentFound]){

            metadata = JSON.stringify(contactList[userDocumentFound]);
            await callServiceSaveRequest(inputCurrentId,metadata);

        } else if(contactList[userNameFound]) {
            
            metadata = JSON.stringify(contactList[userNameFound]);
            await callServiceSaveRequest(inputCurrentId,metadata);
            
        } else if(contactList[userEmailFound]) {
            
            metadata = JSON.stringify(contactList[userEmailFound]);
            await callServiceSaveRequest(inputCurrentId,metadata);
        
        }

    });
   
});

const getContactList = async () => {
    return axios.get('http://www.mocky.io/v2/5d9f39263000005d005246ae?mocky-delay=1s');
};

const callServiceSaveRequest = async (userId,metadata) => {
    
    var formData = new FormData(); 
    formData.append('userId', userId);
    formData.append('metadata', metadata);

    axios.post('/s/service-save-request', 
            formData
        )
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            
            const errorData = error.response.data;
            
            console.log(errorData);

        })
    ;

}
