<app-comments>
    <app-commentitem each={ comment in comments} comment={comment}></app-commentitem>
    <script>
        var tag = this;

        tag.comments = null;

        tag.on("before-mount", function()
        {
            tag.comments = tag.opts.comments;
            if(tag.comments === null)
                throw new Error("Comments cant be null.");
        });

        tag.setComments = function(comments)
        {
            tag.comments = comments;
            tag.update();
        }
    </script>
</app-comments>