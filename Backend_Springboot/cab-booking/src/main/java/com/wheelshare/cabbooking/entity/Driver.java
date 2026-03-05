package com.wheelshare.cabbooking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @Column(name = "driver_id")
    private Integer driverId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "driver_id")
    private User user;

    @Column(nullable = false, length = 50)
    private String licenseNumber;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "is_available")
    private Boolean isAvailable = false;

    @Column(name = "current_latitude")
    private Double currentLatitude;

    @Column(name = "current_longitude")
    private Double currentLongitude;
}
