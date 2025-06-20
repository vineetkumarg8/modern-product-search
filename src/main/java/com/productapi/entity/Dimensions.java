package com.productapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;

/**
 * Embeddable entity representing product dimensions.
 */
@Embeddable
public class Dimensions {

    @Column(name = "width", precision = 8, scale = 2)
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal width;

    @Column(name = "height", precision = 8, scale = 2)
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal height;

    @Column(name = "depth", precision = 8, scale = 2)
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal depth;

    // Constructors
    public Dimensions() {}

    public Dimensions(BigDecimal width, BigDecimal height, BigDecimal depth) {
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

    @Override
    public String toString() {
        return "Dimensions{" +
                "width=" + width +
                ", height=" + height +
                ", depth=" + depth +
                '}';
    }
}
