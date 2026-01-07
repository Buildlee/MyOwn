package com.example.itemtracker.domain;

import com.example.itemtracker.db.ExtraCost;
import com.example.itemtracker.db.Item;
import com.example.itemtracker.db.ItemFull;
import com.example.itemtracker.db.ItemStatus;
import java.util.Collections;
import java.util.List;

public class Calculations {
    public static double totalCost(ItemFull f) {
        double s = f.item.purchasePrice;
        if (f.costs != null) for (ExtraCost c : f.costs) s += c.amount;
        return s;
    }
    public static long daysHeld(Item i, long now) {
        long end = i.status == ItemStatus.RETIRED && i.retireDate != null ? i.retireDate : now;
        long d = (end - i.purchaseDate) / (1000L * 60L * 60L * 24L);
        return Math.max(d, 1L);
    }
    public static double dailyAvg(ItemFull f, long now) {
        return totalCost(f) / daysHeld(f.item, now);
    }
    public static Summary buildSummary(List<ItemFull> list, long now) {
        if (list == null) list = Collections.emptyList();
        Summary s = new Summary();
        double sumDaily = 0.0;
        double max = Double.MIN_VALUE;
        double min = Double.MAX_VALUE;
        double totalVal = 0.0;
        int cnt = 0;
        for (ItemFull f : list) {
            if (f.item.status != ItemStatus.RETIRED) {
                double v = totalCost(f);
                double da = dailyAvg(f, now);
                totalVal += v;
                sumDaily += da;
                if (da > max) max = da;
                if (da < min) min = da;
                cnt++;
            }
        }
        s.totalValue = totalVal;
        s.totalCount = cnt;
        s.totalDailyAvg = cnt == 0 ? 0.0 : sumDaily;
        s.maxDailyAvg = cnt == 0 ? 0.0 : max;
        s.minDailyAvg = cnt == 0 ? 0.0 : min;
        return s;
    }
}
