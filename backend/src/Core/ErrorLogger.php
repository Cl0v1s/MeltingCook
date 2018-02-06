<?php
    class ErrorLog
    {

        /**
         * @Required
         * @Numeric
         *
         * @var number
         */
        public $datetime;

        /**
         * @Required
         * @Word
         * @Size(min=1, max=400)
         *
         * @var string
         */
        public $project;

        /**
         * @Required
         * @Word
         * @Size(min=1, max=1400)
         *
         * @var string
         */
        public $message;

        /**
         * @Required
         * @Word
         * @Size(min=1, max=1400)
         *
         * @var string
         */
        public $stacktrace;

        /**
         * @Word
         * @Size(min=1, max=400)
         *
         * @var string
         */
        public $details;

    }

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    class ErrorLogger
    {
        private static $API = null;
        private static $PROJECT = null;
        public static $LOGGER = null;

        public static function register($api, $project)
        {
            ErrorLogger::$API = $api;
            ErrorLogger::$PROJECT = $project;
            set_error_handler(array("ErrorLogger", 'handleError'),E_ALL);
            set_exception_handler(array("ErrorLogger", 'handleException'));

            ErrorLogger::$LOGGER = new Logger('logger');
            ErrorLogger::$LOGGER->pushHandler(new StreamHandler('ErrorLogger.log', Logger::WARNING));
        }

        public static function handleError($number,$string,$file,$line,$context)
        {
            ErrorLogger::handle($string, $line." ".$file);
        }

        public static function handleException(Exception $e)
        {
            ErrorLogger::handle($e->getMessage(), $e->getTraceAsString());
        }

        public static function handle($message, $stacktrace, $details = null)
        {
            $e = new ErrorLog();
            $e->datetime = time();
            $e->message = $message;
            $e->stacktrace = $stacktrace;
            $e->project = ErrorLogger::$PROJECT;
            $e->details = $details;
            ErrorLogger::sendToLogFile($e);
            ErrorLogger::sendToDatabase($e);
        }

        private static function sendToLogFile(ErrorLog $e)
        {
            $res = $e->datetime." ".$e->message." ".$e->stacktrace." ".$e->details;
            ErrorLogger::$LOGGER->error($res);
        }

        private static function sendToDatabase(ErrorLog $e)
        {
            $url = ErrorLogger::$API;
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_PUT, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $fields = array(
                "project" => $e->project,
                "datetime" => $e->datetime,
                "message" => $e->message,
                "details" => $e->details,
                "stacktrace" => $e->stacktrace
            );
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($fields));
            $response = curl_exec($ch);
            ErrorLogger::$LOGGER->info($response);
            //echo $response;
        }
    }