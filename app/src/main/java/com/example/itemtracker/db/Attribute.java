package com.example.itemtracker.db;

import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.Index;
import androidx.room.PrimaryKey;

@Entity(tableName = "attributes",
        foreignKeys = @ForeignKey(entity = Item.class, parentColumns = "id", childColumns = "itemId", onDelete = ForeignKey.CASCADE),
        indices = {@Index("itemId")})
public class Attribute {
    @PrimaryKey(autoGenerate = true)
    public long id;
    public long itemId;
    public String key;
    public String value;
}
