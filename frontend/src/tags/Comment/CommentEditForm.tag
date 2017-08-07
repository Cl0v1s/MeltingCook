<app-commenteditform>
    <form name="edit-comment" class={ invisible : tag.comment==null }>
        <div>
            <label>Contenu de l'avis</label>
            <textarea name="content" ref="content">
                { comment.content }
            </textarea>
        </div>
        <input type="button" class="large" value="Envoyer" onclick={ send }>
    </form>

    <script>
        var tag = this;

        tag.comment = tag.opts.comment;
        tag.target = tag.opts.target;
        tag.author = tag.opts.author;
        tag.callback = tag.opts.callback;

        tag.send = function () {
                var valid = new Validatinator({
                    "edit-comment": {
                        "content": "required|minLength:10|maxLength:400"
                    }
                });
                if (valid.passes("edit-user")) {
                    var url = App.Address + "/updatecomment";
                    var cmt = tag.comment;
                    if(cmt.id == null)
                    {
                        url = App.Address + "/addcomment";
                        cmt = {};
                        cmt.author_id = tag.author.id;
                        cmt.target_id = tag.target.id;
                    }
                    cmt.content = tag.refs.content.value   
                    var request = App.request(url, cmt);
                    request.then((response) => {
                        tag.callback();
                    });
                    request.catch((error) => {
                        ErrorHandler.alertIfError(error);
                    });
                }
                else 
                {
                    vex.dialog.alert("Le formulaire n'est pas valide en l'état.");
                }
        }
    </script>
</app-commenteditform>