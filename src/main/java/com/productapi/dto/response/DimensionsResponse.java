package com.productapi.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

/**
 * DTO for Dimensions API responses.
 */
@Schema(description = "Product dimensions")
public class DimensionsResponse {

    @Schema(description = "Width in centimeters", example = "15.14")
    private BigDecimal width;

    @Schema(description = "Height in centimeters", example = "13.08")
    private BigDecimal height;

    @Schema(description = "Depth in centimeters", example = "22.99")
    private BigDecimal depth;

    // Constructors
    public DimensionsResponse() {}

    public DimensionsResponse(BigDecimal width, BigDecimal height, BigDecimal depth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    // Getters and Setters
    public BigDecimal getWidth() {
        return width;
    }

    public void setWidth(BigDecimal width) {
        this.width = width;
    }

    public BigDecimal getHeight() {
        return height;
    }

    public void setHeight(BigDecimal height) {
        this.height = height;
    }

    public BigDecimal getDepth() {
        return depth;
    }

    public void setDepth(BigDecimal depth) {
        this.depth = depth;
    }
}
