package com.wheelshare.cabbooking.repository;

import com.wheelshare.cabbooking.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
}
