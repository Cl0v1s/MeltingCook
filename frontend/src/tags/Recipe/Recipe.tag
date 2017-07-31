<app-recipe>

    <script>
        var tag = this;

        tag.recipe = tag.opts.recipe;

        tag.on("mount", () => {
            if(tag.recipe == null && tag.opts.pass != null)
                tag.retrieveRecipe(tag.opts.pass);
        });

        tag.retrieveRecipe = function(id)
        {
            var request = App.request(App.Address + "/getrecipe", {
                "id" : id
            });
            request.then((response) => {
                tag.recipe = response.data;
                tag.update();
            });
            request.catch((error) => {
                if(error == null)
                {
                    vex.dialog.alert("Oops.. Quelque chose s'est mal passé. Veuillez réessayer plus tard.");
                }
                route("/");
            });
        };

        tag.user = function()
        {
            if(tag.recipe != null)
                route("/user/"+tag.recipe.User_id);
        }
    </script>
</app-recipe>