package com.productapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * Embeddable entity representing product metadata.
 */
@Embeddable
public class Meta {

    @Column(name = "meta_created_at")
    private LocalDateTime createdAt;

    @Column(name = "meta_updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "barcode", length = 50)
    @Size(max = 50)
    private String barcode;

    @Column(name = "qr_code", length = 500)
    @Size(max = 500)
    private String qrCode;

    // Constructors
    public Meta() {}

    public Meta(LocalDateTime createdAt, LocalDateTime updatedAt, String barcode, String qrCode) {
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.barcode = barcode;
        this.qrCode = qrCode;
    }

    // Getters and Setters
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    @Override
    public String toString() {
        return "Meta{" +
                "createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", barcode='" + barcode + '\'' +
                ", qrCode='" + qrCode + '\'' +
                '}';
    }
}
