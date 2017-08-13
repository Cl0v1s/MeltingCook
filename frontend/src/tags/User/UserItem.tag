<app-useritem onclick={ details }>
    <div class="head">
        <img src={ user.picture }>
        <div>
            <span>{ user.username }</span>
            <span>{ user.age } ans</span>
        </div>
    </div>
    <div class="body">
        <div class="Hearts nb-{ user.likes }">
        </div>
        <div class='{style : true, invisible: user.style == null || user.style == ""}'>
            <span>Son style</span>
            <span>{ user.style }</span>
        </div>
        <div>
            <div class="Pins" each={ pin in user.pins}>
                { pin }
            </div>
        </div>
    </div>
    <div class="foot" if={ reduced == false }>
        <input type="button" class="large" value="Connaître le chef" onclick={ details }>
    </div>


    <script>
        var tag = this;

        tag.user = null;
        tag.reduced = false;

        tag.on("before-mount", function()
        {
            tag.user = Adapter.adaptUser(tag.opts.user);
            if(tag.opts.reduced != null)
                tag.reduced = tag.opts.reduced;
        });

        tag.setUser = function(user)
        {
            tag.user = Adapter.adaptUser(user);
            tag.update();
        }

        tag.details = function()
        {
            route("/user/"+tag.user.id);
        }
    </script>
</app-useritem>