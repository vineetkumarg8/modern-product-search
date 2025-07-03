package com.productapi.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Controller
public class RootController {

    @GetMapping("/test")
    @ResponseBody
    public String test() {
        return "✅ Backend is working! API endpoints: /api/v1/products, /api/v1/data, /api/v1/actuator/health";
    }

    @GetMapping("/")
    public ResponseEntity<String> index() {
        return serveIndexHtml();
    }

    @GetMapping(value = {
        "/search",
        "/search/**",
        "/products/**",
        "/categories/**",
        "/brands/**",
        "/about",
        "/contact",
        "/{path:[^\\.]*}"
    })
    public ResponseEntity<String> forward() {
        return serveIndexHtml();
    }

    private ResponseEntity<String> serveIndexHtml() {
        try {
            Resource indexResource = new ClassPathResource("static/index.html");
            if (indexResource.exists()) {
                String content = StreamUtils.copyToString(indexResource.getInputStream(), StandardCharsets.UTF_8);
                return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(content);
            }

            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body("<!DOCTYPE html><html><head><title>Modern Product Search</title><style>body{font-family:Arial,sans-serif;text-align:center;padding:50px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;min-height:100vh;margin:0}.container{max-width:600px;margin:0 auto;background:rgba(255,255,255,0.1);padding:40px;border-radius:15px}.btn{display:inline-block;padding:12px 24px;margin:10px;background:rgba(255,255,255,0.2);color:white;text-decoration:none;border-radius:8px;border:2px solid rgba(255,255,255,0.3);transition:all 0.3s ease}.btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}</style></head><body><div class='container'><h1>🚀 Modern Product Search</h1><p>Backend is running successfully!</p><div><a href='/test' class='btn'>🔧 Test Backend</a><a href='/api/v1/actuator/health' class='btn'>📊 Health Check</a><a href='/api/v1/products?size=5' class='btn'>📦 Test API</a></div><p style='margin-top:30px;opacity:0.8'>Frontend will load here once React build is ready</p></div></body></html>");

        } catch (IOException e) {
            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body("<!DOCTYPE html><html><head><title>Error</title></head><body style='font-family: Arial, sans-serif; text-align: center; padding: 50px;'><h1>❌ Error Loading Frontend</h1><p>Error: " + e.getMessage() + "</p><p><a href='/test'>Test Backend</a></p></body></html>");
        }
    }
}
