package com.productapi.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

/**
 * DTO for external API dimensions data.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalDimensions {

    @JsonProperty("width")
    private BigDecimal width;

    @JsonProperty("height")
    private BigDecimal height;

    @JsonProperty("depth")
    private BigDecimal depth;

    // Constructors
    public ExternalDimensions() {}

    public ExternalDimensions(BigDecimal width, BigDecimal height, BigDecimal depth) {
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
