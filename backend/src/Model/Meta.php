<?php
include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

class Meta extends StorageItem 
{
    /**
     * @Numeric
     */
    public $last_timed_verification;

    public function LastTimedVerification()
    {
        return $this->last_timed_verification;
    }

    public function setLastTimedVerification($value)
    {
        $this->last_timed_verification = $value;
        $this->checkIntegrity("last_timed_verification");
    }
}