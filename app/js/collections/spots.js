define(['backbone', 'models/spot'], function(Backbone, spot){
	'use strict';
	
	return Backbone.Collection.extend({
		
		model: spot

	});

});