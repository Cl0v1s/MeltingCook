<app-adminorigins>
    <app-header></app-header>
    <app-tabbar tabs="{ tabs }"></app-tabbar>
    <div class="content">
        <a class='Action' onclick="{ add }"><span>Ajouter une origine</span></a>
        <table>
            <thead>
                <tr>
                    <td>Intitulé</td><td>Actions</td>
                </tr>
            </thead>
            <tbody>
                <tr each="{ origin, i in origins }" id="item-{ origin.id }">
                    <td>{ origin.name }</td>
                    <td>
                        <a class="onclick" onclick="{ edit }" data-id="{ origin.id }" data-index="{ i }">Editer</a>
                        <a class="onclick" onclick="{ delete }" data-id="{ origin.id }" >Supprimer</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.origins = null;
        tag.tabs = [
        {
                name : "Utilisateurs",
                route : "/admin/users",
                selected : false
            },
            {
                name : "Signalement",
                route : "/admin/reports",
                selected : false
            },
            {
                name : "Transactions",
                route : "/admin/reservations",
                selected : false
            },
            {
                name : "Origines",
                route :"/admin/origins",
                selected : true
            },
            {
                name : "Les Plus",
                route :"/admin/pins",
                selected : false
            }
        ];

        tag.on("before-mount", function()
        {
           tag.origins = tag.opts.origins;
           if(tag.origins == null)
               throw new Error("Origins cant be null.");
        });

        tag.add = function(e)
        {

            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("L'origine a bien été ajoutée.");
                window.location.reload();
            };

            App.showPopUp("app-origineditform", "Ajout d'une origine", { "callback" : callback});
        };

        tag.edit = function(e)
        {
            let id = parseInt(e.target.getAttribute("data-index"));

            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("L'origine a bien été mise à jour.");
                window.location.reload();
            };

            App.showPopUp("app-origineditform", "Edition d'une origine", { "callback" : callback, "origin" : tag.origins[id]});
        };

        tag.delete = function(e)
        {
            let id = e.target.getAttribute("data-id");

            vex.dialog.confirm({
                message: 'Etes-vous sûr de vouloir supprimer cette entrée ?',
                callback: function (value) {
                    if (value) {
                        var request = App.request(App.Address + "/removeorigin", {
                            "id" : id
                        });
                        request.then(function (response) {
                            var l = document.querySelector("#item-"+id);
                            if(l != null)
                                l.remove();
                        });
                        request.catch(function(error){
                            ErrorHandler.alertIfError(error);
                        });
                    }
                }
            });

        }
    </script>
</app-adminorigins>