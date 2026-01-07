package com.example.itemtracker.db;

import androidx.room.TypeConverter;

public class EnumConverters {
    @TypeConverter
    public static String toString(ItemStatus s) { return s == null ? null : s.name(); }
    @TypeConverter
    public static ItemStatus toStatus(String v) { return v == null ? null : ItemStatus.valueOf(v); }
}
