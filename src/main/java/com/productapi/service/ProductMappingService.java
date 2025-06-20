package com.productapi.service;

import com.productapi.dto.external.ExternalProductResponse;
import com.productapi.dto.response.*;
import com.productapi.entity.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for mapping between external DTOs and internal entities/DTOs.
 */
@Service
public class ProductMappingService {

    /**
     * Map external product to internal product entity.
     *
     * @param externalProduct the external product DTO
     * @return the mapped product entity
     */
    public Product mapToEntity(ExternalProductResponse.ExternalProduct externalProduct) {
        if (externalProduct == null) {
            return null;
        }

        Product product = new Product();
        product.setExternalId(externalProduct.getId());
        product.setTitle(externalProduct.getTitle());
        product.setDescription(externalProduct.getDescription());
        product.setCategory(externalProduct.getCategory());
        product.setPrice(externalProduct.getPrice());
        product.setDiscountPercentage(externalProduct.getDiscountPercentage());
        product.setRating(externalProduct.getRating());
        product.setStock(externalProduct.getStock());
        product.setTags(externalProduct.getTags() != null ? new ArrayList<>(externalProduct.getTags()) : new ArrayList<>());
        product.setBrand(externalProduct.getBrand());
        product.setSku(externalProduct.getSku());
        product.setWeight(externalProduct.getWeight());
        product.setWarrantyInformation(externalProduct.getWarrantyInformation());
        product.setShippingInformation(externalProduct.getShippingInformation());
        product.setAvailabilityStatus(externalProduct.getAvailabilityStatus());
        product.setReturnPolicy(externalProduct.getReturnPolicy());
        product.setMinimumOrderQuantity(externalProduct.getMinimumOrderQuantity());
        product.setImages(externalProduct.getImages() != null ? new ArrayList<>(externalProduct.getImages()) : new ArrayList<>());
        product.setThumbnail(externalProduct.getThumbnail());

        // Map dimensions
        if (externalProduct.getDimensions() != null) {
            Dimensions dimensions = new Dimensions();
            dimensions.setWidth(externalProduct.getDimensions().getWidth());
            dimensions.setHeight(externalProduct.getDimensions().getHeight());
            dimensions.setDepth(externalProduct.getDimensions().getDepth());
            product.setDimensions(dimensions);
        }

        // Map meta
        if (externalProduct.getMeta() != null) {
            Meta meta = new Meta();
            meta.setCreatedAt(externalProduct.getMeta().getCreatedAt());
            meta.setUpdatedAt(externalProduct.getMeta().getUpdatedAt());
            meta.setBarcode(externalProduct.getMeta().getBarcode());
            meta.setQrCode(externalProduct.getMeta().getQrCode());
            product.setMeta(meta);
        }

        // Map reviews
        if (externalProduct.getReviews() != null) {
            List<Review> reviews = externalProduct.getReviews().stream()
                    .map(externalReview -> {
                        Review review = new Review();
                        review.setRating(externalReview.getRating());
                        review.setComment(externalReview.getComment());
                        review.setReviewDate(externalReview.getDate());
                        review.setReviewerName(externalReview.getReviewerName());
                        review.setReviewerEmail(externalReview.getReviewerEmail());
                        review.setProduct(product);
                        return review;
                    })
                    .collect(Collectors.toList());
            product.setReviews(reviews);
        }

        return product;
    }

    /**
     * Map product entity to response DTO.
     *
     * @param product the product entity
     * @return the mapped product response DTO
     */
    public ProductResponse mapToResponse(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setExternalId(product.getExternalId());
        response.setTitle(product.getTitle());
        response.setDescription(product.getDescription());
        response.setCategory(product.getCategory());
        response.setPrice(product.getPrice());
        response.setDiscountPercentage(product.getDiscountPercentage());
        response.setRating(product.getRating());
        response.setStock(product.getStock());
        response.setTags(product.getTags());
        response.setBrand(product.getBrand());
        response.setSku(product.getSku());
        response.setWeight(product.getWeight());
        response.setWarrantyInformation(product.getWarrantyInformation());
        response.setShippingInformation(product.getShippingInformation());
        response.setAvailabilityStatus(product.getAvailabilityStatus());
        response.setReturnPolicy(product.getReturnPolicy());
        response.setMinimumOrderQuantity(product.getMinimumOrderQuantity());
        response.setImages(product.getImages());
        response.setThumbnail(product.getThumbnail());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        // Map dimensions
        if (product.getDimensions() != null) {
            DimensionsResponse dimensionsResponse = new DimensionsResponse();
            dimensionsResponse.setWidth(product.getDimensions().getWidth());
            dimensionsResponse.setHeight(product.getDimensions().getHeight());
            dimensionsResponse.setDepth(product.getDimensions().getDepth());
            response.setDimensions(dimensionsResponse);
        }

        // Map meta
        if (product.getMeta() != null) {
            MetaResponse metaResponse = new MetaResponse();
            metaResponse.setCreatedAt(product.getMeta().getCreatedAt());
            metaResponse.setUpdatedAt(product.getMeta().getUpdatedAt());
            metaResponse.setBarcode(product.getMeta().getBarcode());
            metaResponse.setQrCode(product.getMeta().getQrCode());
            response.setMeta(metaResponse);
        }

        // Map reviews
        if (product.getReviews() != null) {
            List<ReviewResponse> reviewResponses = product.getReviews().stream()
                    .map(review -> {
                        ReviewResponse reviewResponse = new ReviewResponse();
                        reviewResponse.setId(review.getId());
                        reviewResponse.setRating(review.getRating());
                        reviewResponse.setComment(review.getComment());
                        reviewResponse.setReviewDate(review.getReviewDate());
                        reviewResponse.setReviewerName(review.getReviewerName());
                        reviewResponse.setReviewerEmail(review.getReviewerEmail());
                        return reviewResponse;
                    })
                    .collect(Collectors.toList());
            response.setReviews(reviewResponses);
        }

        return response;
    }

