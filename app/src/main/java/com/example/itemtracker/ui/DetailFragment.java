package com.example.itemtracker.ui;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;
import com.example.itemtracker.R;
import com.example.itemtracker.db.AppDatabase;
import com.example.itemtracker.db.ItemFull;
import com.example.itemtracker.domain.Calculations;
import com.example.itemtracker.repo.ItemRepository;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class DetailFragment extends Fragment {
    public DetailFragment() { super(R.layout.fragment_detail); }
    private long itemId;
    @Override
    public void onCreate(Bundle b) {
        super.onCreate(b);
        Bundle args = getArguments();
        if (args != null) itemId = args.getLong("itemId", 0);
    }
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        ItemRepository repo = new ItemRepository(AppDatabase.get(requireContext()).itemDao());
        repo.item(itemId).observe(getViewLifecycleOwner(), f -> bind(view, f));
        view.findViewById(R.id.btn_retire).setOnClickListener(v -> {
            repo.retireItem(itemId, System.currentTimeMillis());
            NavHostFragment.findNavController(this).popBackStack();
        });
    }
    private void bind(View v, ItemFull f) {
        if (f == null) return;
        ((TextView) v.findViewById(R.id.d_name)).setText(f.item.name);
        ((TextView) v.findViewById(R.id.d_brand)).setText(f.item.brand);
        ((TextView) v.findViewById(R.id.d_category)).setText(f.item.category);
        ((TextView) v.findViewById(R.id.d_price)).setText("¥" + String.format(Locale.getDefault(), "%.2f", Calculations.totalCost(f)));
        ((TextView) v.findViewById(R.id.d_date)).setText(new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date(f.item.purchaseDate)));
        long days = Calculations.daysHeld(f.item, System.currentTimeMillis());
        ((TextView) v.findViewById(R.id.d_days)).setText(String.valueOf(days));
        double da = Calculations.dailyAvg(f, System.currentTimeMillis());
        ((TextView) v.findViewById(R.id.d_daily)).setText("¥" + String.format(Locale.getDefault(), "%.2f", da) + "/天");
        ((TextView) v.findViewById(R.id.d_note)).setText(f.item.note);
    }
}
