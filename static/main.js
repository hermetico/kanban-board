$(document).ready(function () {
    var board = new Board();

    board.init();

    $.getJSON( '/kanban-board/kanban_challenge.json', function( data ) {
        board.populate(data)
    }).fail(function() {
        console.log("Unable to load the url. Are you using a webs server? This kanban board does not have super cow powers");
    });

});