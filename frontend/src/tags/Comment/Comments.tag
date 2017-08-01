<app-comments>
    <app-commentitem each={ comment in comments} comment={comment}></app-commentitem>
    <script>
        var tag = this;
        tag.comments = tag.opts.comments;
    </script>
</app-comments>