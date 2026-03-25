package com.openclassrooms.starterjwt.unit.dto;

import com.openclassrooms.starterjwt.dto.UserDto;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class UserDtoTest {

    @Test
    void testNoArgsConstructor() {
        UserDto dto = new UserDto();
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isNull();
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();
        UserDto dto = new UserDto(1L, "test@test.com", "Doe", "John", false, "password", now, now);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getEmail()).isEqualTo("test@test.com");
        assertThat(dto.getLastName()).isEqualTo("Doe");
        assertThat(dto.getFirstName()).isEqualTo("John");
        assertThat(dto.isAdmin()).isFalse();
        assertThat(dto.getPassword()).isEqualTo("password");
        assertThat(dto.getCreatedAt()).isEqualTo(now);
        assertThat(dto.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testSettersAndGetters() {
        UserDto dto = new UserDto();
        dto.setId(2L);
        dto.setEmail("user@test.com");
        dto.setLastName("Smith");
        dto.setFirstName("Alice");
        dto.setAdmin(true);
        dto.setPassword("pwd");

        assertThat(dto.getId()).isEqualTo(2L);
        assertThat(dto.getEmail()).isEqualTo("user@test.com");
        assertThat(dto.getLastName()).isEqualTo("Smith");
        assertThat(dto.getFirstName()).isEqualTo("Alice");
        assertThat(dto.isAdmin()).isTrue();
        assertThat(dto.getPassword()).isEqualTo("pwd");
    }

    @Test
    void testEqualsAndHashCode() {
        LocalDateTime now = LocalDateTime.now();
        UserDto dto1 = new UserDto(1L, "a@a.com", "Doe", "John", false, "pwd", now, now);
        UserDto dto2 = new UserDto(1L, "a@a.com", "Doe", "John", false, "pwd", now, now);
        UserDto dto3 = new UserDto(2L, "b@b.com", "Smith", "Alice", true, "pwd", now, now);

        assertThat(dto1).isEqualTo(dto2);
        assertThat(dto1).isNotEqualTo(dto3);
        assertThat(dto1.hashCode()).isEqualTo(dto2.hashCode());
    }

    @Test
    void testToString() {
        UserDto dto = new UserDto();
        dto.setEmail("test@test.com");
        assertThat(dto.toString()).contains("test@test.com");
    }
}
