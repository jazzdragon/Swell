define([
	'backbone',
	'jade',
	'text!templates/login.jade',
], function(Backbone, jade, template){

	

	return Backbone.View.extend({

		el: $('.wrapper'),

		template: jade.compile(template),

		initialize: function(){
			this.listenTo(this.model, 'invalid', this.highlightError)
			this.listenTo(this.model, 'sync', this.loginSuccess)
			this.listenTo(this.model, 'error', this.loginError)
			this.listenTo(this.model, 'all', this.log)
			this.render()
		},

		render: function(){
			this.$el.html(this.template())	
		},

		events: {
			'click .btn': 'submit',
			'focus input': 'clearError',
			'keyup input': 'validate'
		},

		submit: function(e){
			e.preventDefault()

			this.model.url = $(e.target).data('route')

			this.model.save()

		},

		loginSuccess: function(model, res){
			if (res.length > 0) {			
				this.model.set(res)
				window.location.hash = ''
			}

		},

		loginError: function(model, res){
			this.displayError(model, res.responseText)
		},

		validate: function(e){
			$(e.target).parent().addClass('has-success').removeClass('has-error')
			var email = this.$('input[name="email"]').val()
			var password = this.$('input[name="password"]').val()
			this.model.set({
				email: email,
				password: password
			}, {validate: true})
		},

		highlightError: function(model, msg){
			$('input[name="' + msg.field + '"').parent().addClass('has-error').removeClass('has-success')

		},

		displayError: function(model, msg){
			this.$('.error-message').text(msg).addClass('error-message-show')
		},

		clearError: function(){
			this.$('.error-message').removeClass('error-message-show')
		}

	})

})