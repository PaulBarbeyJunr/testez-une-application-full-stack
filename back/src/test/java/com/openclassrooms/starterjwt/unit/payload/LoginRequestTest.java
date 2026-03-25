package com.openclassrooms.starterjwt.unit.payload;

import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LoginRequestTest {

    @Test
    void testSettersAndGetters() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password123");

        assertThat(request.getEmail()).isEqualTo("test@test.com");
        assertThat(request.getPassword()).isEqualTo("password123");
    }

    @Test
    void testDefaultValues() {
        LoginRequest request = new LoginRequest();
        assertThat(request.getEmail()).isNull();
        assertThat(request.getPassword()).isNull();
    }
}
