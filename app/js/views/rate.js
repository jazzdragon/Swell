define([
	'backbone',
	'jade',
	'moment',
	'text!templates/rate.jade',
	'views/rate-field'
], function(Backbone, jade, moment, template, RateField){
	'use strict'

	return Backbone.View.extend({

		template: jade.compile(template),

		newRating: {},

		fields: {
			overall: {
				header: 'Overall Wave Quality',
				max: 10,
				unit: '/ 10',
				fieldName: 'overall',
				value: 0
			},
			waveHeight: {
				header: 'Wave Height',
				max: 12,
				unit: 'ft',
				fieldName: 'waveHeight',
				value: 0
			},
			wind: {
				header: 'Wind',
				max: 4,
				fieldName: 'wind',
				value: 0
			},
			crowd: {
				header: 'Crowd',
				max: 200,
				unit: 'surfers',
				fieldName: 'crowd',
				value: 0
			}
		},

		events: {
			'change .rating-input-range': 'updateRatings',
			'click .button-submit': 'submit'
		},

		initialize: function(){
			this.render()
			this.$el.find('a.rate-nav').attr('href', '#view-spot/' + this.id)
		},

		render: function(){
			this.$el.html(this.template({header: this.id}))
			// not setting .wrapper as $el to keep all events within scope
			$('.wrapper').html(this.el)
			this.renderFields()
		},

		/**
		 * render the rating fields with a different template
		 * refactor: make into a seperate view
		 */
		renderFields: function(){
			this.rateFields = _.map(this.fields, this.renderField, this)
		},

		renderField: function(field){
			var rateField = new RateField({attributes: field})
			this.$el.find('.ratings').append(rateField.$el)
			return rateField
		},

		// hacky... bad...
		decypherWindValue: function(val){
			var values = [
				'None (0-3 knots)',
				'Calm (4-9 knots)',
				'Strong (10-20 knots)',
				'High (20-40 knots)',
				'Stormy (40+ knots)'
			]
			return _.indexOf(values, val)
		},

		submit: function(){
			var newRating = {time: Date.now(), spot_name: this.id}
			_.each(this.rateFields, function(field){
				if (field.attributes.fieldName === 'wind') {
					field.attributes.value = this.decypherWindValue(field.attributes.value)
				}
				if (field.attributes.changed === true){
					newRating[field.attributes.fieldName] = field.attributes.value
				}
			},this)
			this.collection.create(newRating)
			this.remove()
		}


	})

})