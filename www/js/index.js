/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        console.log('Received Event: ' + id);
    }
};

jQuery(document).ready(function($) {
    

    var lsAeroportsLoaded = false;

    loadDados = function(condicoes) {

        $('#weather-indicador-localidade span').html(condicoes.estacao+' - '+condicoes.estado+' ('+condicoes.codigo+')')
        $('#data-local').html('<span>'+condicoes.codigo+'</span>'+condicoes.estacao+'<br />'+condicoes.estado)
        $('#weather-hora span').html(condicoes.atualizacao)
        $('#weather-pressao span').html(condicoes.pressao+'hPa')
        $('#weather-temperatura span').html(condicoes.temperatura+'°C')
        $('#weather-tempo span').html(condicoes.tempo_desc   )
        $('#weather-umidade span').html(condicoes.umidade+'%')

        if (condicoes.vento_dir > 338 || condicoes.vento_dir <= 23) condicoes.vento_dir = 'N';
        else if (condicoes.vento_dir > 23 || condicoes.vento_dir <= 68) condicoes.vento_dir = 'NE';
        else if (condicoes.vento_dir > 68 || condicoes.vento_dir <= 113) condicoes.vento_dir = 'E';
        else if (condicoes.vento_dir > 113 || condicoes.vento_dir <= 158) condicoes.vento_dir = 'SE';
        else if (condicoes.vento_dir > 158 || condicoes.vento_dir <= 203) condicoes.vento_dir = 'S';
        else if (condicoes.vento_dir > 203 || condicoes.vento_dir <= 248) condicoes.vento_dir = 'SW';
        else if (condicoes.vento_dir > 248 || condicoes.vento_dir <= 293) condicoes.vento_dir = 'W';
        else if (condicoes.vento_dir > 293 || condicoes.vento_dir <= 338) condicoes.vento_dir = 'NW';

        $('#weather-vento span').html(condicoes.vento_dir+'  Velocidade: '+condicoes.vento_int+' km/h')
        $('#weather-visibilidade span').html(condicoes.visibilidade)
    }

    loadAeroportos = function(aeroportos) {


        $.each(aeroportos, function(index,aeroporto) {
            
            var html = '<li data-id="'+aeroporto.sigla+'">'+
                            '<span>'+aeroporto.sigla+'</span>'+
                            '<div class="dados">'+
                                '<div class="localizacao">'+
                                    'Lat: '+aeroporto.latitude+' Long: '+aeroporto.longitude+
                                '</div>'+
                                '<div class="localizaca-nome">'+
                                    aeroporto.nome+' / '+aeroporto.sigla+
                                '</div>'+
                            '</div>'+
                        '</li>';
            $('#lista-aeroportos').append(html);
        });

    }

    buscarDados = function(estacao,latitude,longitude) {
        
        showDados();
        
        $('#tela-data').addClass('active');
        $.ajax({
            url: 'http://www.h33.com.br/sync/h33/geolocation.php',
            type: 'GET',
            dataType: 'json',
            data: { estacao : estacao, latitude: latitude, longitude: longitude },
            success: function(condicoes, textStatus, xhr) {
                $('#tela-data').removeClass('active');
                loadDados(condicoes);
                window.localStorage.setItem('local',JSON.stringify(condicoes))
            },
            error: function(xhr, textStatus, errorThrown) {
                $('#tela-data').removeClass('active');
                console.log(xhr)
            }
        });
    }

    showListaAeroportos = function() {
        $('#tela-data').addClass('right').removeClass('center')
        $('#tela-aeroportos').addClass('center').removeClass('left');

        if (!lsAeroportsLoaded && window.localStorage.getItem('aeroportos') == null) {
            $('#tela-aeroportos').addClass('active');
            $.ajax({
                url: 'http://www.h33.com.br/sync/h33/aeroportos.php',
                type: 'GET',
                dataType: 'json',
                success: function(aeroportos, textStatus, xhr) {
                    $('#tela-aeroportos').removeClass('active');
                    loadAeroportos(aeroportos);
                    window.localStorage.setItem('aeroportos',JSON.stringify(aeroportos))
                },
                error: function(xhr, textStatus, errorThrown) {
                    $('#tela-aeroportos').removeClass('active');
                    console.log(xhr)
                }
            });
        } else if (!lsAeroportsLoaded) {
            loadAeroportos(JSON.parse(window.localStorage.getItem('aeroportos')));
        }


    }
    showDados = function() {
        $('#tela-data').addClass('center').removeClass('right')
        $('#tela-aeroportos').addClass('left').removeClass('center')
    }

    $( document ).on( "swipeleft", showDados);
    $( document ).on( "swiperight", showListaAeroportos);

    $('#tela-aeroportos > div').height($(window).height())
    $('#tela-data > div').height($(window).height());

    $('#lista-aeroportos li').click(function(event) {

        buscarDados($(this).attr('data-id'))
        
    });
    $('#logo-mini').click(function(event) {
        showListaAeroportos();
    });
    $('.localizar').click(function(){
        try {
            var onSuccess = function(position) {
                 buscarDados('',position.coords.latitude,position.coords.longitude)
            }
            function onError(error) {
                alert('code: '    + error.code    + '\n' +
                      'message: ' + error.message + '\n');
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } catch (e) {
            alert(e)
        }
    });

    if (window.localStorage.getItem('local') == null) {
        console.log('aa')
        buscarDados('SBJV')
        console.log('aa')
    } else {
        console.log(window.localStorage.getItem('local'))
        loadDados(JSON.parse(window.localStorage.getItem('local')));
    }
});