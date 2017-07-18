<?php

include_once 'Core/Annotations.php';
include_once 'Core/StorageItem.php';

/**
 * Created by PhpStorm.
 * User: clovis
 * Date: 21/03/17
 * Time: 19:48
 */
class Structure extends StorageItem
{
    /**
     * @Required
     * @Word
     * @Size(min=1,max=400)
     */
    public $name;

    /**
     * @Required
     * @Numeric
     */
    public $StructureType_id;

    /**
     * @return mixed
     */
    public function Name()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
        $this->checkIntegrity("name");
    }

    /**
     * @return mixed
     */
    public function StructureTypeId()
    {
        return $this->StructureType_id;
    }

    /**
     * @param mixed $StructureType_id
     */
    public function setStructureTypeId($StructureType_id)
    {
        $this->StructureType_id = $StructureType_id;
        $this->checkIntegrity("StructureType_id");
    }

    
    
}