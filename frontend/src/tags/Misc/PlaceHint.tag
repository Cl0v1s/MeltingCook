<app-placehint>
    <div>
        <div class="img"></div>
        <div>{ opts.place } - <a onclick='{ toggleMap }'>voir le plan</a></div>
    </div>
    <div class='{ map : true, invisible: opened == false, open: opened == true, close: opened == false }'>
        <iframe frameborder="0"  src="https://maps.google.com/maps?q={ opts.latitude },{ opts.longitude }&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
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
