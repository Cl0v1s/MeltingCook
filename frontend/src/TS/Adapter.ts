class Adapter
{
    public static adaptRecipe(recipe : any) : any
    {
        if(recipe.adapted === true)
            return recipe;
        recipe.adapted = true;
        var date_start = new Date(recipe.date_start*1000);
        recipe.date_start_readable = date_start.getDate() + "/"+(date_start.getMonth()+1)+"/"+date_start.getFullYear();
        var date_end = new Date(recipe.date_end*1000);
        recipe.date_end_readable = date_end.getDate() + "/"+(date_end.getMonth()+1)+"/"+date_end.getFullYear();
        if(recipe.pins != null)
            recipe.pins = recipe.pins.split(";");
        else 
            recipe.pins = [];
        if(recipe.origin != null)
            recipe.origin = recipe.origin.split(";");
        else 
            recipe.origin = [];
        if(recipe.items != null)
            recipe.items = recipe.items.split(";");
        else 
            recipe.items = [];

        for(let i = 0; i < recipe.items.length;)
        {
            if(recipe.items[i] == null || recipe.items[i].replace(/ /g, "").length <= 0)
            {
                recipe.items.splice(i, 1);
            }
            else
                i++;
        }

        if(recipe.origin[recipe.origin.length -1 ] == "" || recipe.origin[recipe.origin.length -1 ] == null)
            recipe.origin.pop();
        if(recipe.items[recipe.items.length -1 ] == "" || recipe.items[recipe.items.length -1 ] == null)
            recipe.items.pop();
        if(recipe.pins[recipe.pins.length -1 ] == "" || recipe.pins[recipe.pins.length -1 ] == null)
            recipe.pins.pop();

        recipe.place_left = parseInt(recipe.places);

        if(recipe.user != null)
        {
            recipe.place_left -= recipe.users.length;
        }

        recipe.price = parseInt(recipe.price);

        return recipe;
    }

    public static adaptUser(user : any) : any
    {
        if(user.adapted === true)
            return user;
        user.adapted = true;
        if(user.discease != null)
            user.discease = user.discease.split(";");
        else user.discease = [];
        if(user.preference != null)
            user.preference = user.preference.split(";");
        else user.preference= [];
        if(user.pins != null)
            user.pins = user.pins.split(";");
        else user.pins = [];

        if(user.discease[user.discease.length -1 ] == "" || user.discease[user.discease.length -1 ] == null)
            user.discease.pop();
        if(user.preference[user.preference.length -1 ] == "" || user.preference[user.preference.length -1 ] == null)
            user.preference.pop();
        if(user.pins[user.pins.length -1 ] == "" || user.pins[user.pins.length -1 ] == null)
            user.pins.pop();

        if(user.preference.length >= 1)
        {
            user.style = user.preference[0];
        }

        return user;
    }

    public static adaptReport(report : any) : any
    {
        switch(report.state)
        {
            case "1":
            case 1:
            default:
                report.message_state = "Nouveau";
                break;
            case "2":
            case 2:
                report.message_state = "En Cours";
                break;
            case "3":
            case 3:
                report.message_state = "Terminé";
            break;
        }
        return report;
    }
}