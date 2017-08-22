<app-recipeedit>
    <app-header></app-header>
    <div class="content">
        <app-recipeeditform ref="form"  recipe="{ recipe }"></app-recipeeditform>
    </div>
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