<app-placehint>
    <div>
        <div>{ place } - ({ latitude }, {longitude})</div>
        <a onclick={ toggleMap }>voir le plan</a>
    </div>
    <div class={ invisible: opened == false, open: opened == true, close: opened == false }>
        <iframe frameborder="0" src="https://maps.google.com/maps?q={ latitude },{ longitude }&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
    </div>


    <script>
        var tag = this;

        tag.place = tag.opts.place;
        tag.latitude = tag.opts.latitude;
        tag.longitude = tag.opts.longitude;

        tag.opened = false;

        tag.toggleMap = function()
        {
            tag.opened = !tag.opened; 
            tag.update();
        }
    </script>
</app-placehint>
