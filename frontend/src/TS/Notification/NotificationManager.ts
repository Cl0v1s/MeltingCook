var PNotify = require("pnotify");

class NotificationManager
{
    private static Instance : NotificationManager = new NotificationManager();

    public static GetInstance() : NotificationManager
    {
        return NotificationManager.Instance;
    }

    private interval = null;
    private session : Array<number>;

    constructor()
    {
        this.session = [];
    }

    private run() : void
    {
        if(Login.GetInstance().isLogged() == false)
            return;
        let filters = {
            "User_id" : Login.GetInstance().User().id,
            "new" : "1"
        };
        let request = App.request(App.Address + "/getNotifications", {
            "filters" : JSON.stringify(filters)
        });
        request.then((response : any) => {
            response.data.forEach((n) => {
                let found = false;
                this.session.forEach(function(s){
                   if(s == n.id)
                   {
                       found = true;
                   }
                });
                if(found)
                    return;
                this.session.push(n.id);
                let notice = new PNotify({
                    title: "Hey !",
                    text : n.content+"<br><br><center>Cliquez pour fermer</center>",
                    type : n.type,
                    buttons: {
                        closer: false,
                        sticker: false
                    }
                });
                notice.get().click(function() {
                    notice.remove();
                    let request = App.request(App.Address+"/updatenotification", {
                       "id" : n.id,
                       "new" : 0
                    });
                });
            });

        });
        request.catch(function(error)
        {
           ErrorHandler.GetInstance().handle(error);
        });
    }

    public start()
    {

        if(this.interval != null)
            return;
        this.run();
        PNotify.prototype.options.delay = PNotify.prototype.options.delay + 10000;
        this.interval = setInterval(() => { this.run() }, 60000);
    }

    public stop()
    {
        if(this.interval == null)
            return;
        clearInterval(this.interval);
        this.interval = null;
    }
}