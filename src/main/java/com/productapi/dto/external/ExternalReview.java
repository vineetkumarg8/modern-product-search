package com.productapi.dto.external;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

/**
 * DTO for external API review data.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalReview {

    @JsonProperty("rating")
    private Integer rating;

    @JsonProperty("comment")
    private String comment;

    @JsonProperty("date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime date;

    @JsonProperty("reviewerName")
    private String reviewerName;

    @JsonProperty("reviewerEmail")
    private String reviewerEmail;

    // Constructors
    public ExternalReview() {}

    public ExternalReview(Integer rating, String comment, LocalDateTime date, String reviewerName, String reviewerEmail) {
        this.rating = rating;
        this.comment = comment;
        this.date = date;
        this.reviewerName = reviewerName;
        this.reviewerEmail = reviewerEmail;
    }

    // Getters and Setters
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

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
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
