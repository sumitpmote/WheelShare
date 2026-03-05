package com.wheelshare.cabbooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "saved_places")
public class SavedPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer savedPlaceId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    private String rideName;

    // Pickup Location
    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;

    // Drop Location
    private String dropAddress;
    private Double dropLatitude;
    private Double dropLongitude;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Navigation property
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
}
