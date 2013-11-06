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


        var html = _.template($('#template-dados').html(),condicoes);
        $('#data-local').html(html);


        var html = _.template($('#template-info').html(),condicoes);
        $('.data-informacoes').html(html);

        $('#weather-list').html('');

        var _template_item = $('#template-weather-item').html();
        if (parseInt(condicoes.texto_vento_velocidade) > 0) {
            var item = { img: 'wind', descricao: 'Vento', valor: condicoes.texto_vento_velocidade+'KT', valor2: '', sub: condicoes.texto_vento_direcao_sigla };

            if (parseInt(condicoes.texto_vento_rajada) > 0) item.valor2 = '/'+condicoes.texto_vento_rajada+'KT';

            $('#weather-list').append(_.template(_template_item,item));
        }
        if (condicoes.texto_temperatura_atual != '') {
            var item = { img: 'temperatura', descricao: 'Temperatura', valor: condicoes.texto_temperatura_atual+'°C', valor2: '', sub: '' };

            if (condicoes.texto_temperatura_orvalho != '') item.sub = 'Orvalho: '+condicoes.texto_temperatura_orvalho+'°C';

            $('#weather-list').append(_.template(_template_item,item));
        }
        if (condicoes.json_temporecente.length > 0) {
            _.each(JSON.parse(condicoes.json_temporecente), function(cond) {

                if (typeof cond.precipitacao != 'undefined') {
                    var item = { img: 'rain', descricao: 'Tempo', valor: cond.precipitacao, valor2: '', sub: '' };

                    if (typeof cond.intensidade != 'undefined') {
                        item.sub = cond.intensidade;
                    }
                } else if (typeof cond.obscurecedor != 'undefined') {
                    var item = { img: 'suncloud', descricao: 'Tempo', valor: cond.obscurecedor, valor2: '', sub: '' };
                }

                $('#weather-list').append(_.template(_template_item,item));
            })
        }
        if (condicoes.texto_umidade != '') {
            var item = { img: 'umidade', descricao: 'Úmidade', valor: condicoes.texto_umidade, valor2: '', sub: 'relativa' };

            $('#weather-list').append(_.template(_template_item,item));
        }
        if (condicoes.texto_pressao != '') {
            var item = { img: 'pressure', descricao: 'Pressão', valor: condicoes.texto_pressao, valor2: '', sub: '' };

            $('#weather-list').append(_.template(_template_item,item));
        }
        if (condicoes.texto_visibilidade != '') {
            var item = { img: 'visibilidade', descricao: 'Visibilidade', valor: condicoes.texto_visibilidade, valor2: '', sub: '' };

            $('#weather-list').append(_.template(_template_item,item));
        }
        if (condicoes.json_nuvens.length > 0) {
            _.each(JSON.parse(condicoes.json_nuvens), function(cond) {

                var item = { img: 'cloud', descricao: 'Nuvens', valor: cond.descritor, valor2: '', sub: cond.sub };

                $('#weather-list').append(_.template(_template_item,item));
            })
        }



        setTimeout(function() {
            $('#main').height($('#tela-data').height());    
        },100)
        

        /*$('#weather-indicador-localidade span').html(condicoes.estacao+' - '+condicoes.estado+' ('+condicoes.codigo+')')
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
        $('#weather-visibilidade span').html(condicoes.visibilidade)*/
    }

    loadAeroportos = function(aeroportos) {

        lsAeroportsLoaded = true;
        $.each(aeroportos, function(index,aeroporto) {
            
            var html = _.template($('#template-aeroporto').html(),aeroporto);
            $('#lista-aeroportos').append(html);
        });
        
        $('#lista-aeroportos li').on('click',function(event) {

            buscarDados($(this).attr('data-id'))
        });
        $('#main').height($('#lista-aeroportos li').length * 300)

    }

    buscarDados = function(estacao,latitude,longitude) {
        
        showDados();

        $(window).scrollTop(0);
        
        $('#tela-data').addClass('active');
        $.ajax({
            url: 'http://qg.clientes.lepard.com.br/hangar33/metar/get',
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

        $(window).trigger('resize')

        if (!lsAeroportsLoaded) {
            $('#tela-aeroportos').addClass('active');
            $.ajax({
                url: 'http://qg.clientes.lepard.com.br/hangar33/metar/get',
                type: 'GET',
                dataType: 'json',
                success: function(aeroportos, textStatus, xhr) {
                    $('#tela-aeroportos').removeClass('active');
                    loadAeroportos(aeroportos);
                },
                error: function(xhr, textStatus, errorThrown) {
                    $('#tela-aeroportos').removeClass('active');
                }
            });
        }


    }
    showDados = function() {

        $('#tela-data').addClass('center').removeClass('right')
        $('#tela-aeroportos').addClass('left').removeClass('center');
        $('#main').height($('#tela-data').height());

    }

    $( document ).on( "swipeleft", showDados);
    $( document ).on( "swiperight", showListaAeroportos);

    // $('#tela-aeroportos > div').css('minHeight',$(window).height())
    // $('#tela-data > div').css('minHeight',$(window).height());

    $('#logo-mini').click(function(event) {
        showListaAeroportos();
    });
    /*$('.localizar').click(function(){
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
    });*/

    if (window.localStorage.getItem('local') == null) {
        buscarDados('SBJV')
    } else {
        console.log(window.localStorage.getItem('local'))
        loadDados(JSON.parse(window.localStorage.getItem('local')));
    }
});