    /**
     * Map list of product entities to list of response DTOs.
     *
     * @param products the list of product entities
     * @return the list of mapped product response DTOs
     */
    public List<ProductResponse> mapToResponseList(List<Product> products) {
        if (products == null) {
            return new ArrayList<>();
        }

        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update existing product entity with data from external product.
     *
     * @param existingProduct the existing product entity
     * @param externalProduct the external product DTO with updated data
     * @return the updated product entity
     */
    public Product updateEntity(Product existingProduct, ExternalProductResponse.ExternalProduct externalProduct) {
        if (existingProduct == null || externalProduct == null) {
            return existingProduct;
        }

        // Update basic fields
        existingProduct.setTitle(externalProduct.getTitle());
        existingProduct.setDescription(externalProduct.getDescription());
        existingProduct.setCategory(externalProduct.getCategory());
        existingProduct.setPrice(externalProduct.getPrice());
        existingProduct.setDiscountPercentage(externalProduct.getDiscountPercentage());
        existingProduct.setRating(externalProduct.getRating());
        existingProduct.setStock(externalProduct.getStock());
        existingProduct.setTags(externalProduct.getTags() != null ? new ArrayList<>(externalProduct.getTags()) : new ArrayList<>());
        existingProduct.setBrand(externalProduct.getBrand());
        existingProduct.setWeight(externalProduct.getWeight());
        existingProduct.setWarrantyInformation(externalProduct.getWarrantyInformation());
        existingProduct.setShippingInformation(externalProduct.getShippingInformation());
        existingProduct.setAvailabilityStatus(externalProduct.getAvailabilityStatus());
        existingProduct.setReturnPolicy(externalProduct.getReturnPolicy());
        existingProduct.setMinimumOrderQuantity(externalProduct.getMinimumOrderQuantity());
        existingProduct.setImages(externalProduct.getImages() != null ? new ArrayList<>(externalProduct.getImages()) : new ArrayList<>());
        existingProduct.setThumbnail(externalProduct.getThumbnail());

        // Update dimensions
        if (externalProduct.getDimensions() != null) {
            if (existingProduct.getDimensions() == null) {
                existingProduct.setDimensions(new Dimensions());
            }
            existingProduct.getDimensions().setWidth(externalProduct.getDimensions().getWidth());
            existingProduct.getDimensions().setHeight(externalProduct.getDimensions().getHeight());
            existingProduct.getDimensions().setDepth(externalProduct.getDimensions().getDepth());
        }

        // Update meta
        if (externalProduct.getMeta() != null) {
            if (existingProduct.getMeta() == null) {
                existingProduct.setMeta(new Meta());
            }
            existingProduct.getMeta().setCreatedAt(externalProduct.getMeta().getCreatedAt());
            existingProduct.getMeta().setUpdatedAt(externalProduct.getMeta().getUpdatedAt());
            existingProduct.getMeta().setBarcode(externalProduct.getMeta().getBarcode());
            existingProduct.getMeta().setQrCode(externalProduct.getMeta().getQrCode());
        }

        // Clear existing reviews and add new ones
        existingProduct.getReviews().clear();
        if (externalProduct.getReviews() != null) {
            List<Review> reviews = externalProduct.getReviews().stream()
                    .map(externalReview -> {
                        Review review = new Review();
                        review.setRating(externalReview.getRating());
                        review.setComment(externalReview.getComment());
                        review.setReviewDate(externalReview.getDate());
                        review.setReviewerName(externalReview.getReviewerName());
                        review.setReviewerEmail(externalReview.getReviewerEmail());
                        review.setProduct(existingProduct);
                        return review;
                    })
                    .collect(Collectors.toList());
            existingProduct.getReviews().addAll(reviews);
        }

        return existingProduct;
    }
}
