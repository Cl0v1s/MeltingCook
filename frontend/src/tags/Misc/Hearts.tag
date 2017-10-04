<app-hearts>
    <div each="{ ht in hearts}" class="{ ht.state }" data-index="{ ht.index }"  onclick="{ set }">
    </div>

    <script>
        var tag = this;
        tag.hearts = null;

        tag.interactive = false;
        tag.index = null;

        tag.value = 3;

        tag.on("before-mount", function()
        {

            if(tag.opts.interactive != null)
                tag.interactive = tag.opts.interactive;

            if(tag.interactive == true) {
                tag.opts.repeat = tag.value;
            }
            tag.createHearts();
        });

        tag.createHearts = function()
        {
            tag.hearts = [];
            for(let i = 0; i < 5; i++) {
                let state = "empty";
                if (i < tag.opts.repeat)
                    state = "full";
                tag.hearts.push({
                    "state" : state,
                    "index" : i+1
                });
            }
        };

        tag.set = function(e)
        {
            if(tag.interactive == false)
                return;
            let ind = parseInt(e.target.getAttribute('data-index'));
            console.log(ind);
            tag.value = ind;
            tag.opts.repeat = tag.value;
            tag.createHearts();
            tag.update();

        }

    </script>
</app-hearts>