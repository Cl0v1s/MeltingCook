<app-tabbar>
    <div>
        <span each={ tab in tabs } class={ selected : tab.selected == true } data-route={ tab.route } onclick={ redirect }>{ tab.name }</span>
    </div>

    <script>
        var tag = this;

        tag.tabs = null;

        tag.on("before-mount", function()
        {
            tag.tabs = tag.opts.tabs;
        });

        tag.setTabs = function(tabs)
        {
            tag.tabs = tabs;
            tag.update();
        }

        tag.redirect = function(e)
        {
            var span = e.target;
            route(span.getAttribute("data-route"));
        }
    </script>
</app-tabbar>