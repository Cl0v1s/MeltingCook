<app-error>
    <app-header></app-header>
    <div>
        <h1>Ooops... Quelque chose s'est mal passé.</h1>
        <div>
            <p>
                Nous sommes désolés pour ce petit soucis.
            </p>
            <p if="{ message != null }">
                { message }
            </p>
        </div>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.message = null;

        tag.on("before-mount", function()
        {
            if(tag.opts.message !== null)
                tag.message = tag.opts.message;
        });
    </script>
</app-error>