package com.example.itemtracker.db;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

@Database(entities = {Item.class, ExtraCost.class, Attribute.class}, version = 1)
@TypeConverters(EnumConverters.class)
public abstract class AppDatabase extends RoomDatabase {
    public abstract ItemDao itemDao();
    private static volatile AppDatabase INSTANCE;
    public static AppDatabase get(Context ctx) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(ctx.getApplicationContext(), AppDatabase.class, "items.db")
                            .allowMainThreadQueries()
                            .addCallback(new RoomDatabase.Callback() {
                                @Override
                                public void onCreate(@androidx.annotation.NonNull androidx.sqlite.db.SupportSQLiteDatabase db) {
                                    super.onCreate(db);
                                    new Thread(() -> {
                                        ItemDao dao = INSTANCE.itemDao();
                                        Item i1 = new Item();
                                        i1.name = "Macbook Pro 14"; i1.brand = "Apple"; i1.category = "Laptop"; i1.purchasePrice = 14799.0; i1.purchaseDate = System.currentTimeMillis() - 792L*24L*60L*60L*1000L; i1.status = ItemStatus.OWNED_PREMIUM;
                                        long id1 = dao.insertItem(i1);

                                        Item i2 = new Item();
                                        i2.name = "Meizu 21 Note"; i2.brand = "Meizu"; i2.category = "Phone"; i2.purchasePrice = 2999.0; i2.purchaseDate = System.currentTimeMillis() - 367L*24L*60L*60L*1000L; i2.status = ItemStatus.OWNED_PREMIUM;
                                        long id2 = dao.insertItem(i2);

                                        Item i3 = new Item();
                                        i3.name = "电视(sony)"; i3.brand = "Sony"; i3.category = "TV"; i3.purchasePrice = 0.0; i3.purchaseDate = System.currentTimeMillis() - 114L*24L*60L*60L*1000L; i3.status = ItemStatus.OWNED_NORMAL;
                                        long id3 = dao.insertItem(i3);

                                        Item i4 = new Item();
                                        i4.name = "婴儿车(小)"; i4.brand = ""; i4.category = "Baby"; i4.purchasePrice = 0.0; i4.purchaseDate = System.currentTimeMillis() - 114L*24L*60L*60L*1000L; i4.status = ItemStatus.OWNED_NORMAL;
                                        long id4 = dao.insertItem(i4);

                                        Item i5 = new Item();
                                        i5.name = "华为 Nova12u"; i5.brand = "Huawei"; i5.category = "Phone"; i5.purchasePrice = 1150.0; i5.purchaseDate = System.currentTimeMillis() - 105L*24L*60L*60L*1000L; i5.status = ItemStatus.OWNED_NORMAL;
                                        long id5 = dao.insertItem(i5);
                                    }).start();
                                }
                            })
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}
