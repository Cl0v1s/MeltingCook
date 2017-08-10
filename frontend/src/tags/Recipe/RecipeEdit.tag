<app-recipeedit>
    <app-header></app-header>
    <app-recipeeditform ref="form"></app-recipeeditform>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.on("mount", function()
        {
            if(tag.opts.pass != null)
            {
                tag.retrieve(tag.opts.pass);
            }
            else
                tag.refs.form.setRecipe({});
        });

        tag.retrieve = function(id)
        {
            var request = App.request(App.Address + "/getrecipe", {
                "id" : id
            });
            request.then((response) => {
                tag.refs.form.setRecipe(response.data);
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);
            });
        }
    </script>
</app-recipeedit>