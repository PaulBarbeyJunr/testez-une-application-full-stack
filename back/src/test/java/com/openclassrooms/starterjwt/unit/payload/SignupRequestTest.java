package com.openclassrooms.starterjwt.unit.payload;

import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SignupRequestTest {

    @Test
    void testSettersAndGetters() {
        SignupRequest request = new SignupRequest();
        request.setEmail("user@test.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("password123");

        assertThat(request.getEmail()).isEqualTo("user@test.com");
        assertThat(request.getFirstName()).isEqualTo("John");
        assertThat(request.getLastName()).isEqualTo("Doe");
        assertThat(request.getPassword()).isEqualTo("password123");
    }

    @Test
    void testEqualsAndHashCode() {
        SignupRequest r1 = new SignupRequest();
        r1.setEmail("user@test.com");
        r1.setFirstName("John");
        r1.setLastName("Doe");
        r1.setPassword("password123");

        SignupRequest r2 = new SignupRequest();
        r2.setEmail("user@test.com");
        r2.setFirstName("John");
        r2.setLastName("Doe");
        r2.setPassword("password123");

        assertThat(r1).isEqualTo(r2);
        assertThat(r1.hashCode()).isEqualTo(r2.hashCode());
    }

    @Test
    void testToString() {
        SignupRequest request = new SignupRequest();
        request.setEmail("user@test.com");
        assertThat(request.toString()).contains("user@test.com");
    }
}
