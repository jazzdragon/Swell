define([
	'backbone',
	'jade',
	'moment',
	'views/avatar',
	'views/view-rating',
	'text!templates/view.jade'
], function(Backbone, jade, moment, Avatar, ViewRating, template){
	'use strict'

	return Backbone.View.extend({

		template: jade.compile(template),

		fields: {
			overall: {
				header: 'Overall Wave Quality',
				unit: '/ 10',
				fieldName: 'overall'
			},
			waveHeight: {
				header: 'Wave Height',
				unit: 'ft',
				fieldName: 'waveHeight'
			},
			wind: {
				header: 'Wind',
				fieldName: 'wind'
			},
			crowd: {
				header: 'Crowd',
				unit: 'surfers',
				fieldName: 'crowd'
			}
		},

		initialize: function(){
			this.listenTo(this.collection, 'fetched', this.render)
		},

		render: function(){
			
			this.getAverages()

			this.$el.html(this.template({header: this.attributes.title}))
			// not setting .wrapper as $el to keep all events within scope
			$('.wrapper').html(this.el)

			this.renderFields()

			this.$('.user').html(new Avatar({model: this.attributes.user}).$el)
			this.$('a.rate-nav').attr('href', '#spot/' + this.attributes.title + '/' + this.id)
		},

		/**
		 * render the rating fields with a different template
		 * refactor: make into a seperate view
		 */
		renderFields: function(){
			_.each(this.fields, function(field){
				var rateField = new ViewRating({attributes: field})
				this.$('.ratings').append(rateField.$el)
				
			}, this)
		},

		/**
		 * reset fields, get available averages
		 */
		getAverages: function(){
			var fieldKeys = _.keys(this.fields)
			_.each(fieldKeys, function(key, i){
				this.fields[key].value = this.collection.getAverage(key)
				this.fields[key].time = this.collection.getTime(key)
				this.fields[key].votes = this.collection.getNumberOfVotes(key)
			},this)
		}


	})

})