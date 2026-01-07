package com.example.itemtracker.ui;

import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.itemtracker.R;
import com.example.itemtracker.domain.Calculations;
import com.example.itemtracker.db.Item;
import com.example.itemtracker.db.ItemFull;
import com.example.itemtracker.db.ItemStatus;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class ItemAdapter extends RecyclerView.Adapter<ItemAdapter.VH> {
    public interface OnClick { void onItem(ItemFull item); }
    private final List<ItemFull> data = new ArrayList<>();
    private final OnClick onClick;
    public ItemAdapter(OnClick onClick) { this.onClick = onClick; }
    public void submit(List<ItemFull> list) {
        data.clear();
        if (list != null) data.addAll(list);
        notifyDataSetChanged();
    }
    static class VH extends RecyclerView.ViewHolder {
        RelativeLayout bg;
        ImageView icon;
        TextView name, price, daily, days, date;
        VH(View v) {
            super(v);
            bg = v.findViewById(R.id.bg);
            icon = v.findViewById(R.id.icon);
            name = v.findViewById(R.id.name);
            price = v.findViewById(R.id.price);
            daily = v.findViewById(R.id.daily);
            days = v.findViewById(R.id.days);
            date = v.findViewById(R.id.date);
        }
    }
    @NonNull @Override public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_row, parent, false);
        return new VH(v);
    }
    @Override public void onBindViewHolder(@NonNull VH h, int pos) {
        ItemFull f = data.get(pos);
        long now = System.currentTimeMillis();
        double tc = Calculations.totalCost(f);
        double da = Calculations.dailyAvg(f, now);
        long ds = Calculations.daysHeld(f.item, now);
        h.name.setText(f.item.name);
        h.price.setText("¥" + String.format(Locale.getDefault(), "%.2f", tc));
        h.daily.setText("¥" + String.format(Locale.getDefault(), "%.2f", da) + "/天");
        h.days.setText(ds + "天");
        h.date.setText(new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date(f.item.purchaseDate)));
        int[] colors = mapColors(f.item, da);
        GradientDrawable gd = new GradientDrawable(GradientDrawable.Orientation.LEFT_RIGHT, colors);
        gd.setCornerRadius(24f);
        h.bg.setBackground(gd);
        h.itemView.setOnClickListener(v -> onClick.onItem(f));
    }
    @Override public int getItemCount() { return data.size(); }
    private int[] mapColors(Item item, double dailyAvg) {
        if (item.status == ItemStatus.RETIRED) return new int[]{Color.parseColor("#BDBDBD"), Color.parseColor("#9E9E9E")};
        boolean premium = item.status == ItemStatus.OWNED_PREMIUM || dailyAvg >= 10.0 || item.purchasePrice >= 5000.0;
        if (premium) return new int[]{Color.parseColor("#D4AF37"), Color.parseColor("#C49000")};
        return new int[]{Color.parseColor("#4CAF50"), Color.parseColor("#2E7D32")};
    }
}
