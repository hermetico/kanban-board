var Button = function( options ){
    this.element = '';
    this.parent = options.parent;
    this.container = options.container;
    this.name = options.text;
    this.title = options.title;
    this.icon = options.icon;

    this.init();
};



Button.prototype = {
    init: function(){
        this.render();
    },

    render: function(){
        var _button = document.createElement('button');
        _button.owner = this;
        _button.title = this.title;

        if(this.icon){
            var icon = document.createElement('i');
            icon.className = this.name;
            _button.appendChild(icon);
        }
        else{
            _button.innerText = this.name;
        }


        this.container.appendChild(_button);
        this.element = _button;
    },

    attach_action: function( listener ){
        var parent = this.parent;
        this.element.onclick = function(event){
                listener(event, parent )
        }
    }
};