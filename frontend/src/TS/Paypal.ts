class Paypal 
{
    private static interval = null;

    public static bindPaypal() : Promise<any>
    {
        return new Promise(function(resolve, reject){
            if(Paypal.interval != null)
                clearInterval(Paypal.interval);
            Paypal.interval = setInterval(() => {
                let code = localStorage.getItem("PaypalLogin-code");
                if(code == null)
                    return;
                clearInterval(Paypal.interval);
                Paypal.interval = null;
                localStorage.removeItem("PaypalLogin-code");
                Paypal.tokenPaypal(code).then(function(data){
                    resolve(data)
                }, function(error){
                    reject(error);
                });
            }, 1000);
        });
    }

    public static tokenPaypal(code) : Promise<any>
    {
        return new Promise(function(resolve, reject){
            alert("lancer la requete");
        });
    }
}