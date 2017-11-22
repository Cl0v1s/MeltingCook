<?php

include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 21/03/17
 * Time: 19:48
 */
class Reservation extends StorageItem
{
    /**
     * @Required
     * @Numeric
     */
    public $host_id;

    /**
     * @Required
     * @Numeric
     */
    public $guest_id;


    /**
     * @Required
     * @Numeric
     */
    public $Recipe_id;

    /**
     * @Required
     * @Numeric
     */
    public $paid;

    /**
     * @Required
     * @Numeric
     */
    public $done;

    /**
     * @Word
     */
    public $txn_id;

    public $created_at;

    public $paid_at;

    public $ended_at;


    /**
     * @return mixed
     */
    public function HostId()
    {
        return $this->host_id;
    }

    /**
     * @param mixed $host_id
     */
    public function setHostId($host_id)
    {
        $this->host_id = $host_id;
        $this->checkIntegrity("host_id");
    }

    /**
     * @return mixed
     */
    public function GuestId()
    {
        return $this->guest_id;
    }

    /**
     * @param mixed $guest_id
     */
    public function setGuestId($guest_id)
    {
        $this->guest_id = $guest_id;
        $this->checkIntegrity("guest_id");

    }

    /**
     * @return mixed
     */
    public function RecipeId()
    {
        return $this->Recipe_id;
    }

    /**
     * @param mixed $Recipe_id
     */
    public function setRecipeId($Recipe_id)
    {
        $this->Recipe_id = $Recipe_id;
        $this->checkIntegrity("Recipe_id");

    }

    /**
     * @return mixed
     */
    public function Paid()
    {
        return $this->paid;
    }

    /**
     * @param mixed $paid
     */
    public function setPaid($paid)
    {
        $this->paid = $paid;
        $this->checkIntegrity("paid");

    }

    /**
     * @return mixed
     */
    public function Done()
    {
        return $this->done;
    }

    /**
     * @param mixed $done
     */
    public function setDone($done)
    {
        $this->done = $done;
        $this->checkIntegrity("done");

    }

    /**
     * @return mixed
     */
    public function TxnId()
    {
        return $this->txn_id;
    }

    /**
     * @param mixed $txn_id
     */
    public function setTxnId($txn_id)
    {
        $this->txn_id = $txn_id;
        $this->checkIntegrity("txn_id");
    }

    /**
     * @return mixed
     */
    public function CreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param mixed $created_at
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
    }

    /**
     * @return mixed
     */
    public function PaidAt()
    {
        return $this->paid_at;
    }

    /**
     * @param mixed $paid_at
     */
    public function setPaidAt($paid_at)
    {
        $this->paid_at = $paid_at;
    }

    /**
     * @return mixed
     */
    public function EndedAt()
    {
        return $this->ended_at;
    }

    /**
     * @param mixed $ended_at
     */
    public function setEndedAt($ended_at)
    {
        $this->ended_at = $ended_at;
    }


    
    

    
}
