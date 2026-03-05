package com.wheelshare.cabbooking.dto;

import lombok.Data;

@Data
public class SavedRideDto {
    private String rideName = "";
    private String pickupAddress = "";
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String dropAddress = "";
    private Double dropLatitude;
    private Double dropLongitude;
}
