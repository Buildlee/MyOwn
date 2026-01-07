package com.example.itemtracker.ui;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.fragment.NavHostFragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.itemtracker.R;
import com.example.itemtracker.db.AppDatabase;
import com.example.itemtracker.repo.ItemRepository;

public class ListFragment extends Fragment {
    public ListFragment() { super(R.layout.fragment_list); }
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        RecyclerView rv = view.findViewById(R.id.recycler);
        rv.setLayoutManager(new LinearLayoutManager(requireContext()));
        ItemAdapter adapter = new ItemAdapter(item -> {
            Bundle b = new Bundle();
            b.putLong("itemId", item.item.id);
            NavHostFragment.findNavController(this).navigate(R.id.action_list_to_detail, b);
        });
        rv.setAdapter(adapter);

        TextView tvTotal = view.findViewById(R.id.total_value);
        TextView tvDaily = view.findViewById(R.id.total_daily);
        TextView tvCount = view.findViewById(R.id.total_count);
        TextView tvMax = view.findViewById(R.id.max_daily);
        TextView tvMin = view.findViewById(R.id.min_daily);

        ItemRepository repo = new ItemRepository(AppDatabase.get(requireContext()).itemDao());
        ViewModelFactory factory = new ViewModelFactory(repo);
        ItemListViewModel vm = new ViewModelProvider(requireActivity(), factory).get(ItemListViewModel.class);
        vm.items.observe(getViewLifecycleOwner(), adapter::submit);
        vm.summary.observe(getViewLifecycleOwner(), s -> {
            tvTotal.setText("¥" + String.format("%.2f", s.totalValue));
            tvDaily.setText("¥" + String.format("%.2f", s.totalDailyAvg));
            tvCount.setText(String.valueOf(s.totalCount));
            tvMax.setText("¥" + String.format("%.2f", s.maxDailyAvg));
            tvMin.setText("¥" + String.format("%.2f", s.minDailyAvg));
        });

        view.findViewById(R.id.fab_add).setOnClickListener(v -> NavHostFragment.findNavController(this).navigate(R.id.action_list_to_add));
    }
}
