package com.wheelshare.cabbooking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rideId;

    // We can store just the ID or the relationship. Keeping relationship is better for JPA.
    // In .NET it had CustomerId and DriverId explicitly.
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    private Double sourceLat;
    private Double sourceLng;
    private String sourceAddress;

    private Double destinationLat;
    private Double destinationLng;
    private String destinationAddress;

    private Double distanceKm;
    private Double fare;
    private Double finalFare;

    @Column(length = 20, nullable = false)
    private String rideStatus; // REQUESTED, ACCEPTED, STARTED, COMPLETED, CANCELLED

    @Builder.Default
    private LocalDateTime requestedAt = LocalDateTime.now();
    
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;
}
