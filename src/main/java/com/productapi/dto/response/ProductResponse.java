package com.productapi.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Product API responses.
 */
@Schema(description = "Product information")
public class ProductResponse {

    @Schema(description = "Internal product ID", example = "1")
    private Long id;

    @Schema(description = "External API product ID", example = "1")
    private Long externalId;

    @Schema(description = "Product title", example = "Essence Mascara Lash Princess")
    private String title;

    @Schema(description = "Product description")
    private String description;

    @Schema(description = "Product category", example = "beauty")
    private String category;

    @Schema(description = "Product price", example = "9.99")
    private BigDecimal price;

    @Schema(description = "Discount percentage", example = "10.48")
    private BigDecimal discountPercentage;

    @Schema(description = "Product rating", example = "4.5")
    private BigDecimal rating;

    @Schema(description = "Stock quantity", example = "99")
    private Integer stock;

    @Schema(description = "Product tags")
    private List<String> tags;

    @Schema(description = "Brand name", example = "Essence")
    private String brand;

    @Schema(description = "Product SKU", example = "BEA-ESS-ESS-001")
    private String sku;

    @Schema(description = "Product weight in grams", example = "4")
    private Integer weight;

    @Schema(description = "Product dimensions")
    private DimensionsResponse dimensions;

    @Schema(description = "Warranty information")
    private String warrantyInformation;

    @Schema(description = "Shipping information")
    private String shippingInformation;

    @Schema(description = "Availability status", example = "In Stock")
    private String availabilityStatus;

    @Schema(description = "Product reviews")
    private List<ReviewResponse> reviews;

    @Schema(description = "Return policy")
    private String returnPolicy;

    @Schema(description = "Minimum order quantity", example = "1")
    private Integer minimumOrderQuantity;

    @Schema(description = "Product metadata")
    private MetaResponse meta;

    @Schema(description = "Product images")
    private List<String> images;

    @Schema(description = "Product thumbnail image")
    private String thumbnail;

    @Schema(description = "Creation timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    // Constructors
    public ProductResponse() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getExternalId() {
        return externalId;
    }

    public void setExternalId(Long externalId) {
        this.externalId = externalId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(BigDecimal discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public DimensionsResponse getDimensions() {
        return dimensions;
    }

    public void setDimensions(DimensionsResponse dimensions) {
        this.dimensions = dimensions;
    }

    public String getWarrantyInformation() {
        return warrantyInformation;
    }

    public void setWarrantyInformation(String warrantyInformation) {
        this.warrantyInformation = warrantyInformation;
    }

    public String getShippingInformation() {
        return shippingInformation;
    }

    public void setShippingInformation(String shippingInformation) {
        this.shippingInformation = shippingInformation;
    }

    public String getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(String availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public List<ReviewResponse> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewResponse> reviews) {
        this.reviews = reviews;
    }

    public String getReturnPolicy() {
        return returnPolicy;
    }

    public void setReturnPolicy(String returnPolicy) {
        this.returnPolicy = returnPolicy;
    }

    public Integer getMinimumOrderQuantity() {
        return minimumOrderQuantity;
    }

    public void setMinimumOrderQuantity(Integer minimumOrderQuantity) {
        this.minimumOrderQuantity = minimumOrderQuantity;
    }

    public MetaResponse getMeta() {
        return meta;
    }

    public void setMeta(MetaResponse meta) {
        this.meta = meta;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

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
}
