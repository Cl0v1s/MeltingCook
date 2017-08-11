<app-recipeedit>
    <app-header></app-header>
    <app-recipeeditform ref="form"  recipe="{ recipe }"></app-recipeeditform>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.recipe = {};

        tag.on("before-mount", function()
        {
            if(tag.opts.recipe != null) {
                tag.recipe = tag.opts.recipe;
            }
        });
    </script>
</app-recipeedit>