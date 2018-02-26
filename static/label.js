var Label = function( options ){
    this.type = 'label';
    this.element = '';
    this.container = options.container;
    this.name = options.text;
    this.event_listener = this.content_modified;
    this.parent = options.parent;
    this.init();
};



Label.prototype = {
    init: function(){
        this.render();
        this.attach_action( this.event_listener);
        if(this.name != '') {
            this.content_modified(this, this.element)
        }

    },

    render: function(){
        // using a textarea as a content editor
        // it is not elegant, but does the job
        var _element = document.createElement('textarea');
        _element.placeholder = 'name...';
        _element.className = 'textarea';

        if (this.name === undefined){
            this.name = ''
        }else{
            _element.innerText = this.name;
            _element.value = this.name;
        }


        _element.rows = 1;
        _element.owner = this;

        this.container.appendChild(_element);
        this.element = _element;

    },

    attach_action: function(listener){
        var textarea = this.element;
        this.element.onkeyup = function(event){
            listener(event, textarea)
        }

    },

    content_modified: function( event, textarea){
        /*
         pretty ugly function
         First we trim from the left, and delete empty new lines,
         then updates the textarea innerText and value, not sure if I could use just one of them
         Then adjusts the textarea size
         */
        var processedText =  textarea.value.trimLeft()// trim empty spaces
        processedText =  processedText.replace(/(?:(?:\r\n|\r|\n)\s*){1}/gm, "", ""); // trim empty new lines

        // updates
        textarea.value = processedText;
        textarea.innerText = processedText;

        // hack to keep the size of the textarea
        textarea.style.cssText = 'height:auto; padding:0';
        textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';


        // stores the name in the label
        //textarea.owner.name = textarea.value;
        // stores the name in the note or in the column
        textarea.owner.parent.name = textarea.value;

    }

};