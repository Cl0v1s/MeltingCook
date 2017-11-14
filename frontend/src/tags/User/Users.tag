<app-users>
    <div class="user" each="{ user in users }" data-id="{ user.id }">
            
                    <img src={ user.picture }>
                    <div>
                        <a href="#/user/{user.id}">{ user.username }</a><br>
                        { user.age } ans
                    </div>
                    <app-hearts repeat="{ user.likes }"></app-hearts>
                    
    </div>

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