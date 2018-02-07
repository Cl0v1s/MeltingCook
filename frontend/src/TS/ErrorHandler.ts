class ErrorHandler
{
    public static State = {
        INFO : "INFO", 
        ERROR : "ERROR",
        FATAL : "FATAL"
    }

    private static Instance : ErrorHandler = new ErrorHandler();

    public static GetInstance() : ErrorHandler
    {
        return ErrorHandler.Instance;
    }

    public handle(response) : void
    {
        if(response.state == "OK")
            return;
        let error = ErrorHandler.GetInstance().handleSQL(response);
        if(error != null)
        {
            throw error;
        }
        error = new Error();
        switch(response.data)
        {
            case 0:
                error.message = "Vos informations de connexion ne sont pas valides.";
                error.name = ErrorHandler.State.FATAL;
            break;
            case 1:
                error.message = "Vous n'avez pas les droits suffisants."
                error.name = ErrorHandler.State.FATAL;
            break;
            case 2:
                error.name = ErrorHandler.State.ERROR;
                error.message = response.message.split("#")[0]+".";
                break;
            case "105":
            case 105:
                error.message = "Une valeur requise est manquante. Veuillez vérifier le formulaire.";
                error.name = ErrorHandler.State.ERROR;
            break;
            case 101:
                var length = response.message.split(" than ")[1].split("\n\n#0")[0];
                error.message = "Une valeur est en dessous de la longueur requise de "+length+" caractères. Veuillez vérifier le formulaire.";
                error.name = ErrorHandler.State.ERROR;
            break;
            default:
                error.name = ErrorHandler.State.ERROR;
                error.message = "Ooops... Quelque chose s'est mal passé. Veuillez réessayer plus tard.";
            break;
        }
        if(response.data != null)
            console.error(response.data);
        else 
            console.error(response);
        throw error;
    }

    private handleSQL(response) : Error
    {
        let error = null;
        // gestion de l'unicité 
        if(response.indexOf(" 1062 ") != -1)
        {
            error = new Error();
            var value = response.split("Duplicate entry '")[1].split("' for key ")[0];
            error.message = "La valeur "+value+" transmise existe déjà dans la base de données. Veuillez corriger le formulaire.";
            error.name= ErrorHandler.State.ERROR;
        }

        return error;
    }

    public static alertIfError(error : any) : void 
    {
        if(error instanceof Error)
            NotificationManager.showNotification(error.message, "error");
    }
}