<app-useritem>
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
        <div class={style : true, invisible: user.style == null || user.style == ""}>
            <span>Son style</span>
            <span>{ user.style }</span>
        </div>
        <div>
            <div class="Pins" each={ pin in user.pins}>
                { pin }
            </div>
        </div>
    </div>
    <div class="foot">
        <input type="button" class="large" value="Connaître le chef" onclick={ details }>
    </div>


    <script>
        var tag = this;

        tag.user = tag.opts.user;

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