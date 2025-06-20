package com.productapi.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for external API response containing multiple products.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalProductResponse {

    @JsonProperty("products")
    private List<ExternalProduct> products;

    @JsonProperty("total")
    private Integer total;

    @JsonProperty("skip")
    private Integer skip;

    @JsonProperty("limit")
    private Integer limit;

    // Constructors
    public ExternalProductResponse() {}

    // Getters and Setters
    public List<ExternalProduct> getProducts() {
        return products;
    }

    public void setProducts(List<ExternalProduct> products) {
        this.products = products;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Integer getSkip() {
        return skip;
    }

    public void setSkip(Integer skip) {
        this.skip = skip;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    /**
     * DTO representing a single product from external API.
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ExternalProduct {

        @JsonProperty("id")
        private Long id;

        @JsonProperty("title")
        private String title;

        @JsonProperty("description")
        private String description;

        @JsonProperty("category")
        private String category;

        @JsonProperty("price")
        private BigDecimal price;

        @JsonProperty("discountPercentage")
        private BigDecimal discountPercentage;

        @JsonProperty("rating")
        private BigDecimal rating;

        @JsonProperty("stock")
        private Integer stock;

        @JsonProperty("tags")
        private List<String> tags;

        @JsonProperty("brand")
        private String brand;

        @JsonProperty("sku")
        private String sku;

        @JsonProperty("weight")
        private Integer weight;

        @JsonProperty("dimensions")
        private ExternalDimensions dimensions;

        @JsonProperty("warrantyInformation")
        private String warrantyInformation;

        @JsonProperty("shippingInformation")
        private String shippingInformation;

        @JsonProperty("availabilityStatus")
        private String availabilityStatus;

        @JsonProperty("reviews")
        private List<ExternalReview> reviews;

        @JsonProperty("returnPolicy")
        private String returnPolicy;

        @JsonProperty("minimumOrderQuantity")
        private Integer minimumOrderQuantity;

        @JsonProperty("meta")
        private ExternalMeta meta;

        @JsonProperty("images")
        private List<String> images;

        @JsonProperty("thumbnail")
        private String thumbnail;

        // Constructors
        public ExternalProduct() {}

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public ExternalDimensions getDimensions() {
            return dimensions;
        }

        public void setDimensions(ExternalDimensions dimensions) {
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

        public List<ExternalReview> getReviews() {
            return reviews;
        }

        public void setReviews(List<ExternalReview> reviews) {
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

        public ExternalMeta getMeta() {
            return meta;
        }

        public void setMeta(ExternalMeta meta) {
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
    }
}
