package com.openclassrooms.starterjwt.unit.security;

import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.http.HttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;

public class AuthEntryPointJwtTest {

    private final AuthEntryPointJwt authEntryPointJwt = new AuthEntryPointJwt();

    @Test
    void commence_shouldReturnUnauthorizedStatus() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServletPath("/api/test");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AuthenticationException authException = new AuthenticationException("Unauthorized") {};

        authEntryPointJwt.commence(request, response, authException);

        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Test
    void commence_shouldReturnJsonContentType() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        AuthenticationException authException = new AuthenticationException("Unauthorized") {};

        authEntryPointJwt.commence(request, response, authException);

        assertThat(response.getContentType()).isEqualTo("application/json");
    }

    @Test
    void commence_shouldReturnBodyWithErrorDetails() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServletPath("/api/test");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AuthenticationException authException = new AuthenticationException("Full authentication is required") {};

        authEntryPointJwt.commence(request, response, authException);

        String body = response.getContentAsString();
        assertThat(body).contains("Unauthorized");
        assertThat(body).contains("401");
        assertThat(body).contains("/api/test");
        assertThat(body).contains("Full authentication is required");
    }
}
