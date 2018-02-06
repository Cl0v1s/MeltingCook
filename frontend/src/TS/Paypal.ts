class Paypal 
{
    private static interval = null;
    private static timeout = null;

    public static bindPaypal() : Promise<any>
    {
        return new Promise(function(resolve, reject){
            if(Paypal.interval != null)
                clearInterval(Paypal.interval);
            if(Paypal.timeout != null)
                clearTimeout(Paypal.timeout);

            Paypal.timeout = setTimeout(() => {
                clearInterval(Paypal.interval);
                Paypal.interval = null;
                clearTimeout(Paypal.timeout);
                Paypal.timeout = null;
                reject(null);
            }, 1000*60*5);

            Paypal.interval = setInterval(() => {
                console.log("ask");
                let code = localStorage.getItem("PaypalLogin-code");
                let error = localStorage.getItem("PaypalLogin-error");
                if(error == "true")
                {
                    clearInterval(Paypal.interval);
                    Paypal.interval = null;
                    clearTimeout(Paypal.timeout);
                    Paypal.timeout = null;
                    localStorage.removeItem("PaypalLogin-code");
                    localStorage.removeItem("PaypalLogin-error");
                    reject(null);
                    return;
                }
                if(code == null)
                    return;
                clearInterval(Paypal.interval);
                Paypal.interval = null;
                clearTimeout(Paypal.timeout);
                Paypal.timeout = null;
                localStorage.removeItem("PaypalLogin-code");
                console.log(code);
                resolve(code);
            }, 1000);
        });
    }
}