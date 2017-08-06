<app-error>
    <app-header></app-header>
    <div>
        <h1>Ooops... Quelque chose s'est mal passé.</h1>
        <div>
            <p>
                Nous somme désolé pour ce petit soucis.
            </p>
            <p>
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
            tag.message = decodeURI(tag.opts.pass);
        });
    </script>
</app-error>