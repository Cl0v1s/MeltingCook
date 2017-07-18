<?php

include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 21/03/17
 * Time: 19:48
 */
class Entry_Event extends StorageItem
{
    /**
     * @Required
     * @Numeric
     */
    public $Entry_id;

    /**
     * @Required
     * @Numeric
     */
    public $Event_id;

    /**
     * @return mixed
     */
    public function EntryId()
    {
        return $this->Entry_id;
    }

    /**
     * @param mixed $Entry_id
     */
    public function setEntryId($Entry_id)
    {
        $this->Entry_id = $Entry_id;
        $this->checkIntegrity("Entry_id");
    }

    /**
     * @return mixed
     */
    public function EventId()
    {
        return $this->Event_id;
    }

    /**
     * @param mixed $Event_id
     */
    public function setEventId($Event_id)
    {
        $this->Event_id = $Event_id;
        $this->checkIntegrity("Event_id");
    }
    
    
}