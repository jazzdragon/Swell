define(['backbone', 'models/rating', 'localStorage'], function(Backbone, rating, Store){
	'use strict';
	
	return Backbone.Collection.extend({
		
		model: rating,

		localStorage: new Store('ratings'),

		initialize: function(){
			this.on('add', this.addRating);
		},

		getAverage: function(spot_name, field){
			var currentTime = Date.now();
			// 43200000 - ms to 6 hours
			var cutOff = currentTime - 21600000;
			var ratings = _.chain(this)
				// get ratings for relevant spot
				.where({spot_name: spot_name})
				// get rid of old ratings
				.filter(function(val){
					return (val.time > cutOff);
				})
				.value();

			var voteAmount = _.reduce(ratings, function(memo, num){
				return memo + num.time;
			}, 0);

			var tallyVotes = _.reduce(ratings, function(memo, num){
				// tally all the ratings of the passed field, multiplied by the time
				return memo + (num.time * num[field]);
			}, 0);

			return tallyVotes / voteAmount || 0;

		}

	});
	
});