<app-adminpins>
    <app-header></app-header>
    <app-tabbar tabs="{ tabs }"></app-tabbar>
    <div class="content">
        <a class='Action' onclick="{ add }"><span>Ajouter un Plus</span></a>


        <table>
            <thead>
                <tr>
                    <td>Intitulé</td><td>Actions</td>
                </tr>
            </thead>
            <tbody>
                <tr each="{ pin, i in pins }" id="item-{ pin.id }">
                    <td>{ pin.name }</td>
                    <td>
                        <a class="onclick" onclick="{ delete }" data-id="{ pin.id }" >Supprimer</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <app-footer></app-footer>
    <script>
        var tag = this;

        tag.pins = null;
        tag.tabs = [
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
                selected : false
            },
            {
                name : "Les Plus",
                route :"/admin/pins",
                selected : true
            }
        ];

        tag.on("before-mount", function()
        {
           tag.pins = tag.opts.pins;
           if(tag.pins == null)
               throw new Error("Pins cant be null.");
        });

        tag.add = function(e)
        {

            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("Le Plus a bien été ajouté.");
                window.location.reload();
            };

            App.showPopUp("app-pineditform", "Ajout d'un Plus", { "callback" : callback});
        };

        tag.edit = function(e)
        {
            let id = parseInt(e.target.getAttribute("data-index"));

            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("Le Plus a bien été mise à jour.");
            };

            App.showPopUp("app-pineditform", "Edition d'un Plus", { "callback" : callback, "pin" : tag.pins[id]});
        };

        tag.delete = function(e)
        {
            let id = e.target.getAttribute("data-id");

            vex.dialog.confirm({
                message: 'Etes-vous sûr de vouloir supprimer cette entrée ?',
                callback: function (value) {
                    if (value) {
                        var request = App.request(App.Address + "/removepins", {
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
</app-adminpins>