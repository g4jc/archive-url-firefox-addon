// Set up necessary variables via "require"
var contextMenu = require("sdk/context-menu");
var preferences = require("sdk/simple-prefs").prefs;
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var windowUtils = require('sdk/window/utils');

require("sdk/simple-prefs").on("defaultArchiver", onDefaultArchiverPreferenceChange);
require("sdk/simple-prefs").on("oneClickSave", onOneClickSavePreferenceChange);

// Create string constants for the context menu label
var archiveIsLabel = "Save to Archive.is";
var waybackMachineLabel = "Save to Wayback Machine";
var toBothLabel = "Save to Both";

// Create string constants for the toolbar button label
var saveUrlLabel = "Save URL";

// Initialize preferences
var defaultArchiver = preferences.defaultArchiver;
var oneClickSave = preferences.oneClickSave;

// Initialize labels
if (defaultArchiver == "archiveIs") {
	var contextMenuArchiverLabel = archiveIsLabel;
}
if (defaultArchiver == "waybackMachine") {
	var contextMenuArchiverLabel = waybackMachineLabel;
}
if (defaultArchiver == "toBoth") {
	var contextMenuArchiverLabel = toBothLabel;
}
else {
	console.error("Save URL to Wayback Machine: Missing Label Pref 1"); 
}
//var contextMenuArchiverLabel = (defaultArchiver == "archiveIs") ? archiveIsLabel : waybackMachineLabel : saveToBothLabel;
var toolbarButtonLabel = oneClickSave ? contextMenuArchiverLabel : saveUrlLabel;

// Create toggle button for toolbar
var button = ToggleButton({
	id: "save-url",
	label: toolbarButtonLabel,
	icon: {
		"16": "./archive-icon-16.png",
		"32": "./archive-icon-32.png",
		"64": "./archive-icon-64.png"
	},
	onChange: handleChange
});

// Create context menu item
var menuItem = contextMenu.Item({
	label: contextMenuArchiverLabel,
	context: contextMenu.PageContext(),
	contentScript: 'self.on("click", function () {' +
				   '	self.postMessage();' +
				   '});',
	onMessage: function () {
		handleSave();
	}
});

// Create panel to be used in the toggle button
var panel = panels.Panel({
	contentURL: self.data.url("panel.html"),
	contentScriptFile: [self.data.url("jquery-1.11.3.min.js"), self.data.url("panel.js")],
	onHide: handleHide,
	width: 210,
	height: 70
});

function handleChange(state) {
	if (oneClickSave) {
		handleSave();

		button.state('window', {checked: false});
	}
	else if (state.checked) {
		panel.show({
			position: button
		});
	}
}

function handleHide() {
	button.state('window', {checked: false});
}

function handleSave() {
	if (defaultArchiver == "archiveIs") {
		handleSaveArchiveIs();
	}
	if (defaultArchiver == "waybackMachine") {
		handleSaveWaybackMachine();
	}
	if (defaultArchiver == "toBoth") {
		handleSaveToBoth();
	}
	else {
		console.error("Save URL to Wayback Machine: Missing Label Pref 2"); 
	}
}

function handleSaveArchiveIs() {
	var document = windowUtils.getMostRecentBrowserWindow().document;

	var url = document.getElementById("urlbar").value;

	tabs.open("https://archive.is/?run=1&url=" + encodeURIComponent(url));

	panel.hide();
}

function handleSaveWaybackMachine() {
	var document = windowUtils.getMostRecentBrowserWindow().document;

	tabs.open("https://web.archive.org/save/" + document.getElementById("urlbar").value);

	panel.hide();
}

function handleSaveToBoth() {
	var document = windowUtils.getMostRecentBrowserWindow().document;

	var url = document.getElementById("urlbar").value;

	tabs.open("https://archive.today/?run=1&url=" + encodeURIComponent(url));
	tabs.open("https://web.archive.org/save/" + document.getElementById("urlbar").value);
	
	panel.hide();
}

function onDefaultArchiverPreferenceChange() {
	defaultArchiver = preferences.defaultArchiver;

	// Initialize labels
	if (defaultArchiver == "archiveIs") {
		var contextMenuArchiverLabel = archiveIsLabel;
	}
	if (defaultArchiver == "waybackMachine") {
		var contextMenuArchiverLabel = waybackMachineLabel;
	}
	if (defaultArchiver == "toBoth") {
		var contextMenuArchiverLabel = toBothLabel;
	}
	else {
		console.error("Save URL to Wayback Machine: Missing Label Pref 3"); 
	}
	menuItem.label = contextMenuArchiverLabel;

	toolbarButtonLabel = oneClickSave ? contextMenuArchiverLabel : saveUrlLabel;
	button.label = toolbarButtonLabel
}

function onOneClickSavePreferenceChange() {
	oneClickSave = preferences.oneClickSave;

	toolbarButtonLabel = oneClickSave ? contextMenuArchiverLabel : saveUrlLabel;
	button.label = toolbarButtonLabel
}

// Handle button clicks from the panel
panel.port.on("saveArchiveIs" , function() {
	handleSaveArchiveIs();
});

panel.port.on("saveWaybackMachine" , function() {
	handleSaveWaybackMachine();
});

panel.port.on("saveToBoth" , function() {
	handleSaveToBoth();
});
