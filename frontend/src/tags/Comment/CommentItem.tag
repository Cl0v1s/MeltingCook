<app-commentitem>

    <img class="profile" src={ comment.author.picture }>
    <div>
        <div>{ comment.author.username} - { comment.author.age} ans <div class="Hearts nb-{ comment.note }"></div></div>
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