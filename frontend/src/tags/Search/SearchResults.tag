<app-searchresults>
    <app-header></app-header>

    <app-searchitem></app-searchitem>

    <div>
        <h2>Résultats de la recherche</h2>
    </div>
    <app-recipes recipes={ opts.recipes }></app-recipes>

    <app-footer></app-footer>
    <script>
        var tag = this;

    </script>
</app-searchresults>