package com.openclassrooms.starterjwt.unit.payload;

import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtResponseTest {

    @Test
    void testConstructorAndGetters() {
        JwtResponse response = new JwtResponse("token123", 1L, "user@test.com", "John", "Doe", true);

        assertThat(response.getToken()).isEqualTo("token123");
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getUsername()).isEqualTo("user@test.com");
        assertThat(response.getFirstName()).isEqualTo("John");
        assertThat(response.getLastName()).isEqualTo("Doe");
        assertThat(response.getAdmin()).isTrue();
        assertThat(response.getType()).isEqualTo("Bearer");
    }

    @Test
    void testSetters() {
        JwtResponse response = new JwtResponse("token", 1L, "user@test.com", "John", "Doe", false);
        response.setToken("newToken");
        response.setId(2L);
        response.setUsername("other@test.com");
        response.setFirstName("Alice");
        response.setLastName("Smith");
        response.setAdmin(true);
        response.setType("Custom");

        assertThat(response.getToken()).isEqualTo("newToken");
        assertThat(response.getId()).isEqualTo(2L);
        assertThat(response.getUsername()).isEqualTo("other@test.com");
        assertThat(response.getFirstName()).isEqualTo("Alice");
        assertThat(response.getLastName()).isEqualTo("Smith");
        assertThat(response.getAdmin()).isTrue();
        assertThat(response.getType()).isEqualTo("Custom");
    }
}
