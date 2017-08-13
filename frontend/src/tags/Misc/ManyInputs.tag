<app-manyinputs>
    <div>
        <input type="text" each='{ val,i in value.split(delimiter) }' value='{ val }' onkeydown='{ observe }' onchange='{ updateValue }'>
        <input type="button" value="Ajouter une ligne" onclick='{ add }'>
    </div>


    <script>
        var tag = this;

        tag.delimiter = ";";
        tag.length = 1;
        tag.value = "";

        tag.on("before-mount", function()
        {
            if(tag.opts.delimiter != null)
                tag.delimiter = tag.opts.delimiter;
            if(tag.opts.value != null)
                tag.value = tag.opts.value;
        });

        tag.observe = function(e)
        {
            if(e.key == tag.delimiter)
                e.preventDefault();
        };

        tag.updateValue = function()
        {
            tag.value = "";
            var inputs = tag.root.querySelectorAll("input[type=text]");
            inputs.forEach(function(input)
            {
                tag.value = tag.value+input.value+tag.delimiter;
            });
            tag.value = tag.value.slice(0, -1);
        }

        tag.add = function()
        {
            tag.value = tag.value+tag.delimiter;
            tag.length = tag.value.split(tag.delimiter).length;
            tag.update();
        };



    </script>
</app-manyinputs>