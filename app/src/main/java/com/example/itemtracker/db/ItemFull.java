package com.example.itemtracker.db;

import androidx.room.Embedded;
import androidx.room.Relation;
import java.util.List;

public class ItemFull {
    @Embedded
    public Item item;
    @Relation(parentColumn = "id", entityColumn = "itemId")
    public List<ExtraCost> costs;
    @Relation(parentColumn = "id", entityColumn = "itemId")
    public List<Attribute> attributes;
}
