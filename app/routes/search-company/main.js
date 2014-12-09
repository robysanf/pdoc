import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var _this = this, app_controller = _this.controllerFor('application'), controller = _this.controllerFor('search-company.main'),
            data = this.getProperties();

        app_controller.set('records_company', this.store.find('company'));

        data.model = 'company';
        data.field = 'service';
        $.post('api/custom/tag?token=' + app_controller.token, data).then(function(response){
                app_controller.set('auto_suggest_Services', response.tags);
        }, function( response ){
            app_controller.send( 'message_manager', 'Failure', response );
        });

        controller.set('is_loading', false);
        controller.set('before_search', true);
    },

    actions: {
        search_records: function() {
            var self = this,app_controller =self.controllerFor('application'), controller = self.controllerFor('search-company.main'),
                queryExpression = 'sortBy="code"';
            controller.set('is_loading', true);
            controller.set("shipmentList", null);

            /*     ***infinite scroll***     */
            app_controller.set('searchResultList', []);
            app_controller.set('isAll', false);
            app_controller.set('perPage', 25);
            app_controller.set('firstIndex', 0);
            app_controller.set('items', []);



            //recupero l'id del booking scelto
            if(controller.name != "" && controller.name != null ){
//                searchPath = "id"; queryExpression[searchPath] = controller.name;
                queryExpression = queryExpression+'&id="'+controller.name+'"';
            }
            //recupero l'id del booking scelto
            if(controller.search_type != "" && controller.search_type != null ){
//                searchPath = "type"; queryExpression[searchPath] = controller.search_type;
                queryExpression = queryExpression+'&type="'+controller.search_type+'"';
            }
            //recupero l'id del booking scelto
            if(controller.search_country != "" && controller.search_country != null ){
//                searchPath = "country"; queryExpression[searchPath] = controller.search_country;
                queryExpression = queryExpression+'&country="'+controller.search_country+'"';
            }

            if(controller.search_services != "" && controller.search_services != null ){
                  var services_string;
                controller.search_services.filter(function( value, index ){
                    if( index === 0 && controller.search_services.get('length') !== 1){          //è il primo valore e ce ne sono altri nella lista
                        services_string = '"'+value+'",';
                    } else if ( index+1 === controller.search_services.get('length') && controller.search_services.get('length') !== 1){     //è l'ultimo valore della lista e ce ne erano altri prima
                        services_string = services_string +'"'+value+'"';
                        queryExpression = queryExpression+'&services={"or":['+services_string+']}';
                    }else if ( controller.search_services.get('length') === 1 ){                       // cè solo un valore nella lista
                        services_string = '"'+value+'"';
                        queryExpression = queryExpression+'&services={"or":['+services_string+']}';
                    } else{                                                      //valori intermedi nella lista
                        services_string = services_string +'"'+value+'",';
                    }
                });

//                searchPath = "country"; queryExpression[searchPath] = controller.search_country;
// queryExpression = queryExpression+'&booking={"booking/state":{"or":["edit","lock","request","pending"]}}';

            }

            this.store.findQuery('company', queryExpression).then(function(queryExpressResults){

                /*     ***infinite scroll***     */
                app_controller.set("queryExpressResults_length", queryExpressResults.get('length'));
                app_controller.set("queryExpressResults", queryExpressResults);

                controller.set('is_loading', false);
                controller.set('before_search', false);

                queryExpressResults.forEach(function(equ, index){
                    if(index+1 <= app_controller.perPage) {
                        app_controller.items.pushObject(equ);

                        if(index+1 === queryExpressResults.get('length')){
                            renderResults();
                            return false;
                        }
                    } else {
                        renderResults();
                        return false;
                    }
                });

                function renderResults() {
                    app_controller.set('firstIndex', app_controller.perPage);
                    app_controller.set("searchResultList", app_controller.items);

                }
            }, function( reason ){
                app_controller.send( 'error', reason );
            });
        },

        /**
         Gestione delle transizioni tra parziali

         @action transition_to
         @for your-profile/main-page
         @param {string} path del parziale che si vuole a lyout
         @param {record} entità legate a company - (driver/truck/trailer/clerk)
         */
        transition_to: function( path, record, var1, value1, var2, value2 ) {
            var _this = this, app_controller = _this.controllerFor('application');
            switch ( path ) {
                case 'your-profile/main':
                    _this.transitionTo( path, record );
//                    this.controller.set( 'sub_record', record );
//                    this.controller.set( 'transition_to_list', false );
//                    this.send('set_variable', var1, value1);
                    break;
            }
        }
    }
});
