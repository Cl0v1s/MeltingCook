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
            let request = App.request("https://api.sandbox.paypal.com/v1/identity/openidconnect/tokenservice",{
                "grant_type" : "authorization_code",
                "code" : code 
            },true,true,"Basic QVRxcnpvMWRYb2VJTEhWVXhFUEhDNEJ6RlFEVV82NU5QVHhyelRxa29FcU4zdFJreWthaHB4TkNO Njg0ajdtVWJ4Q3Rua3o2LUdvRnA3MHk6RUJ3a1VlamlncVJILTNUNzBGTEZBY2NWZWQxaVlJd3pM b0xtS1lPTy02YkQ0UE5ISGZJM3lyd0N0VEJTci1UYWsyaEVCdnotdXpVTmJtaGQ=");

            request.then(function(response){
                console.log(response);
            });

            request.catch(function(error){
                console.log(error);
            })

        });
    }
}