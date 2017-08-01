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
        <div class="style">
            <span>Son style</span>
            <span>{ user.style }
        </div>
        <div class="pins">
            <div class="Pins" each={ pin in pins}>
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

        tag.on("before-mount", function()
        {
            if(tag.user == null)
            {
                throw new Error("user must be set.");
            }
            tag.style = tag.preference.split(";")[0];
            tag.pins = tag.pins.split(";");
        });

        tag.details = function()
        {
            route("/user/"+tag.user.id);
        }
    </script>
</app-useritem>