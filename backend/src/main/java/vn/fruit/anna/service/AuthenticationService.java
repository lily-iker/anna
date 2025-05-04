package vn.fruit.anna.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vn.fruit.anna.dto.request.SignInRequest;
import vn.fruit.anna.dto.response.TokenResponse;
import vn.fruit.anna.enums.TokenType;
import vn.fruit.anna.model.User;
import vn.fruit.anna.repository.UserRepository;

import java.util.Arrays;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public TokenResponse authenticate(SignInRequest request, HttpServletResponse response) {

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),
                request.getPassword()));

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + request.getEmail()));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setAttribute("SameSite", "Strict");
        accessTokenCookie.setMaxAge(10);

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setAttribute("SameSite", "Strict");
        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 14);

        // Add the cookies to the response
        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .build();
    }

    public TokenResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = "";
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            refreshToken = Arrays.stream(cookies)
                    .filter(cookie -> "refreshToken".equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse("");
        }

        if (refreshToken.isBlank()) {
            throw new RuntimeException("Token can not be blank");
        }

        final String email = jwtService.extractEmail(refreshToken, TokenType.REFRESH_TOKEN);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        if (!jwtService.isValidToken(refreshToken, TokenType.REFRESH_TOKEN, user)) {
            throw new RuntimeException("Invalid Token");
        }

        String accessToken = jwtService.generateAccessToken(user);

        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setAttribute("SameSite", "Strict");
        accessTokenCookie.setMaxAge(10);

        response.addCookie(accessTokenCookie);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .build();
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setMaxAge(0);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setAttribute("SameSite", "Strict");

        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setMaxAge(0);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setAttribute("SameSite", "Strict");

        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);
    }
}
