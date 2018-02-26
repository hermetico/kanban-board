var Note = function( container, parent, name , next_sibling){

    this.type = 'note';
    this.container = container;
    this.parent = parent;
    this.name = name;


    this.next_sibling = next_sibling;
    this.label = '';
    this.element = '';
    this.menu_options = [
        {
            text: "fas fa-trash",
            action: this._deleteNote,
            icon: true,
            title: 'Delete note'
        }

    ];

    this.init();
};

Note.prototype = {
    init: function(){
        this.render();
        this.attachDragEvents();
    },

    render: function(){

        var note = this;
        var container = document.createElement("div");

        container.className = 'note';
        container.draggable = true;
        container.owner = note;

        var inner_container = document.createElement("div");
        inner_container.className = 'note-inner';
        // little trick, the dom note element needs more size to be recognized by dragEnter, so
        // this way we can reference it twice
        inner_container.owner = note;

        this.label = new Label({container:inner_container, text: this.name, parent:note})


        var menu_options = this.menu_options;
        for(var i  = 0; i < menu_options.length; i += 1){
            var options = menu_options[i];
            options['parent'] = note;
            options['container'] = inner_container;

            var button = new Button(options);
            button.attach_action(menu_options[i].action);
        }

        // if next_sibling is specified, we insert this note before
        if(this.next_sibling !== undefined){
            note.container.insertBefore(container, this.next_sibling.element)
        }else{
            note.container.appendChild(container)
        }

        container.appendChild(inner_container)
        note.element = container;

        //hack to adapt the textarea when populated
        $(this.label.element).keyup()
    },

    attachDragEvents: function(){
        this.element.draggable = true;

    },

    _deleteNote: function(event, note){
        var column = note.parent;
        //column.element.parentNode.removeChild(column.element);
        note.element.remove();
        column.deleteNote(note);

    }


};