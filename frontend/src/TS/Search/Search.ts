class Search {
    public static search(place, origin, date, price_start, price_end): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            var filters = {
            };
            if(place != null && place != "")
                filters["geolocation"] = place;
            if(origin != null && origin !="")
                filters["origin"] = origin;
            if(date != null && date != "")
            {
                    filters["date_start"] = date;
                    filters["date_end"] = date;
            }
            else
            {
                let now = Math.floor(new Date().getTime() / 1000);
                filters["date_end"] = now;
                filters["date_start"] = now;
            }
            if(price_start != null)
                filters["price_start"] = price_start;
            if(price_end != null)
                filters["price_end"] = price_end;


            console.log(filters);
            var retrieve = App.request(App.Address + "/getrecipes", {
                "filters": JSON.stringify(filters)
            });
            retrieve.then(function (response : any) {
                var ids = [];
                response.data.forEach(function(recipe)
                {
                    ids.push(recipe.id);
                });
                resolve(ids);
            });
            retrieve.catch(function (error) {
                reject(error);
            });
        });

    }
}