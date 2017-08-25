<app-dateinput>

    <input type="text" ref="date" name="date" id="date" placeholder="Date">

    <script>
        var tag = this;
        tag.value = null;

        tag.on("mount", () => {
            var picker = $('input', tag.root).pickadate({
                format: 'dd/mm/yyyy',
                formatSubmit: 'dd/mm/yyyy',
                hiddenName: true
            });

            if(tag.opts.date !== null)
            {
                picker.pickadate('picker').set("select", tag.opts.date);
            }


            $('input', tag.root)
                .pickadate('picker')
                .on('render', function () {
                    var date = $('input', tag.root).pickadate('picker').get("value");
                    if(date === null)
                        return;
                    date = date.split("/");
                    date = new Date(date[2], parseInt(date[1]) - 1, date[0]);
                    tag.value = Math.round(date.getTime() / 1000);
                });

            if(tag.opts.date != null)
            {
                tag.setValueFromStamp(tag.opts.date);
            }
        });

        tag.setValueFromStamp = function(date)
        {
            console.log(date);
            tag.value = date;
            var readable = new Date();
            readable.setTime(parseInt(date) * 1000);
            console.log(readable.getDate()+"/"+(readable.getMonth()+1)+"/"+readable.getFullYear());
            tag.refs.date.value = readable.getDate()+"/"+(readable.getMonth()+1)+"/"+readable.getFullYear();
            console.log(tag.refs.date.value);
        }
    </script>
</app-dateinput>