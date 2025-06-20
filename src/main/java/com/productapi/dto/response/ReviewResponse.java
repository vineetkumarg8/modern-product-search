package com.productapi.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

/**
 * DTO for Review API responses.
 */
@Schema(description = "Product review")
public class ReviewResponse {

    @Schema(description = "Review ID", example = "1")
    private Long id;

    @Schema(description = "Rating (1-5)", example = "4")
    private Integer rating;

    @Schema(description = "Review comment", example = "Great product!")
    private String comment;

    @Schema(description = "Review date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime reviewDate;

    @Schema(description = "Reviewer name", example = "John Doe")
    private String reviewerName;

    @Schema(description = "Reviewer email", example = "john.doe@example.com")
    private String reviewerEmail;

    // Constructors
    public ReviewResponse() {}

    public ReviewResponse(Long id, Integer rating, String comment, LocalDateTime reviewDate, String reviewerName, String reviewerEmail) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
        this.reviewerName = reviewerName;
        this.reviewerEmail = reviewerEmail;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public String getReviewerEmail() {
        return reviewerEmail;
    }

    public void setReviewerEmail(String reviewerEmail) {
        this.reviewerEmail = reviewerEmail;
    }
}
