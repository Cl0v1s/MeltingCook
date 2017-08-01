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
            if(price_start != null)
                filters["price_start"] = price_start;
            if(price_end != null)
                filters["price_end"] = price_end;
            var retrieve = App.request(App.Address + "/getrecipes", {
                "filters": JSON.stringify(filters)
            });
            retrieve.then(function (response : any) {
                resolve(response.data);
            });
            retrieve.catch(function (error) {
                reject(error);
            });
        });

    }
}