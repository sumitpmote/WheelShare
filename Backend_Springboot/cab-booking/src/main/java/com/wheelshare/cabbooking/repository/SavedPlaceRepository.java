package com.wheelshare.cabbooking.repository;

import com.wheelshare.cabbooking.entity.SavedPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedPlaceRepository extends JpaRepository<SavedPlace, Integer> {
    List<SavedPlace> findByUserId(Integer userId);
}
