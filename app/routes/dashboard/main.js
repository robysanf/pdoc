import Ember from 'ember';

export default Ember.Route.extend({

    model: function( ) {
        return this.store.find('post');
        //console.log("Posts" + posts);
//        return posts;
    },

    actions: {
            submit: function( ){
                var _this = this;
                console.log("Title: " + this.controller.postTitle);
                console.log("Description: " + this.controller.postDescription);
                var adesso = moment().format();
                console.log("Adesso" + adesso)

                this.store.createRecord('post', {
                    name: "Post",
                    title: _this.controller.postTitle,
                    description: _this.controller.postDescription,
                    date: adesso
                }).save().then(function(){
                    console.log("post ok");
                }, function(){
                    console.log("post ko");
                });

                this.controller.postTitle = null;
                this.controller.postDescription = null;


            }
    }


});
