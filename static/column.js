var Column = function( container, parent, name ){

    this.type = 'column';
    this.container = container;
    this.parent = parent;
    this.name = name;

    this.notes = [];
    this.notes_container = '';

    this.label = '';
    this.element = '';

    this.menu_options = [
        {
            text: 'fas fa-plus',
            action: this._addNote,
            icon:true,
            title: 'Add new note'
        },
        {
            text: "fas fa-trash",
            action: this._deleteColumn,
            icon:true,
            title: 'Delete the column'

        }
    ];



    this.init();
};

Column.prototype = {
    init: function(){
        this.render();
        this.attachDragEvents();
    },

    render: function(){
        var column = this;

        // iner container of the column
        var inner_container = document.createElement("div");
        inner_container.className = 'board-column';
        inner_container.owner = column;

        // menu section of the column
        var menu = document.createElement('div')
        menu.className = 'column-menu';

        // shortcut for the label
        this.label = new Label({container:menu, text: this.name, parent:column})

        // the container for the notes
        var notes_container =  document.createElement("div");
        notes_container.className = 'column-notes';

        // shortcut for the container
        this.notes_container = notes_container;



        var menu_options = this.menu_options;
        for(var i  = 0; i < menu_options.length; i += 1){
            var options = menu_options[i];
            options['parent'] = column;
            options['container'] = menu;
            var button = new Button(options);
            button.attach_action(menu_options[i].action);

        }

        inner_container.appendChild(menu);
        inner_container.appendChild(notes_container);

        column.container.appendChild(inner_container)
        column.element = inner_container;

        //hack to adapt the textarea when populated
        $(this.label.element).keyup()
    },

    _addNote: function( event, column, name, sibling, position){
        //creates a new note
        var note = new Note(column.notes_container, column, name, sibling)


        if(position === undefined){
            // to the last position
            column.notes.push(note)
            note.index = column.notes.length - 1;
        }else{
            // if the position is defined, means we are moving the note to some position
            column.notes.splice(position, 0, note);
            column.notes.join();
            note.index = position;

            //update all following indexes, to back up in the same order
            for(var i = position + 1; i < column.notes.length; i++){
                column.notes[i].index = i;
            }
        }

    },

    _deleteColumn: function(event, column){
        var board = column.parent;

        column.element.remove(); // remove the dom element
        board.deleteColumn(event, column); // remove the column from the parents list

    },

    deleteNote: function(note){
        // removes the note from the list of notes
        var notes = note.parent.notes;
        notes.splice(note.index, 1);

        //update all following indexes
        for(var i = note.index; i < notes.length; i++){
            notes[i].index = i;
        }

    },

    attachDragEvents: function(){
        // listeners for drag and drop
        this.element.addEventListener('dragenter', this.dragEnter);
        this.element.addEventListener('dragstart', this.dragNote )
        this.element.addEventListener('dragend', this.dropNote);

    },


    dragEnter:function( event ){
        /*
            Here we update the css of elements who can get the object being dragged
            An easy way is to check if the elements are type column or note.

            A note can receive another note, it means the new one is inserted before.
            With some css it does a pretty nice effect so we avoid creating containers and placeholders

            Is also needed to check if the note we are pointing is different to the note we are dragging,
            otherwise the note being dragged will be pushed down, and will confuse people delete the condition
            of the if --> if (element.id !== 'dragging') to see the effect

        */
        var element = event.target;

        if(element.owner !== undefined) {
            if (element.owner.type === 'column'){
                var previous = document.querySelector('#dropzone');
                element.id = 'dropzone';
            }else if (element.owner.type === 'note') {
                // this works coz it could be inner-note(DOM)->note(javascript)->note(DOM)
                element = element.owner.element;
                var previous = document.querySelector('#dropzone');

                if (element.id !== 'dragging') {
                    element.id = 'dropzone';
                }
            }

            // avoids event loops
            if(previous){
                if(previous !== element)
                    previous.id = '';
            }
        }

        event.preventDefault()

    },

    dragNote: function( event ){
        // set id dragging for the object which is being dragged
        event.target.id = 'dragging';

        // it seems firefox needs you to use the event.dataTransfer.setData() in order to work properly
        // https://stackoverflow.com/questions/21507189/dragenter-dragover-and-drop-events-not-working-in-firefox
        event.dataTransfer.setData('text/plain', 'dummy');
    },

    dropNote: function( event ){
        /*
           This function drops a note inside a column at the end, or drops it in another note position and pushes down
           all following notes

        */
        var note = event.target.owner;

        // couldn't find any other way to pick up the target :/
        var element = document.querySelector('#dropzone');


        if(!element){
            // avoids some weirds effects
            note.element.id = '';
            event.preventDefault();
        }else{
            element = element.owner;

            if(note.type === 'note' && element.type === 'column'){
                // creates a new note using the name of the note being dragged
                // not sure if just appending the node with appendChild would work
                // I guess that would be more efficient
                var column = element;

                column._addNote(event, column, note.name);
                column.element.id = '';

                // deletes the old one
                note._deleteNote(event,note)
                column.element.id = '';

            }else if(note.type === 'note' && element.type === 'note'){
                // basically the same as in the previous if, but here we can choose the position
                // where the new note is being inserted
                var next_sibling = element;
                next_sibling.parent._addNote(event, next_sibling.parent, note.name, next_sibling, next_sibling.index);
                next_sibling.element.id = '';
                note._deleteNote(event, note);
            }
        }
        event.preventDefault();
    }




}