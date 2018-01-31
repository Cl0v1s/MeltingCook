<app-uploadinput>
    <div class="dropzone"></div>
    <script>
        var tag = this;
        tag.value = null;
        tag.onchange = null;
        tag.on("before-mount", function(){
            if(tag.opts.value != null)
                tag.value = tag.opts.value;
            if(tag.opts.onchange != null)
                tag.onchange = tag.opts.onchange;
        });


        tag.on("mount", function(){
            let callback = function (res) {
                if (res.success === true) {
                    console.log(res.data.link);
                    tag.value = res.data.link;
                    if(tag.onchange != null)
                        tag.onchange();
                }
            };

            new Imgur({
                clientid: 'xxxxxxxxxxxxxxxxx',
                callback: callback
            });
        });
    </script>
</app-uploadinput>