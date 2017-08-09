<app-users>
    <app-useritem each={ user in users } user={ user } reduced={ true }></app-useritem>

    <script>
        var tag = this;
        tag.users = null;

        tag.on("before-mount", function()
        {
            tag.users = tag.opts.users;
        });

        tag.setUsers = function(users)
        {
            tag.users = users;
            tag.update();
        }
    </script>
</app-users>