/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	/**
	 * @class Observed
	 * @classDescription
	 * The base <code>Observed</code> class.
	 *
	 * <P>
	 * An <code>Observed</code> is an object that will broadcast information to interested objects. It offers public
	 * methods for interested objects to be able to subscribe to broadcasting and others to allow classes to compose
	 * with.
	 * 
	 * @constructor
	 */
	Objs
	(
		"puremvc.Observed",
		{
			/**
			 * @private
			 *
			 * List of <code>Observer</code> instances interested in <code>Notification</code>s.
			 *
			 * @type {Object}
			 */
			observerMap: null,

			/**
			 * Initialize an <code>Observed</code> instance.
			 */
			initialize: function()
			{
				this.observerMap = {};
			},

			/**
			 * Register an <code>Observer</code> to be notified of <code>Notification</code>s with a given name.
			 *
			 * @param {String} name
			 * 		The name of the <code>Notification</code>s to notify this <code>Observer</code> of.
			 *
			 * @param {Observer} observer
			 * 		The <code>Observer</code> to register.
			 */
			registerObserver: function( name, observer )
			{
				var observers/*Array*/ = this.observerMap[name];
				if( observers )
					observers.push(observer);
				else
					this.observerMap[name] = [observer];
			},

			/**
			 * Notify the <code>Observer</code>s for a particular <code>Notification</code>.
			 *
			 * <P>
			 * All previously attached <code>Observer</code>s for this <code>Notification</code>'s list are notified and
			 * are passed a reference to the <code>Notification</code> in the order in which they were registered.
			 *
			 * @param {Notification} note
			 * 		The <code>Notification</code> to notify <code>Observer</code>s of.
			 */
			notifyObservers: function( note )
			{
				var name/*String*/ = note.getName();

				var observersRef/*Array*/ = this.observerMap[name];
				if( observersRef )
				{
					// Copy the array to avoid modification of it during the loop.
					var observers/*Array*/ = observersRef.slice(0);
					var len/*Number*/ = observers.length;
					for( var i/*Number*/=0; i<len; i++ )
					{
						var observer/*Observer*/ = observers[i];
						observer.notifyObserver(note);
					}
				}
			},

			/**
			 * Remove the <code>Observer</code> for a given <i>notifyContext</i> from an <code>Observer</code> list for
			 * a given <code>Notification</code> name.
			 *
			 * @param {String} name
			 * 		Which <code>Observer</code> list to remove from.
			 *
			 * @param {Object} notifyContext
			 * 		Remove the <code>Observer</code> with this object as its <i>notifyContext</i>.
			 */
			removeObserver: function( name, notifyContext )
			{
				var observers/*Array*/ = this.observerMap[name];
				var i/*Number*/ = observers.length;

				while( i-- )
				{
					var observer/*Observer*/ = observers[i];
					if( observer.compareNotifyContext(notifyContext) )
					{
						observers.splice( i, 1 );
						break;
					}
				}

				// Remove empty observer lists.
				if( observers.length == 0 )
					delete this.observerMap[name];
			}
		}
	);
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	/**
	 * @class Observer
	 * @classDescription
	 * The base <code>Observer</code> class.
	 *
	 * <P>
	 * An <code>Observer</code> is an object that encapsulates information about an interested object with a method that
	 * should be called when a particular <code>Notification</code> is broadcast.
	 *
	 * <P>
	 * In PureMVC, the <code>Observer</code> class assumes these responsibilities:
	 *
	 * <UL>
	 * 		<LI>Encapsulate the notification (callback) method of the interested object.
	 * 		<LI>Encapsulate the notification context (this) of the interested object.
	 * 		<LI>Provide methods for setting the notification method and context.
	 * 		<LI>Provide a method for notifying the interested object.
	 *
	 * @see puremvc.View View
	 * @see puremvc.Notification Notification
	 * 
	 * @constructor
	 */
	Objs
	(
		"puremvc.Observer",
		{
			/**
			 * The notification method of the interested object.
			 * 
			 * @type {Function}
			 * @private
			 */
			notify: null,
			
			/**
			 * The notification context of the interested object.
			 * 
			 * @type {Object}
			 * @private
			 */
			context: null,
			
			/**
			 * Initialize an <code>Observer</code> instance.
			 *
			 * @param {Function} notifyMethod
			 * 		The notification method of the interested object.
			 * 
			 * @param {Object} notifyContext
			 * 		The notification context of the interested object.
			 */
			initialize: function( notifyMethod, notifyContext )
			{
				this.setNotifyMethod( notifyMethod );
				this.setNotifyContext( notifyContext );
			},
			
			/**
			 * Get the notification method.
			 *
			 * @return {Function}
			 * 		The notification (callback) method of the interested object.
			 */
			getNotifyMethod: function()
			{
				return this.notify;
			},
			
			/**
			 * Set the notification method.
			 *
			 * <P>The notification method should take one parameter of type <code>Notification</code>.
			 *
			 * @param {Function} notifyMethod
			 * 		The notification (callback) method of the interested object.
			 */
			setNotifyMethod: function( notifyMethod )
			{
				this.notify = notifyMethod;
			},
			
			/**
			 * Get the notification context.
			 *
			 * @return {Object}
			 * 		The notification context (<code>this</code>) of the interested object.
			 */
			getNotifyContext: function()
			{
				return this.context;
			},
			
			/**
			 * Set the notification context.
			 *
			 * @param {Object} notifyContext
			 * 		The notification context (this) of the interested object.
			 */
			setNotifyContext: function( notifyContext )
			{
				this.context = notifyContext;
			},
			
			/**
			 * Notify the interested object.
			 *
			 * @param {Notification} note
			 * 		The <code>Notification</code> to pass to the interested object's
			 * 		notification method.
			 */
			notifyObserver: function( note )
			{
				//FIXME Remove the note type and Notification dependency for this class and make the method accept an infinity of arguments
				this.getNotifyMethod().call( this.getNotifyContext(), note );
			},
			
			/**
			 * Compare an object to the notification context.
			 *
			 * @param {Object} object
			 * 		The object to compare.
			 *
			 * @return {Boolean}
			 * 		The object and the notification context are the same.
			 */
			compareNotifyContext: function( object )
			{
				return object === this.getNotifyContext();
			}
		}
	);
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	/**
	 * @class Notification
	 * @classDescription
	 * The base <code>Notification</code> class.
	 *
	 * <P>
	 * PureMVC does not rely upon underlying event models such as the one provided with Flash, and ActionScript 3 does
	 * not have an inherent event model.
	 *
	 * <P>
	 * The Observer pattern as implemented within PureMVC exists to support event-driven communication between the
	 * application and the actors of the MVC triad (Model, View and Controller.
	 *
	 * <P>
	 * Notifications are not meant to be a replacement for Events in Flex/Flash/Air/Javascript. Generally,
	 * <code>Mediator</code> implementors place event listeners on their view components, which they then handle in the
	 * usual way. This may lead to the broadcast of <code>Notification</code>s to trigger <code>Command</code>s or to
	 * communicate with other <code>Mediators</code>. <code>Proxy</code> and <code>Command</code> instances communicate
	 * with each other and <code>Mediator</code>s by broadcasting <code>Notification</code>s.
	 *
	 * <P>
	 * A key difference between Flash <code>Event</code>s and PureMVC <code>Notification</code>s is that
	 * <code>Event</code>s follow the 'Chain of Responsibility' pattern, 'bubbling' up the display hierarchy until some
	 * parent component handles the <code>Event</code>, while PureMVC <code>Notification</code>s follow a
	 * 'Publish/Subscribe' pattern. PureMVC classes need not be related to each other in a parent/child relationship in
	 * order to communicate with one another using <code>Notification</code>s.
	 *
	 * @see puremvc.Observer Observer
	 * 
	 * @constructor
	 */
	Objs
	(
		"puremvc.Notification",
		{
			/**
			 * The name of the notification.
			 * 
			 * @type {String}
			 * @private 
			 */
			name: null,
			
			/**
			 * The body data to send with the notification.
			 * 
			 * @type {Object}
			 * @private
			 */
			body: null,
			
			/**
			 * The type identifier of the notification.
			 * 
			 * @type {String}
			 * @private
			 */
			type: null,
			
			/**
			 * Initialize a <code>Notification</code> instance.
			 *
			 * @param {String} name
			 * 		The name of the notification.
			 *
			 * @param {Object} body
			 * 		(optional) Body data to send with the notification.
			 * 
			 * @param {String} type (optional)
			 * 		Type identifier of the notification.
			 */
			initialize: function( name, body, type )
			{			
				this.name = name;
				this.body = body;
				this.type = type;
			},
			
			/**
			 * Get the name of the <code>Notification</code> instance.
			 *
			 * @return {String}
			 * 		The name of the <code>Notification</code> instance.
			 */
			getName: function()
			{
				return this.name;
			},
			
			/**
			 * Set the body of the <code>Notification</code> instance.
			 *
			 * @param {Object} body
			 * 		The body of the notification.
			 */
			setBody: function( body )
			{
				this.body = body;
			},
			
			/**
			 * Get the body of the <code>Notification</code> instance.
			 *
			 * @return {Object}
			 * 		The body for the notification.
			 */
			getBody: function()
			{
				return this.body;
			},
			
			/**
			 * Set the type of the <code>Notification</code> instance.
			 *
			 * @param {String} type
			 * 		The type identifier for the notification.
			 */
			setType: function( type )
			{
				this.type = type;
			},
			
			/**
			 * Get the type of the <code>Notification</code> instance.
			 *
			 * @return {String}
			 * 		The type identifier for the notification.
			 */
			getType: function()
			{
				return this.type;
			},
			
			/**
			 * Get a textual representation of the <code>Notification</code>
			 * instance.
			 *
			 * @return {String}
			 * 		The textual representation of the <code>Notification</code>
			 * 		instance.
			 */
			toString: function()
			{
				var msg/*String*/ = "Notification Name: " + this.getName();
				msg += "\nBody:" + (( this.getBody() == null ) ? "null" : this.getBody().toString());
				msg += "\nType:" + (( this.getType() == null ) ? "null" : this.getType());
			
				return msg;
			}
		}
	);
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	var Observer = Objs("puremvc.Observer");
	var Observed = Objs("puremvc.Observed");

	/**
	 * @class View
	 * @classDescription
	 * The <code>View</code> class in PureMVC.
	 *
	 * <P>
	 * In PureMVC, the <code>View</code> class assumes these responsibilities:
	 *
	 * <UL>
	 * 	<LI>Maintain a cache of <code>Mediator</code> instances.
	 * 	<LI>Provide methods for registering, retrieving, and removing <code>Mediator</code>s.
	 * 	<LI>Notifiying <code>Mediator</code>s when they are registered or removed.
	 * 	<LI>Managing the <code>Observer</code> lists for each <code>Notification</code> in the application.
	 * 	<LI>Providing a method for attaching <code>Observer</code>s to an <code>Notification</code>'s
	 * 	<code>Observer</code> list.
	 * 	<LI>Providing a method for broadcasting a <code>Notification</code>.
	 * 	<LI>Notifying the <code>Observer</code>s of a given <code>Notification</code> when it broadcasts.
	 *
	 * @see puremvc.Mediator Mediator
	 * @see puremvc.Observer Observer
	 * @see puremvc.Notification Notification
	 *
	 * @constructor
	 */
	var View = Objs
	(
		"puremvc.View",
		{

			/**
			 * @private
			 *
			 * Mapping of <code>Mediator</code> names to <code>Mediator</code> instances.
			 *
			 * @type {Object}
			 */
			mediatorMap: null,

			/**
			 * @private
			 *
			 * Observed composite object for the <code>View></code>.
			 *
			 * @type {Observed}
			 */
			observed: null,

			/**
			 * Initialize a <code>View</code> instance.
			 */
			initialize: function()
			{
				this.mediatorMap = {};
				this.observed = new Observed();
			},

			/**
			 * Get the <code>Model</code> instance for this <code>View</code>.
			 *
			 * @return {View}
			 * 		The <code>View</code> instance set for this <code>View</code>.
			 */
			getModel: function()
			{
				return this.model;
			},

			/**
			 * Set the <code>Model</code> instance for this <code>View</code>.
			 *
			 * <P>
			 * Setting it to <code>null</code> will make the <code>Model</code> instance available for garbage.
			 *
			 * @param {model} model
			 * 		The <code>Model</code> instance to set for this <code>View</code>.
			 */
			setModel: function( model )
			{
				this.model = model;
			},

			/**
			 * Register an <code>Observer</code> to be notified of <code>Notifications</code> with a given name.
			 *
			 * @param {String} name
			 * 		The name of the <code>Notification</code>s to notify this <code>Observer</code> of.
			 *
			 * @param {Observer} observer
			 * 		The <code>Observer</code> to register.
			 */
			registerObserver: function( name, observer )
			{
				this.observed.registerObserver( name, observer );
			},

			/**
			 * Notify the <code>Observer</code>s for a particular <code>Notification</code>.
			 *
			 * <P>
			 * All previously attached <code>Observer</code>s for this <code>Notification</code>'s list are notified and
			 * are passed a reference to the <code>Notification</code> in the order in which they were registered.
			 *
			 * @param {Notification} note
			 * 		The <code>Notification</code> to notify <code>Observer</code>s of.
			 */
			notifyObservers: function( note )
			{
				this.observed.notifyObservers( note );
			},

			/**
			 * Remove the <code>Observer</code> for a given <i>notifyContext</i> from an <code>Observer</code> list for
			 * a given <code>Notification</code> name.
			 *
			 * @param {String} name
			 * 		Which <code>Observer</code> list to remove from.
			 *
			 * @param {Object} notifyContext
			 * 		Remove the <code>Observer</code> with this object as its <i>notifyContext</i>.
			 */
			removeObserver: function( name, notifyContext )
			{
				this.observed.removeObserver( name, notifyContext );
			},

			/**
			 * Register an <code>IMediator</code> instance with the <code>View</code>.
			 *
			 * <P>
			 * Registers the <code>IMediator</code> so that it can be retrieved by name, and further interrogates the
			 * <code>IMediator</code> for its <code>INotification</code> interests.
			 *
			 * <P>
			 * If the <code>IMediator</code> returns any <code>INotification</code> names to be notified about, an
			 * <code>Observer</code> is created to encapsulate the <code>IMediator</code> instance's
			 * <code>handleNotification</code> method and register it as an <code>Observer</code> for all
			 * <code>INotification</code>s the <code>IMediator</code> is interested in.
			 *
			 * @param {Mediator} mediator
			 * 		A reference to the <code>Mediator</code> instance.
			 */
			registerMediator: function( mediator )
			{
				var name/*String*/ = mediator.getMediatorName();

				// Do not allow re-registration (you must removeMediator first)
				if( this.mediatorMap[name] )
					return;

				// Register the Mediator for retrieval by name
				this.mediatorMap[name] = mediator;

				// Register Mediator as an observer for each of its notification interests
				var interests/*Array*/ = mediator.listNotificationInterests();
				var len/*Number*/ = interests.length;
				if( len )
				{
			    	// Register Mediator as Observer for its list of Notification interests
					var observer/*Observer*/ = new Observer( mediator.handleNotification, mediator );
					for( var i/*Number*/=0; i<len; i++ )
						this.registerObserver( interests[i], observer );
				}

				mediator.setModel(this.model);
				mediator.setView(this);
				mediator.onRegister();
			},

			/**
			 * Retrieve a <code>Mediator</code> from the <code>View</code>.
			 *
			 * @param {String} mediatorName
			 *		The name of the <code>IMediator</code> instance to retrieve.
			 *
			 * @return {Mediator}
			 *		The <code>Mediator</code> instance previously registered with the given <i>mediatorName</i> or an
			 *		explicit <code>null</code> if it doesn't exists.
			 */
			retrieveMediator: function( mediatorName )
			{
				//Return a strict null when the mediator doesn't exist
				return this.mediatorMap[mediatorName] || null;
			},

			/**
			 * Check if a <code>Mediator</code> is registered or not.
			 *
			 * @param {String} mediatorName
			 *		Name of the <code>Mediator</code> instance to verify the existence of its registration.
			 *
			 * @return {Boolean}
			 *		A <code>Mediator</code> is registered with the given <i>mediatorName</i>.
			 */
			hasMediator: function( mediatorName )
			{
				return this.mediatorMap[mediatorName] ? true : false;
			},

			/**
			 * Remove a <code>Mediator</code> from the <code>View</code>.
			 *
			 * @param {String} mediatorName
			 *		Name of the <code>IMediator</code> instance to be removed.
			 *
			 * @return {Mediator}
			 *		The <code>Mediator</code> that was removed from the <code>View</code> or a strict <code>null</null>
			 *		if the <code>Mediator</code> didn't exist.
			 */
			removeMediator: function( mediatorName )
			{
				var mediator/*Mediator*/ = this.mediatorMap[mediatorName];
				if( !mediator )
					return null;

				var interests/*Array*/ = mediator.listNotificationInterests();
				var i/*Number*/ = interests.length;
				while (i--)
					this.removeObserver( interests[i], mediator );

				delete this.mediatorMap[mediatorName];
				mediator.onRemove();
				mediator.setModel(null);
				mediator.setView(null);
				return mediator;
			}
		}
	);
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	var Observer = Objs("puremvc.Observer");
	var Observed = Objs("puremvc.Observed");

	/**
	 * @class Model
	 * @classDescription
	 * The <code>Model</code> class for PureMVC.
	 *
	 * <P>
	 * In PureMVC, the <code>Model</code> class provides access to model objects (Proxies) by named lookup.
	 *
	 * <P>
	 * The <code>Model</code> assumes these responsibilities:
	 *
	 * <UL>
	 * 	<LI>Maintain a cache of <code>Proxy</code> instances.
	 * 	<LI>Provide methods for registering, retrieving, and removing <code>Proxy</code> instances.
	 *
	 * <P>Your application must register <code>Proxy</code> instances with the <code>Model</code>. Typically, you use a
	 * <code>Command</code> to create and register <code>Proxy</code> instances once the <code>Facade</code> has
	 * initialized the core actors.
	 *
	 * @see puremvc.Proxy Proxy
	 *
	 * @constructor
	 */
	var Model = Objs
	(
		"puremvc.Model",
		{
			/**
			 * HashTable of <code>Proxy</code> instances registered with the <code>Model</code>.
			 *
			 * @type {Object}
			 * @private
			 */
			proxyMap: null,

			/**
			 * @private
			 *
			 * Observed composite object for the <code>View></code>.
			 *
			 * @type {Observed}
			 */
			observed: null,

			/**
			 * Initialize a <code>Model</code> instance.
			 */
			initialize: function()
			{
				this.proxyMap = {};
				this.observed = new Observed();
			},

			/**
			 * Register an <code>Observer</code> to be notified of <code>Notifications</code> with a given name.
			 *
			 * @param {String} name
			 * 		The name of the <code>Notification</code>s to notify this <code>Observer</code> of.
			 *
			 * @param {Observer} observer
			 * 		The <code>Observer</code> to register.
			 */
			registerObserver: function( name, observer )
			{
				this.observed.registerObserver( name, observer );
			},

			/**
			 * Notify the <code>Observer</code>s for a particular <code>Notification</code>.
			 *
			 * <P>
			 * All previously attached <code>Observer</code>s for this <code>Notification</code>'s list are notified and
			 * are passed a reference to the <code>Notification</code> in the order in which they were registered.
			 *
			 * @param {Notification} note
			 * 		The <code>Notification</code> to notify <code>Observer</code>s of.
			 */
			notifyObservers: function( note )
			{
				this.observed.notifyObservers( note );
			},

			/**
			 * Remove the <code>Observer</code> for a given <i>notifyContext</i> from an <code>Observer</code> list for
			 * a given <code>Notification</code> name.
			 *
			 * @param {String} name
			 * 		Which <code>Observer</code> list to remove from.
			 *
			 * @param {Object} notifyContext
			 * 		Remove the <code>Observer</code> with this object as its <i>notifyContext</i>.
			 */
			removeObserver: function( name, notifyContext )
			{
				this.observed.removeObserver( name, notifyContext );
			},

			/**
			 * Register a <code>Proxy</code> with the <code>Model</code>.
			 *
			 * @param {Proxy} proxy
			 *		A <code>Proxy</code> to be held by the <code>Model</code>.
			 */
			registerProxy: function( proxy )
			{
				this.proxyMap[proxy.getProxyName()] = proxy;

				proxy.setModel(this);
				proxy.onRegister();
			},

			/**
			 * Retrieve an <code>IProxy</code> from the <code>Model</code>.
			 *
			 * @param {String} proxyName
			 *		The name of the <code>Proxy</code> to retrieve.
			 *
			 * @return {Proxy}
			 *		The <code>Proxy</code> instance previously registered with the given <code>proxyName</code> or an
			 *		explicit <code>null</code> if it doesn't exists.
			 */
			retrieveProxy: function( proxyName )
			{
				//Return a strict null when the proxy doesn't exist
				return this.proxyMap[proxyName] || null;
			},

			/**
			 * Check if a <code>Proxy</code> is registered.
			 *
			 * @param {String} proxyName
			 *		The name of the <code>Proxy</code> to verify the existence of its registration.
			 *
			 * @return {Boolean}
			 *		A Proxy is currently registered with the given <code>proxyName</code>.
			 */
			hasProxy: function( proxyName )
			{
				return this.proxyMap[proxyName] ? true : false;
			},

			/**
			 * Remove a <code>Proxy</code> from the <code>Model</code>.
			 *
			 * @param {String} proxyName
			 *		The name of the <code>Proxy</code> instance to be removed.
			 *
			 * @return {Proxy}
			 *		The <code>Proxy</code> that was removed from the <code>Model</code> or an explicit <code>null</null>
			 *		if the <code>Proxy</code> didn't exist.
			 */
			removeProxy: function( proxyName )
			{
				var proxy/*Proxy*/ = this.proxyMap[proxyName];
				if( !proxy )
					return null;

				delete this.proxyMap[proxyName];
				proxy.onRemove();
				proxy.setModel(null);
				return proxy;
			}
		}
	);
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	var Observer = Objs("puremvc.Observer");
	var View = Objs("puremvc.View");

	/**
	 * @class Controller
	 * @classDescription
	 * The <code>Controller</code> class for PureMVC.
	 *
	 * <P>
	 * In PureMVC, the <code>Controller</code> class follows the 'Command and Controller' strategy, and assumes these
	 * responsibilities:
	 *
	 * <UL>
	 * <LI>Remembering which <code>SimpleCommand</code>s or <code>MacroCommand</code>s are intended to handle which
	 * <code>Notification</code>s.
	 *
	 * <LI>Registering itself as an <code>Observer</code> with the <code>View</code> for each <code>Notification</code>
	 * that it has a <code>SimpleCommand</code> or <code>MacroCommand</code> mapping for.
	 *
	 * <LI>Creating a new instance of the proper <code>SimpleCommand</code> or <code>MacroCommand</code> to handle a
	 * given <code>Notification</code> when notified by the <code>View</code>.
	 *
	 * <LI>Calling the <code>SimpleCommand</code>'s or <code>MacroCommand</code>'s  <code>execute</code> method, passing
	 * in the <code>Notification</code>.
	 *
	 * <P>
	 * Your application must register <code>ICommand</code>s with the <code>Controller</code>.
	 *
	 * <P>
	 * The simplest way is to subclass </code>Facade</code>, and use its <code>initializeController</code> method to add
	 * your registrations.
	 *
	 * @see puremvc.patterns.View View
	 * @see puremvc.Observer Observer
	 * @see puremvc.Notification Notification
	 * @see puremvc.SimpleCommand SimpleCommand
	 * @see puremvc.MacroCommand MacroCommand
	 *
	 * @constructor
	 */
	var Controller = Objs
	(
		"puremvc.Controller",
		{
			/**
			 * The <code>View</code> this <code>Controller</code> has to know.
			 *
			 * @type {View}
			 * @private
			 */
			view: null,

			/**
			 * The <code>Model</code> this <code>Controller</code> has to know.
			 *
			 * @type {Model}
			 * @private
			 */
			model: null,

			/**
			 * Mapping of <code>Notification<code> names to <code>Command</code> class references.
			 *
			 * @type {Object}
			 * @private
			 */
			commandMap: null,

			/**
			 * Initialize a <code>Controller</code> instance.
			 */
			initialize: function( view )
			{
				this.commandMap = {};
			},

			/**
			 * Get the <code>View</code> instance for this <code>Controller</code>.
			 *
			 * @return {View}
			 * 		The <code>View</code> instance set for this <code>Controller</code>.
			 */
			getView: function()
			{
				return this.view;
			},

			/**
			 * Set the <code>View</code> instance for this <code>Controller</code>.
			 *
			 * <P>
			 * Setting it to <code>null</code> will not make the <code>View</code> instance available for garbage as it
			 * is passed as reference to commands. Be sure to unregister all commands to make it available for garbage.
			 *
			 * @param {View} view
			 * 		The <code>View</code> instance to set for this <code>Controller</code>.
			 */
			setView: function( view )
			{
				this.view = view;
			},

			/**
			 * Get the <code>Model</code> instance for this <code>Controller</code>.
			 *
			 * @return {View}
			 * 		The <code>View</code> instance set for this <code>Controller</code>.
			 */
			getModel: function()
			{
				return this.model;
			},

			/**
			 * Set the <code>Model</code> instance for this <code>Controller</code>.
			 *
			 * <P>
			 * Setting it to <code>null</code> will make the <code>Model</code> instance available for garbage.
			 *
			 * @param {model} model
			 * 		The <code>Model</code> instance to set for this <code>Controller</code>.
			 */
			setModel: function( model )
			{
				this.model = model;
			},

			/**
			 * If a <code>Command</code> has previously been registered to handle the given <code>Notification</code>,
			 * then it is executed.
			 *
			 * @param {Notification} note
			 * 		A <code>Notification</code>.
			 */
			executeCommand: function( note )
			{
				//FIXME We don't want to manage Command class object references but classpath instead (check for this with existing ports and languages)
				var commandClassRef/*Function*/ = this.commandMap[note.getName()];
				if( commandClassRef )
				{
					var command/*Command*/ = new commandClassRef();
					command.setModel(this.model);
					command.setView(this.view);
					command.execute(note);
				}
			},

			/**
			 * Register a particular <code>Command</code> class as the handler for a particular
			 * <code>Notification</code>.
			 *
			 * <P>
			 * If a <code>Command</code> has already been registered to handle <code>Notification</code>s with this
			 * name, it is no longer used, the new <code>Command</code> is used instead.
			 *
			 * The <code>Observer</code> for the new <code>Command</code> is only created if this is the first time a
			 * <code>Command</code> has been registered for this <code>Notification</code> name.
			 *
			 * @param {String} notificationName
			 * 		The name of the <code>Notification</code>.
			 *
			 * @param {Function} commandClassRef
			 * 		A reference to <code>Class</code> of the <code>Command</code>.
			 */
			registerCommand: function( notificationName, commandClassRef )
			{
				if( !this.commandMap[notificationName] )
				{
					if( this.view )
						this.view.registerObserver( notificationName, new Observer( this.executeCommand, this ) );
				}

				this.commandMap[notificationName] = commandClassRef;
			},

			/**
			 * Check if a <code>Command</code> is registered for a given <code>Notification</code>.
			 *
			 * @param {String} notificationName
			 * 		The name of the <code>Notification</code> to verify the	existence of its registration.
			 *
			 * @return {Boolean}
			 * 		A <code>Command</code> is currently registered for the given <code>notificationName</code>.
			 */
			hasCommand: function( notificationName )
			{
				return this.commandMap[notificationName] ? true : false;
			},

			/**
			 * Remove a previously registered <code>SimpleCommand</code> or <code>MacroCommand</code> to
			 * <code>Notification</code> mapping.
			 *
			 * @param {String} notificationName
			 * 		The name of the <code>Notification</code> to remove the	<code>SimpleCommand</code> or
			 * 		<code>MacroCommand</code> mapping for.
			 */
			removeCommand: function( notificationName )
			{
				if( this.hasCommand(notificationName) )
				{
					if( this.view )
						this.view.removeObserver(notificationName, this);

					delete this.commandMap[notificationName];
				}
			}
		}
	);
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	var Model = Objs("puremvc.Model");
	var View = Objs("puremvc.View");
	var Controller = Objs("puremvc.Controller");
	var Notification = Objs("puremvc.Notification");
	
	/**
	 * @class Facade
	 * @classDescription
	 * The base <code>Facade</code> implementation for each core.
	 * 
	 * <P>
	 * In PureMVC, the <code>Facade</code> class assumes these responsibilities:
	 * 
	 * <UL>
	 * 		<LI>Initializing the <code>Model</code>, <code>View</code> and <code>Controller</code> core actors.
	 * 		<LI>Providing all the applicable methods of the <code>Model</code>, <code>View</code>, &
	 * 		<code>Controller</code> instances.
	 * 		<LI>Providing a single point of contact to the application for registering <code>Command</code>s and
	 * 		notifying <code>Observer</code>s.
	 * 
	 * @see puremvc.Controller Controller
	 * @see puremvc.Model Model
	 * @see puremvc.View View
	 * @see puremvc.Notification Notification
	 * @see puremvc.Mediator Mediator
	 * @see puremvc.Proxy Proxy
	 * @see puremvc.SimpleCommand SimpleCommand
	 * @see puremvc.MacroCommand MacroCommand
	 *
	 * @constructor
	 */
	var Facade = Objs
	(
		"puremvc.Facade",
		{
			/**
			 * The <code>View</code> for this <code>Facade</code>.
			 *
			 * @type {View}
			 * @private
			 */
			view: null,
			
			/**
			 * The <code>Model</code> for this <code>Facade</code>.
			 *
			 * @type {Model}
			 * @private
			 */
			model: null,
			
			/**
			 * The <code>Controller</code> for this <code>Facade</code>.
			 *
			 * @type {Controller}
			 * @private
			 */
			controller: null,
			
			/**
			 * Initialize a <code>Facade</code> instance.
			 */
			initialize: function()
			{
				this.initializeFacade();
			},

			/**
			 * Initialize the <code>Facade</code> instance.
			 *
			 * <P>
			 * Called automatically by the constructor. Override in your subclass to do any subclass specific
			 * initializations. Be sure to call <code>$super.initializeFacade()</code>, though.
			 */
			initializeFacade: function()
			{
				this.initializeModel();
				this.initializeView();
				this.initializeController();
			},

			/**
			 * Initialize the <code>Model</code>.
			 *
			 * <P>
			 * Called by the <code>initializeFacade</code> method.
			 *
			 * Override this method in your subclass of <code>Facade</code>  if one or both of the following are true:
			 * <UL>
			 * 		<LI> You wish to initialize a different <code>IModel</code>.
			 * 		<LI> You have <code>Proxy</code>s to register with the Model that do not retrieve a reference to the
			 * 		Facade at construction time.
			 *
			 * If you don't want to initialize a different <code>Model</code>,
			 * call <code>$super.initializeModel()</code> at the beginning of your
			 * method, then register <code>Proxy</code>s.
			 *
			 * <P>
			 * Note: This method is <i>rarely</i> overridden; in practice you are more likely to use a
			 * <code>Command</code> to create and register <code>Proxy</code>s with the <code>Model</code>, since
			 * <code>Proxy</code>s with mutable data will likely need to send <code>Notification</code>s and thus will
			 * likely want to fetch a reference to the <code>Facade</code> during their construction.
			 */
			initializeModel: function()
			{
 				if( this.model )
				 	return;

				this.model = new Model();

				//In case the Model is set after the Controller
				if( this.controller )
					this.controller.setModel(this.model);

				//In case the Model is set after the View
				if( this.view )
					this.view.setModel(this.model);
			},

			/**
			 * Initialize the <code>View</code>.
			 *
			 * <P>
			 * Called by the <code>initializeFacade</code> method.
			 *
			 * Override this method in your subclass of <code>Facade</code> if one or both of the following are true:
			 * <UL>
			 * 		<LI> You wish to initialize a different <code>IView</code>.
			 * 		<LI> You have <code>Observers</code> to register with the <code>View</code>
			 *
			 * If you don't want to initialize a different <code>View</code>, call <code>super.initializeView()</code>
			 * at the beginning of your method, then register <code>Mediator</code> instances.
			 *
			 * <P>
			 * Note: This method is <i>rarely</i> overridden; in practice you are more likely to use a
			 * <code>Command</code> to create and register <code>Mediator</code>s with the <code>View</code>, since
			 * <code>Mediator</code> instances will need to send <code>Notification</code>s and thus will likely want
			 * to fetch a reference to the <code>Facade</code> during their construction.
			 */
			initializeView: function()
			{
 				if( this.view )
				 	return;

				this.view = new View();

				//In case the View is set after the Model
				if( this.model )
					this.view.setModel(this.model);

				//In case the View is set after the Controller
				if( this.controller )
					this.controller.setView(this.view);
			},

			/**
			 * Initialize the <code>Controller</code>.
			 *
			 * <P>
			 * Called by the <code>initializeFacade</code> method.
			 *
			 * Override this method in your subclass of <code>Facade</code> if one or both of the following are true:
			 * <UL>
			 * 		<LI> You wish to initialize a different <code>IController</code>.
			 * 		<LI> You have <code>Commands</code> to register with the <code>Controller</code> at startup.</code>.
			 *
			 * If you don't want to initialize a different <code>IController</code>, call
			 * <code>$super.initializeController()</code> at the beginning of your method, then register
			 * <code>Command</code>s.
			 */
			initializeController: function()
			{
 				if( this.controller )
				 	return;

				this.controller = new Controller();

				//In case the Controller is set after the View
				if( this.view )
					this.controller.setView(this.view);

				//In case the Controller is set after the Model
				if( this.model )
					this.controller.setModel(this.model);
			},

			/**
			 * Register a <code>Command</code> with the <code>Controller</code> by <code>Notification</code> name.
			 *
			 * @param {String} name
			 * 		The name of the <code>Notification</code> to associate the <code>Command</code> with.
			 *
			 * @param {Function} commandClassRef
			 * 		A reference to the Class of the <code>Command</code>.
			 */
			registerCommand: function( name, commandClassRef )
			{
				this.controller.registerCommand( name, commandClassRef );
			},
			
			/**
			 * Remove a previously registered <code>Command</code> to <code>Notification</code> mapping from the
			 * <code>Controller</code>.
			 *
			 * @param {String} name
			 * 		The name of the <code>Notification</code> to remove the <code>Command</code> mapping for.
			 */
			removeCommand: function( name )
			{
				this.controller.removeCommand(name);
			},
			
			/**
			 * Check if a <code>Command</code> is registered for a given <code>Notification</code>.
			 *
			 * @param {String} name
			 * 		The name of the <code>Notification</code> to verify for the existence of a <code>Command</code>
			 * 		mapping for.
			 *
			 * @return {Boolean}
			 * 		A <code>Command</code> is currently registered for the given <i>name</i>.
			 */
			hasCommand: function( name )
			{
				return this.controller.hasCommand(name);
			},
			
			/**
			 * Register a <code>Proxy</code> with the <code>Model</code> by name.
			 *
			 * @param proxy {Proxy}
			 * 		The <code>Proxy</code> instance to be registered with the <code>Model</code>.
			 */
			registerProxy: function( proxy )
			{
				this.model.registerProxy( proxy );
			},
			
			/**
			 * Retrieve a <code>Proxy</code> from the <code>Model</code> by name.
			 *
			 * @param {String} proxyName
			 * 		The name of the <code>Proxy</code> to be retrieved.
			 *
			 * @return {Proxy}
			 * 		The <code>Proxy</code> instance previously registered with the given <i>proxyName</i>.
			 */
			retrieveProxy: function( proxyName )
			{
				return this.model.retrieveProxy(proxyName);
			},
			
			/**
			 * Remove an <code>Proxy</code> from the <code>Model</code> by name.
			 *
			 * @param {String} proxyName
			 * 		The <code>Proxy</code> to remove from the <code>Model</code>.
			 *
			 * @return {Proxy}
			 * 		The <code>Proxy</code> that was removed from the <code>Model</code>.
			 */
			removeProxy: function( proxyName )
			{
				return this.model.removeProxy(proxyName);
			},
			
			/**
			 * Check if a <code>Proxy</code> is registered.
			 *
			 * @param {String} proxyName
			 * 		The <code>Proxy</code> to verify the existence of a registration with the <code>Model</code>.
			 *
			 * @return {Boolean}
			 * 		A <code>Proxy</code> is currently registered with the given <i>proxyName</i>.
			 */
			hasProxy: function( proxyName )
			{
				return this.model.hasProxy(proxyName);
			},
			
			/**
			 * Register a <code>Mediator</code> with the <code>View</code>.
			 *
			 * @param {Mediator} mediator
			 * 		A reference to the <code>Mediator</code>.
			 */
			registerMediator: function( mediator )
			{
				this.view.registerMediator( mediator );
			},
			
			/**
			 * Retrieve an <code>Mediator</code> from the <code>View</code>.
			 *
			 * @param {String} mediatorName
			 * 		The name of the registered <code>Mediator</code> to retrieve.
			 *
			 * @return {Mediator}
			 * 		The <code>Mediator</code> previously registered with the given <i>mediatorName</i>.
			 */
			retrieveMediator: function( mediatorName )
			{
				return this.view.retrieveMediator(mediatorName);
			},
			
			/**
			 * Remove an <code>Mediator</code> from the <code>View</code>.
			 *
			 * @param {String} mediatorName
			 * 		The name of the <code>Mediator</code> to be removed.
			 *
			 * @return {Mediator}
			 * 		The <code>Mediator</code> that was removed from the <code>View</code>.
			 */
			removeMediator: function( mediatorName )
			{
				return this.view.removeMediator(mediatorName);
			},
			
			/**
			 * Check if a <code>Mediator</code> is registered or not.
			 *
			 * @param {String} mediatorName
			 * 		The name of the <code>Mediator</code> to verify the existence of a registration for.
			 *
			 * @return {Boolean}
			 * 		A <code>Mediator</code> is registered with the given <i>mediatorName</i>.
			 */
			hasMediator: function( mediatorName )
			{
				return this.view.hasMediator(mediatorName);
			},
			
			/**
			 * Create and send a <code>Notification</code>.
			 *
			 * <P>Keeps us from having to construct new notification instances in our implementation code.
			 *
			 * @param {String} name
			 * 		The name of the notification to send.
			 *
			 * @param {Object} body
			 * 		The body of the notification to send.
			 *
			 * @param {String} type
			 * 		The type of the notification to send.
			 */
			sendNotification: function( name, body, type )
			{
				var note/*Notification*/ = new Notification( name, body, type );
				this.view.notifyObservers(note);
			}
		}
	);
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	/**
	 * @class Notifier
	 * @abstract
	 * @classDescription
	 * The Base <code>Notifier</code> class.
	 *
	 * <P>
	 * <code>MacroCommand</code>, <code>Command</code>, <code>Mediator</code> and <code>Proxy</code> all have a need to
	 * send <code>Notifications</code>.
	 * 
	 * <P>
	 * The <code>Notifier</code> base class provides a common method called <code>sendNotification</code> that relieves
	 * implementation code of the necessity to actually construct <code>Notification</code>s.
	 *
	 * <P>
	 * The <code>Notifier</code> class, which all of the above mentioned classes extend, provides an initialized
	 * reference to the <code>Facade</code>, which is required by the convenience method <code>sendNotification</code>
	 * for sending <code>Notifications</code>, but it also eases implementation as these classes have frequent
	 * <code>Facade</code> interactions and uusually require access to the facade anyway.
	 * 
	 * @see puremvc.Facade Facade
	 * 
	 * @constructor
	 */
	var Notifier = Objs
	(
		"puremvc.Notifier",
		{

			/**
			 * @abstract
			 * Create and send a <code>Notification</code>.
			 *
			 * <P>
			 * Keeps us from having to construct new <code>Notification</code>
			 * instances in our implementation code.
			 * 
			 * @param {String} name
			 * 		The name of the notification to send.
			 * 
			 * @param {Object} body
			 * 		The (optional) body of the notification.
			 *
			 * @param {String} type
			 * 		The (optional) type of the notification.
			 */
			sendNotification: function( name, body, type )
			{
				throw Error(Notifier.SEND_NOTIFICATION_NOT_IMPLEMENTED_ERROR);
			}
		}
	);

	/**
	 * Error thrown when a subclass try to call sendNotification method without having implemented it.
	 *
	 * @type {String}
	 */
	Notifier.SEND_NOTIFICATION_NOT_IMPLEMENTED_ERROR = "Notifier.sendNotification method is abstract and must be overridden.";
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	var Notification = Objs("puremvc.Notification");

	/**
	 * @class SimpleCommand
	 * @classDescription
	 * A base <code>Command</code> implementation.
	 * 
	 * <P>
	 * Your subclass should override the <code>execute</code> method where your business logic will handle the
	 * <code>Notification</code>.
	 *
	 * <P>
	 * As in JavaScript there isn't interfaces, <code>SimpleCommand</code> and <code>MacroCommand</code> cannot offer
	 * the guarantee to have the right signature. We could have inherited from a common <code>Command</code> class,
	 * but to avoid an unwanted complexity and to respect PureMVC implementation, this is to the developer to take care
	 * to inherit from <code>SimpleCommand</code> in its command and <code>MacroCommand</code> depending on his need.
	 * 
	 * @extends puremvc.Notifier Notifier
	 *
	 * @constructor
	 */
	var SimpleCommand = Objs
	(
		"puremvc.SimpleCommand",
		"puremvc.Notifier",
		{
			//TODO Create a common class for SimpleCommand and MacroCommand ... SimpleCommand could be the base of MacroCommand

			/**
			 * The <code>View</code> this <code>SimpleCommand</code> has to know.
			 *
			 * @type {View}
			 * @private
			 */
			view: null,

			/**
			 * The <code>Model</code> this <code>SimpleCommand</code> has to know.
			 *
			 * @type {Model}
			 * @private
			 */
			model: null,

			/**
			 * Get the <code>View</code> instance for this <code>SimpleCommand</code>.
			 *
			 * @return {View}
			 * 		The <code>View</code> instance set for this <code>SimpleCommand</code>.
			 */
			getView: function()
			{
				return this.view;
			},

			/**
			 * Set the <code>View</code> instance for this <code>SimpleCommand</code>.
			 *
			 * <P>
			 * Setting it to <code>null</code> will not make the <code>View</code> instance available for garbage.
			 *
			 * @param {View} view
			 * 		The <code>View</code> instance to set for this <code>Controller</code>.
			 */
			setView: function( view )
			{
				this.view = view;
			},

			/**
			 * Get the <code>Model</code> instance for this <code>Facade</code>.
			 *
			 * @return {View}
			 * 		The <code>View</code> instance set for this <code>Facade</code>.
			 */
			getModel: function()
			{
				return this.model;
			},

			/**
			 * Set the <code>Model</code> instance for this <code>Controller</code>.
			 *
			 * <P>
			 * Setting it to <code>null</code> will make the <code>Model</code> instance available for garbage.
			 *
			 * @param {model} model
			 * 		The <code>Model</code> instance to set for this <code>Controller</code>.
			 */
			setModel: function( model )
			{
				this.model = model;
			},

			/**
			 * @override
			 */
			sendNotification: function( name, body, type )
			{
				var note/*Notification*/ = new Notification( name, body, type );
				this.view.notifyObservers(note);
			},

			/**
			 * @abstract
			 *
			 * Fulfill the use-case initiated by the given <code>Notification</code>.
			 *
			 * <P>
			 * In the Command Pattern, an application use-case typically begins with some user action, which results in
			 * a <code>Notification</code> being broadcast, which is handled by business logic in the
			 * <code>execute</code> method of an <code>Command</code>.
			 *
			 * @param {Notification} note 
			 * 		The <code>Notification</code> to handle.
			 */
			execute: function( note )
			{
				throw Error("SimpleCommand.execute method is abstract and must be overridden.");
			}
		}
	);
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	var Notification = Objs("puremvc.Notification");

	/**
	 * @class MacroCommand
	 * @classDescription
	 * A base <code>Command</code> implementation that executes other
	 * <code>Command</code>s.
	 *
	 * <P>
	 * A <code>MacroCommand</code> maintains an list of <code>Command</code> class references called <i>SubCommands</i>.
	 *
	 * <P>
	 * When <code>execute</code> is called, the <code>MacroCommand</code> instantiates and calls <code>execute</code> on
	 * each of its <i>SubCommands</i> turn. Each <i>SubCommand</i> will be passed a reference to the original
	 * <code>Notification</code> that was passed to the <code>MacroCommand</code>'s <code>execute</code> method.
	 *
	 * <P>
	 * Unlike <code>MacroCommand</code>, your subclass should not override <code>execute</code>, but instead, should
	 * override the <code>initializeMacroCommand</code> method, calling <code>addSubCommand</code> once for each
	 * <i>SubCommand</i> to be executed.
	 *
	 * <P>
	 * As in JavaScript there isn't interfaces, <code>MacroCommand</code> and <code>MacroCommand</code> cannot offer
	 * the guarantee to have the right signature. We could have inherited from a common <code>Command</code> class,
	 * but to avoid an unwanted complexity and to respect PureMVC implementation, this is to the developer to take care
	 * to inherit from <code>MacroCommand</code> in its command and <code>MacroCommand</code> depending on his need.
	 *
	 * @extends puremvc.Notifier Notifier
	 *
	 * @constructor
	 */
	var MacroCommand = Objs
	(
		"puremvc.MacroCommand",
		"puremvc.Notifier",
		{
			/**
			 * An array of <code>MacroCommands</code> or subclasses of.
			 *
			 * @type {Array}
			 * @private
			 */
			subCommands: null,
			/**
			 * The <code>View</code> this <code>MacroCommand</code> has to know.
			 *
			 * @type {View}
			 * @private
			 */
			view: null,

			/**
			 * The <code>Model</code> this <code>MacroCommand</code> has to know.
			 *
			 * @type {Model}
			 * @private
			 */
			model: null,

			/**
			 * @override
			 *
			 * Initialize a <code>MacroCommand</code> instance.
			 */
			initialize: function()
			{
				this.subCommands = [];
				this.initializeMacroCommand();
			},

			/**
			 * Get the <code>View</code> instance for this <code>MacroCommand</code>.
			 *
			 * @return {View}
			 * 		The <code>View</code> instance set for this <code>MacroCommand</code>.
			 */
			getView: function()
			{
				return this.view;
			},

			/**
			 * Set the <code>View</code> instance for this <code>MacroCommand</code>.
			 *
			 * <P>
			 * Setting it to <code>null</code> will not make the <code>View</code> instance available for garbage.
			 *
			 * @param {View} view
			 * 		The <code>View</code> instance to set for this <code>Controller</code>.
			 */
			setView: function( view )
			{
				this.view = view;
			},

			/**
			 * Get the <code>Model</code> instance for this <code>Facade</code>.
			 *
			 * @return {View}
			 * 		The <code>View</code> instance set for this <code>Facade</code>.
			 */
			getModel: function()
			{
				return this.model;
			},

			/**
			 * Set the <code>Model</code> instance for this <code>Controller</code>.
			 *
			 * <P>
			 * Setting it to <code>null</code> will make the <code>Model</code> instance available for garbage.
			 *
			 * @param {model} model
			 * 		The <code>Model</code> instance to set for this <code>Controller</code>.
			 */
			setModel: function( model )
			{
				this.model = model;
			},

			/**
			 * @abstract
			 * Initialize the <code>MacroCommand</code>.
			 *
			 * <P>
			 * In your subclass, override this method to initialize the <code>MacroCommand</code>'s <i>subCommands</i>
			 * list with <code>Command</code> class references like this:
			 *
			 * <pre>
			 *    // Initialize MyMacroCommand
			 *    initializeMacroCommand: function()
			 *    {
			 *    	this.addSubCommand(FirstCommand);
			 *      this.addSubCommand(SecondCommand);
			 *      this.addSubCommand(ThirdCommand);
			 *    }
			 * </pre>
			 *
			 * <P>
			 * Note that <i>subCommands</i> may be any <code>Command</code> implementor.
			 *
			 * <P>
			 * In the JavaScript version it means that it only needs to implement an execute method and inherits from
			 * <code>Notifier</code>.
			 */
			initializeMacroCommand: function(){},

			/**
			 * Add an entry to <i>subCommands</i> list.
			 *
			 * <P>
			 * The <i>subCommands</i> will be called in First In/First Out (FIFO) order.
			 *
			 * @param {Function} commandClassRef
			 * 		A reference to the constructor of the <code>Command</code>.
			 */
				//FIXME classpath not references
			addSubCommand: function( commandClassRef )
			{
				this.subCommands.push( commandClassRef );
			},

			/**
			 * @override
			 */
			sendNotification: function( name, body, type )
			{
				var note/*Notification*/ = new Notification( name, body, type );
				this.view.notifyObservers(note);
			},

			/**
			 * Execute this <code>MacroCommand</code>'s <i>SubCommands</i>.
			 *
			 * <P>
			 * The <i>subCommands</i> will be called in First In/First Out (FIFO) order.
			 *
			 * @param {Notification} note
			 * 		The <code>Notification</code> object to be passed to each entry	of <i>subCommands</i> list.
			 */
			execute: function( note )
			{
				var len/*Number*/ = this.subCommands.length;
				for( var i/*Number*/=0; i<len; i++ )
				{
					var commandClassRef/*Function*/ = this.subCommands[i];
					var commandInstance/*Command*/ = new commandClassRef();
					commandInstance.setModel( this.model );
					commandInstance.setView( this.view );
					commandInstance.execute( note );
				}
			}
		}
	);
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	var Notification = Objs("puremvc.Notification");

	/**
	 * @class Mediator
	 * @classDescription
	 * <P>A base <code>Mediator</code> implementation.
	 * 
	 * <P>
	 * Typically, a <code>Mediator</code> will be written to serve one specific control or group controls and so, will
	 * not have a need to be dynamically named.
	 * 
	 * @see puremvc.Notification Notification
	 * @extends puremvc.Notifier Notifier
	 * 
	 * @constructor
	 */
	var Mediator = Objs
	(
		"puremvc.Mediator",
		"puremvc.Notifier",
		{
			/**
			 * The <code>View</code> this <code>SimpleCommand</code> has to know.
			 *
			 * @type {View}
			 * @private
			 */
			view: null,

			/**
			 * The <code>Model</code> this <code>SimpleCommand</code> has to know.
			 *
			 * @type {Model}
			 * @private
			 */
			model: null,

			/**
			 * The name of the <code>Mediator</code>.
			 * 
			 * @type {String}
			 * @private
			 */
			mediatorName: null,
			
			/**
			 * The <code>Mediator</code>'s view component.
			 * 
			 * @type {Object}
			 * @private
			 */
			viewComponent: null,
			
			/**
			 * @override
			 *
			 * Initialize a <code>Mediator</code> instance.
			 *
			 * @param {String} mediatorName
			 * 		The name of the <code>Mediator</code>.
			 *
			 * @param {Object} viewComponent
			 * 		The <code>Mediator</code>'s view component.
			 *
			 */
			initialize: function( mediatorName, viewComponent )
			{
				this.mediatorName = (mediatorName != null) ? mediatorName : Mediator.NAME;
				this.viewComponent = viewComponent;
			},

			/**
			 * Get the <code>View</code> instance for this <code>SimpleCommand</code>.
			 *
			 * @return {View}
			 * 		The <code>View</code> instance set for this <code>SimpleCommand</code>.
			 */
			getView: function()
			{
				return this.view;
			},

			/**
			 * Set the <code>View</code> instance for this <code>SimpleCommand</code>.
			 *
			 * <P>
			 * Setting it to <code>null</code> will not make the <code>View</code> instance available for garbage.
			 *
			 * @param {View} view
			 * 		The <code>View</code> instance to set for this <code>Controller</code>.
			 */
			setView: function( view )
			{
				this.view = view;
			},

			/**
			 * Get the <code>Model</code> instance for this <code>Facade</code>.
			 *
			 * @return {View}
			 * 		The <code>View</code> instance set for this <code>Facade</code>.
			 */
			getModel: function()
			{
				return this.model;
			},

			/**
			 * Set the <code>Model</code> instance for this <code>Controller</code>.
			 *
			 * <P>
			 * Setting it to <code>null</code> will make the <code>Model</code> instance available for garbage.
			 *
			 * @param {model} model
			 * 		The <code>Model</code> instance to set for this <code>Controller</code>.
			 */
			setModel: function( model )
			{
				this.model = model;
			},

			/**
			 * @override
			 */
			sendNotification: function( name, body, type )
			{
				var note/*Notification*/ = new Notification( name, body, type );
				this.view.notifyObservers(note);
			},

			/**
			 * List the <code>Notification</code> names this <code>Mediator</code> is interested in being notified of.
			 *
			 * @return {Array}
			 * 		The list of notifications names in which is interested the
			 * 		<code>Mediator</code>.
			 */
			listNotificationInterests: function()
			{
				return [];
			},
			
			/**
			 * Get the name of the <code>Mediator</code>.
			 *
			 * @return {String}
			 * 		The <code>Mediator</code> name.
			 */
			getMediatorName: function()
			{
				return this.mediatorName;
			},
			
			/**
			 * Get the <code>Mediator</code>'s view component.
			 *
			 * @return {Object}
			 * 		The view component.
			 */
			getViewComponent: function()
			{
				return this.viewComponent;
			},
			
			/**
			 * Set the <code>Mediator</code>'s view component.
			 *
			 * @param {Object} viewComponent
			 * 		The view component.
			 */
			setViewComponent: function( viewComponent )
			{
				this.viewComponent = viewComponent;
			},
			
			/**
			 * Handle <code>Notification</code>s.
			 *
			 * <P>
			 * Typically this will be handled in a switch statement, with one 'case' entry per <code>Notification</code>
			 * the <code>Mediator</code> is interested in.
			 *
			 * @param {Notification} note
			 * 		The notification instance to be handled.
			 */
			handleNotification: function( note ){},
			
			/**
			 * Called by the View when the Mediator is registered.
			 *
			 * <P>
			 * This method is usually overridden as needed by the subclass.
			 */
			onRegister: function(){},
			
			/**
			 * Called by the View when the Mediator is removed.
			 *
			 * <P>
			 * This method is usually overridden as needed by the subclass.
			 */
			onRemove: function(){}
		}
	);
	
	/**
	 * Default name of the <code>Mediator</code>.
	 * 
	 * @type {String}
	 * @constant
	 */
	Mediator.NAME = "Mediator";
}
/*
 PureMVC Javascript for Objs port by Frederic Saunier <frederic.saunier@puremvc.org>
 PureMVC - Copyright(c) 2006-2011 Futurescale, Inc., Some rights reserved.
 Your reuse is governed by the Creative Commons Attribution 3.0 License
*/
new function()
{
	/**
	 * @class Proxy
	 * @classDescription
	 * The base <code>Proxy</code> class.
	 * 
	 * <P>
	 * In PureMVC, <code>Proxy</code> classes are used to manage parts of the application's data model.
	 *
	 * <P>
	 * A <code>Proxy</code> might simply manage a reference to a local data object, in which case interacting with it
	 * might involve setting and getting of its data in synchronous fashion.
	 *
	 * <P>
	 * <code>Proxy</code> classes are also used to encapsulate the application's interaction with remote services to
	 * store or retrieve data, in which case, we adopt an asynchronous idiom; setting data (or calling a method) on the
	 * <code>Proxy</code> and listening for a <code>Notification</code> to be sent when the <code>Proxy</code> has
	 * retrieved the data from the service.
	 *
	 * @see puremvc.Model Model
	 *
	 * @extends puremvc.Notifier Notifier
	 * 
	 * @constructor
	 */
	var Proxy = Objs
	( 
		"puremvc.Proxy",
		"puremvc.Notifier",
		{

			/**
			 * The <code>Model</code> this <code>Proxy</code> has to know.
			 *
			 * @type {Model}
			 * @private
			 */
			model: null,

			/**
			 * The data object controlled by the <code>Proxy</code>.
			 *
			 * @type {Object}
			 * @private
			 */
			data: null,
			
			/**
			 * The name of the <code>Proxy</code>.
			 * 
			 * @type {String}
			 * @private
			 */
			proxyName: null,
			
			/**
			 * @override
			 *
			 * Initialize a <code>Proxy</code> instance.
			 *
			 * @param {String} proxyName
			 * 		The name of the <code>Proxy</code>.
			 *
			 * @param {Object} data
			 * 		An initial data object to be held by the <code>Proxy</code>.
			 */
			initialize: function( proxyName, data )
			{
				this.proxyName = (proxyName != null) ? proxyName : Proxy.NAME;
				this.data = data;
			},

			/**
			 * Get the <code>Model</code> instance for this <code>Facade</code>.
			 *
			 * @return {View}
			 * 		The <code>View</code> instance set for this <code>Facade</code>.
			 */
			getModel: function()
			{
				return this.model;
			},

			/**
			 * Set the <code>Model</code> instance for this <code>Controller</code>.
			 *
			 * <P>
			 * Setting it to <code>null</code> will make the <code>Model</code> instance available for garbage.
			 *
			 * @param {model} model
			 * 		The <code>Model</code> instance to set for this <code>Controller</code>.
			 */
			setModel: function( model )
			{
				this.model = model;
			},

			/**
			 * @override
			 */
			sendNotification: function( name, body, type )
			{
				var note/*Notification*/ = new Notification( name, body, type );
				this.model.notifyObservers(note);
			},

			/**
			 * Gets the proxyName.
			 *
			 * @return {String}
			 * 		The name of the proxy.
			 */
			getProxyName: function()
			{
				return this.proxyName;
			},
			
			/**
			 * Sets the data object.
			 *
			 * @param {Object} data
			 * 		The data to set.
			 */
			setData: function( data )
			{
				this.data = data;
			},
			
			/**
			 * Gets the data.
			 *
			 * @return {Object}
			 * 		The data held in the <code>Proxy.
			 */
			getData: function()
			{
				return this.data;
			},
			
			/**
			 * Called by the Model when the <code>Proxy</code> is registered.
			 *
			 * <P>
			 * This method is usually overridden as needed by the subclass.
			 */
			onRegister: function(){},
			
			/**
			 * Called by the Model when the <code>Proxy</code> is removed.
			 *
			 * <P>This method is usually overridden as needed by the subclass.
			 */
			onRemove: function(){}
		}
	);

	/**
	 * The default name of the <code>Proxy</code>
	 * 
	 * @type {String}
	 * @constant
	 */
	Proxy.NAME = "Proxy";
}

if( typeof HidePureMVC == "undefined" )
{
    var Observer = Objs("puremvc.Observer");
    var Notification = Objs("puremvc.Notification");
    var View = Objs("puremvc.View");
    var Model = Objs("puremvc.Model");
    var Controller = Objs("puremvc.Controller");
    var Facade = Objs("puremvc.Facade");
    var Notifier = Objs("puremvc.Notifier");
    var SimpleCommand = Objs("puremvc.SimpleCommand");
    var MacroCommand = Objs("puremvc.MacroCommand");
    var Mediator = Objs("puremvc.Mediator");
    var Proxy = Objs("puremvc.Proxy");
}
        