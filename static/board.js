var Board = function(data) {
    /* Main object */


    this.column_size = 260;
    this.min_size = 500;

    this.containers = {
        menu: document.querySelector('.menu'),
        boards : document.querySelector('.boards')
    };

    this.menu_options = [
        {
            text: "Add Column",
            action: this._addColumn,
            icon:false,
            title: "Add new column"
        },
        {
            text: "Backup data",
            action: this._backup,
            icon:false,
            title: "Backup the board"
        }


    ];

    this.columns = [];

    if( data ) {
        this.fill(data)
    }
};


Board.prototype = {

    init: function(){
        /* Creates the main buttons*/
        var board = this;
        var menu_options = this.menu_options;
        var container = this.containers.menu;

        for(var i  = 0; i < menu_options.length; i += 1){
            var options = menu_options[i];
            options['container'] = container;
            options['parent'] = board;
            var button = new Button(options);
            button.attach_action(menu_options[i].action)
        }


    },

    _addColumn: function( event, board, name ){

        // expand the board to make the scroll appear
        if( (board.columns.length + 1) * board.column_size > $('body').width()){
            $('body').width( board.columns.length  * board.column_size + board.column_size);
        }

        var column = new Column(board.containers.boards, board, name)
        board.columns.push(column);
        return column;

    },

    _backup: function(event, board){

        var result = []

        var columns = board.columns;
        for(var i = 0; i < columns.length; i++){
            var column = columns[i];
            var name = column.name;
            var notes = []

            for( var j = 0; j < column.notes.length; j++){
                notes.push(column.notes[j].name);
            }

            if(notes.length > 0){
                result.push({'label':name, 'notes':notes})
            }else{
                result.push({'label':name})
            }




        }
        console.log(JSON.stringify(result));

    },

    deleteColumn: function( event, column ){
        /* Deletes the column from the list of columns */
        var board = column.parent;
        var columns = board.columns;

        var index = -1;

        for(var i = 0; i < columns.length; i++){
            if(columns[i] == column){
                index = i;
            }
        }

        if(index != -1){
            // shrinks the board
            if( (board.columns.length - 1) * board.column_size < $('body').width()){
                $('body').width( board.columns.length  * board.column_size - board.column_size);
                if($('body').width() < board.min_size ) $('body').width(board.min_size);
            }
            columns.splice(index, 1);
        }
    },

    populate: function( data ){
        for(var i = 0; i < data.length; i++){
            var name = data[i].label;
            var column = this._addColumn(false, this, name);
            var notes = data[i].notes || [];
            for( var j = 0; j < notes.length; j++){
                column._addNote(false, column, notes[j])
            }

        }
    }


}

