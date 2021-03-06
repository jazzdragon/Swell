define([
	'backbone',
	'utils/pubsub',
	'views/login',
	'views/location',
	'views/rate',
	'views/spot',
	'views/user-profile',
  'collections/spots',
  ], function(
  	Backbone,
  	pubsub,
  	Login,
  	LocationView,
  	RateView,
  	SpotView,
  	userProfile,
  	Spots
  ){

	return Backbone.Router.extend({

		initialize: function(){
			this.listenTo(this, 'route', this.removeViews)
			pubsub.bind('updateUserSettings', this.updateUserSettings, this)
		},

		routes:{
			'': 'login',
			'location': 'location',
			'spot/:title/:id': 'rate',
			'view-spot/:title/:id': 'spot',
			'user': 'user'
		},

		login: function(){
			if (this.user && this.user.get('_id'))
				return window.location.hash = 'location'
			this.loginView = new Login({ model: this.user })
		},

		location: function(){
			if (this.spots) {
				this.spots.getUserLocation()
  			this.locationView = new LocationView({ collection: this.spots, attributes: {user: this.user} })
				this.spots.trigger('fetched')
			} else {		
			  this.spots = new Spots()
  			this.locationView = new LocationView({ collection: this.spots, attributes: {user: this.user} })
			}

		},

		rate: function(title, id){
			this.rateView = new RateView({ id: id, attributes: {title: title, user: this.user}})
		},

		spot: function(title, id){

			this.spotView = new SpotView({ id: id, attributes: {title: title, user: this.user}})
		},

		user: function(){

			if (!this.user || !this.user.get('_id'))
				return window.location.hash = ''
			this.userView =  new userProfile({model: this.user})

		},

		removeViews: function (route) {
			if (!$('.wrapper').html()) {
				$('.loading-logo').show()
			}
			if (this.loginView && route != 'login') this.detachEvents(this.loginView)
			if (this.locationView && route != 'location') this.detachEvents(this.locationView)
			if (this.rateView && route != 'rate') this.detachEvents(this.rateView)
			if (this.spotView && route != 'spot') this.detachEvents(this.spotView)
			if (this.userView && route != 'user') this.detachEvents(this.userView)
		},

		detachEvents: function(view){
			view.undelegateEvents()
			view.stopListening()
		},

		updateUserSettings: function(user){
			this.user.set('ignoreRating', user.get('ignoreRating'))
			this.user.set('measurement', user.get('measurement'))
		},

	})
})