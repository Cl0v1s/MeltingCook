<app-commentlist>
    <app-header></app-header>
    <app-comments comments={ comments }></app-comments>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.comments = null;

        tag.on("before-mount", function(){
            tag.comments = tag.opts.comments;

            if(tag.comments == null)
                tag.retrieveComments();
        });

        tag.retrieveComments = function()
        {
            var request = App.request(App.Address + "/getcomments", null);
            request.then((response) => {
                tag.comments = response.data;
                tag.update();
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });
        };
    </script>
</app-commentlist>