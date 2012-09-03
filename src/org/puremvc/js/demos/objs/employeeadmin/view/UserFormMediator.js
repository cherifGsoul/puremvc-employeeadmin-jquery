/*
 PureMVC Javascript Objs Employee Admin Demo for jQuery
 by Frederic Saunier <frederic.saunier@puremvc.org> 
 PureMVC - Copyright(c) 2006-12 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

/**
 * @class
 * User form component <code>Mediator</code>.
 *
 * @requires org.puremvc.js.patterns.mediator.Mediator Mediator
 * @requires org.puremvc.js.patterns.observer.Notification Notification
 * @requires org.puremvc.js.demos.objs.employeeadmin.model.vo.UserVO UserVO
 * @requires org.puremvc.js.demos.objs.employeeadmin.model.UserProxy UserProxy
 * @requires org.puremvc.js.demos.objs.employeeadmin.model.enum.DeptEnum DeptEnum
 * @requires org.puremvc.js.demos.objs.employeeadmin.view.components.UserForm UserForm
 *
 * @extends org.puremvc.js.patterns.mediator.Mediator Mediator
 *
 * @constructor
 */
var UserFormMediator = Objs("org.puremvc.js.demos.objs.employeeadmin.view.UserFormMediator",
	Mediator,
{	

	/**
	 * @private
	 *
	 * A shortcut to the application <code>UserProxy</code> instance.
	 * 
	 * @type {UserProxy}
	 */
	userProxy: null,

	/**
	 * @constructs
	 * @override
	 *
	 * Initialize a <code>UserFormMediator</code> instance.
	 * 
	 * @param {String} name
	 * 		Name for this <code>Mediator</code>.
	 *
	 * @param {UserForm} viewComponent
	 * 		The <code>UserForm</code> view Component this <code>Mediator</code>
	 * 		manage.
	 */
	initialize: function( name, viewComponent )
	{
		UserFormMediator.$super.initialize.call( this, name, viewComponent );
	
		this.registerListeners();
	},

	/**
	 * @override
	 */
	onRegister: function()
	{
		this.userProxy = this.model.retrieveProxy( ProxyNames.USER_PROXY );
	},

	/**
	 * @private
	 * 
	 * The <code>UserForm</code> view component this <code>Mediator</code> manage.
	 * 
	 * @return {UserForm}
	 */
	getUserForm : function()
	{
		return this.viewComponent;
	},

	/**
	 * Register event listeners for the UserForm component.
	 */
	registerListeners: function()
	{
		var userForm/*UserForm*/ = this.getUserForm();
		userForm.addEventListener( UserForm.ADD, this.onAdd, this );
		userForm.addEventListener( UserForm.UPDATE, this.onUpdate, this );
		userForm.addEventListener( UserForm.CANCEL, this.onCancel, this );
	},

	/**
	 * Unregister event listeners for the UserForm component.
	 */
	unregisterListeners: function()
	{
		var userForm/*UserForm*/ = this.getUserForm();
		userForm.addEventListener( UserForm.ADD, this.onAdd, this );
		userForm.addEventListener( UserForm.UPDATE, this.onUpdate, this );
		userForm.addEventListener( UserForm.CANCEL, this.onCancel, this );
	},

	/**
	 * @private
	 * 
	 * Called when a user is added using the form.
	 * 
	 * @param {UiComponent.Event} event
	 * 		The dispatched event object.
	 */
	onAdd: function( event )
	{
		var user/*UserVO*/ = this.getUserForm().getUser();
		this.userProxy.addItem( user );
		this.sendNotification( NotificationNames.USER_ADDED, user );
		
		var userForm/*UserForm*/ = this.getUserForm();
		userForm.clearForm();
		userForm.setEnabled(false);
		userForm.setMode(UserForm.MODE_ADD);
	},

	/**
	 * @private
	 * 
	 * Called when a user is updated using the form.
	 */
	onUpdate: function()
	{
		var user/*UserVO*/ = this.getUserForm().getUser();
		this.userProxy.updateItem( user );
		this.sendNotification(  NotificationNames.USER_UPDATED, user );
		
		var userForm/*UserForm*/ = this.getUserForm();
		userForm.clearForm();
		userForm.setEnabled(false);
		userForm.setMode(UserForm.MODE_ADD);
	},

	/**
	 * @private
	 * 
	 * Called when modifications made to a user in the form are canceled.
	 */
	onCancel: function()
	{
		this.sendNotification(  NotificationNames.CANCEL_SELECTED );
		var userForm/*UserForm*/ = this.getUserForm();
		userForm.clearForm();
		userForm.setEnabled(false);
		userForm.setMode(UserForm.MODE_ADD);
	},
	
	/**
	 * @override
	 */
	listNotificationInterests: function()
	{
		return [
			NotificationNames.NEW_USER,
			NotificationNames.USER_DELETED,
			NotificationNames.USER_SELECTED
		];
	},
	
	/**
	 * @override
	 */
	handleNotification: function( note )
	{
		var userForm/*UserForm*/ = this.getUserForm();
		
		var user/*UserVO*/;
		switch ( note.getName() )
		{
			case NotificationNames.NEW_USER:
				userForm.setUser( note.getBody() );
				userForm.setMode( UserForm.MODE_ADD );
				userForm.setEnabled(true);
				userForm.setFocus();
			break;
			
			case NotificationNames.USER_DELETED:
				userForm.clearForm();
				userForm.setEnabled(false);
			break;
	
			case NotificationNames.USER_SELECTED:
				user = note.getBody();
	
				userForm.clearForm();
				userForm.setUser( user );
	
				userForm.setMode( UserForm.MODE_EDIT );
				userForm.setEnabled(true);
				userForm.setFocus();
			break;
		}
	},

	/**
	 * @override
	 *
	 * This will never be called during the demo but note that we well made the
	 * job of removing any listeners from the mediator and the component to
	 * make those instances ready for garbage collection.
	 */
	onRemove: function()
	{
		this.unregisterListeners();
		this.getUserForm().unbindListeners();
	}
});

/*
 * Constants
 */
UserFormMediator.ADD			= "add";
UserFormMediator.UPDATE			= "update";
UserFormMediator.CANCEL			= "cancel";

UserFormMediator.MODE_ADD		= "modeAdd";
UserFormMediator.MODE_EDIT		= "modeEdit";