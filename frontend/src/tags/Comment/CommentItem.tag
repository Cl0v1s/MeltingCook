<app-commentitem>
    <img src={ comment.author.picture }>
    <div>
        <div>{ comment.author.username} - { comment.author.age} ans</div>
        <div>
            <p>
                { comment.content }
            </p>
        </div>
    </div>
    

    <script>
        var tag = this;

        tag.comment = tag.opts.comment;
    </script>
</app-commentitem>