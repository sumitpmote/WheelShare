package com.wheelshare.cabbooking.dto;

import lombok.Data;

@Data
public class SavedPlaceDto {
    private String name = "";
    private String address = "";
    private Double latitude;
    private Double longitude;
    private String placeType = "CUSTOM";
}
