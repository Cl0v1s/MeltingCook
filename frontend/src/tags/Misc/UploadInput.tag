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
                    tag.root.classList.remove("error");
                    tag.value = res.data.link;
                    if(tag.onchange != null)
                        tag.onchange();
                }
            };

            new Imgur({
                clientid: 'c15f2df6d132436',
                callback: callback,
                target : tag.root.querySelectorAll(".dropzone"),
                message: "Glissez votre photographie ici ou cliquez ici."
            });
        });
    </script>
</app-uploadinput>