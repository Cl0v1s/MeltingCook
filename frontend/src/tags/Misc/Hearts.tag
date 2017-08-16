<app-hearts>
    <div class="full" each="{ rpt in repeat}">
    </div>
    <div class="empty" each="{ rpt in empties }">

    </div>
    <script>
        var tag = this;
        tag.empties = null;
        tag.repeat = null;
        tag.on("before-mount", function()
        {
            if(tag.opts.repeat > 0)
                tag.repeat = new Array(tag.opts.repeat);
            tag.empties = new Array(5-tag.opts.repeat);
        });

    </script>
</app-hearts>