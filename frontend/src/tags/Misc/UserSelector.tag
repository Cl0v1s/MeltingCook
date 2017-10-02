<app-userselector>
    <input type="text" name="user" ref="user" id="user">

    <script>
        var tag = this;

        tag.value = "";

        tag.on("mount", function()
        {
            tag.retrieveUsers();
        });

        tag.retrieveUsers = function()
        {
            let request = App.request(App.Address+"/getusers", null);
            request.then(function(response){
                $('#user', tag.root).selectize({
                    persist: false,
                    maxItems: 1,
                    valueField: ["id"],
                    labelField: 'username',
                    searchField: ['username'],
                    options: response.data,
                    onChange : function(value) {
                        tag.value = value;
                    }
                });
            });
            request.catch(function(error){
               ErrorHandler.alertIfError(error);
            });
        };

    </script>
</app-userselector>