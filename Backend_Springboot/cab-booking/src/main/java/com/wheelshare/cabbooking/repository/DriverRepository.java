package com.wheelshare.cabbooking.repository;

import com.wheelshare.cabbooking.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {
    // Basic CRUD is provided by JpaRepository
}
