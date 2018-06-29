// Access the elements in panel.html
var saveWaybackMachineButton = document.getElementById("saveWaybackMachine");
var saveArchiveIsButton = document.getElementById("saveArchiveIs");
var saveToBothButton = document.getElementById("saveToBoth");

// Listen for button clicks and emit for index.js to run associated functions
saveWaybackMachineButton.addEventListener('click', function() {
	self.port.emit("saveWaybackMachine");
});

saveArchiveIsButton.addEventListener('click', function() {
	self.port.emit("saveArchiveIs");
});

saveToBothButton.addEventListener('click', function() {
	self.port.emit("saveToBoth");
});

// Handle the 'hover' style in Javascript rather than CSS
$('#saveWaybackMachine').mouseenter(function(e) {
	$('#saveWaybackMachine').addClass('hover');
}).mouseleave(function(e) {
	$('#saveWaybackMachine').removeClass('hover');
}).click(function(e) {
	$('#saveWaybackMachine').removeClass('hover');
});

$('#saveArchiveIs').mouseenter(function(e) {
	$('#saveArchiveIs').addClass('hover');
}).mouseleave(function(e) {
	$('#saveArchiveIs').removeClass('hover');
}).click(function(e) {
	$('#saveArchiveIs').removeClass('hover');
});

$('#saveToBoth').mouseenter(function(e) {
	$('#saveToBoth').addClass('hover');
}).mouseleave(function(e) {
	$('#saveToBoth').removeClass('hover');
}).click(function(e) {
	$('#saveToBoth').removeClass('hover');
});
