package org.wisdom.WD01.Service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt.expiration}")
    private long expiration;

    // 🔑 Lấy từ application.properties
    @Value("${jwt.secret}")
    private String secretKey = "wisdom-secret-key-wisdom-secret-key";

    public String generateToken(UserDetails userDetails) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("role",
                userDetails.getAuthorities().iterator().next().getAuthority());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // ================== LẤY USERNAME ==================
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // ================== CHECK TOKEN ==================
    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // ================== CHECK HẾT HẠN ==================
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ================== LẤY EXPIRATION ==================
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // ================== LẤY CLAIM ==================
    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    // ================== PARSE TOKEN ==================
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ================== KEY ==================
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
}