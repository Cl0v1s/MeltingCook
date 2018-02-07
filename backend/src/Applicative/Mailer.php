<?php

class Mailer
{
    private static $MANAGEREMAIL = "chaipokoi@gmail.com";




    private static $HEADER = "<header>Melting Cook</header>";
    private static $FOOTER = "<div class='date'>Le --DATE-- </div><footer>Ceci est un mail automatique. Merci de ne pas répondre directement. Veuillez contacter --MANAGEREMAIL-- si besoin.</footer>";

    public static function SendMailToAdmin($subject, $body)
    {
        Mailer::SendMail(Mailer::$MANAGEREMAIL,$subject, $body);
    }

    public static function SendMail($receiver, $subject, $body)
    {
        $headers = "From: noreply@meltingcook.fr \r\n";
        $headers .= "Reply-To: ".Mailer::$MANAGEREMAIL. "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";


        $body = Mailer::$HEADER.$body.Mailer::$FOOTER;
        $date = new DateTime();
        $body = str_replace("--DATE--", $date->format('Y-m-d H:i:s'), $body);
        $body = str_replace("--MANAGEREMAIL--", Mailer::$MANAGEREMAIL, $body);
        mail($receiver, $subject, $body, $headers);
    }
}