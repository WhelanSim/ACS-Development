/*
 * ApplicationTabGroup.js creates the tab group and list windows for the app.
 */
function ApplicationTabGroup() {
	var self = Ti.UI.createTabGroup(),
		ListWindow = require('ui/ListWindow');
	
	// Create the task windows. Both windows are created using the 
	// ListWindow passing isDone flag to determine the list.
	var todoWin = new ListWindow({
		title:'Todo',
		backgroundColor:'#fff',
		navBarHidden:false,
		isDone:false,
		// Add a menu option for Android to add new tasks.
		// For iOS we will add a button as the rightNavButton on the window
		activity: {
			onCreateOptionsMenu: function(e) {
				var menu = e.menu;
			    var menuItem = menu.add({ title: "Add Task" });
			    menuItem.setIcon("images/ic_menu_add.png");
			    menuItem.addEventListener("click", function(e) {
			        var AddWindow = require('ui/AddWindow'),
						addWin = new AddWindow();
						addWin.open();
			    });
			}
		}
	}),
		doneWin = new ListWindow({
			title:'Done',
			backgroundColor:'#fff',
			navBarHidden:false,
			isDone:true
		});
	
	var todoTab = Ti.UI.createTab({
		title: 'Todo',
		icon: '/images/KS_nav_ui.png',
		window: todoWin
	});
	todoWin.containingTab = todoTab;
	
	var doneTab = Ti.UI.createTab({
		title: 'Done',
		icon: '/images/KS_nav_views.png',
		window: doneWin
	});
	doneWin.containingTab = doneTab;
	
	self.addTab(todoTab);
	self.addTab(doneTab);
	
	// When the tabgroup opens, launch the login window as a modal window.
	// TODO: Store the session id and restore the session automatically if 
	// it exists. This would bypass the login screen and fetch the users tasks
	var todo = require('todo');
	//initialize the session_id as empty string
	self.addEventListener('open', function() {
		var session = Ti.App.Properties.getString('session_id');
		Ti.API.info('session_id: '+session);
		if(session === null || session === ''){
			var LoginWindow = require('ui/LoginWindow'),
			loginWin = new LoginWindow();
			loginWin.open({modal:true});
		}
		else{
			todo.fetch();
		}
	});
	
	// when successful log out, reactivate the login window for another login 
	Ti.App.addEventListener('app:logout_success', function(){
		// set the session id to empty
		Ti.App.Properties.setString('session_id', '');
		var LoginWindow = require('ui/LoginWindow'),
			loginWin = new LoginWindow();
			loginWin.open({modal:true});
	});
	
	return self;
};

module.exports = ApplicationTabGroup;
