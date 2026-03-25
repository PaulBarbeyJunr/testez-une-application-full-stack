package com.openclassrooms.starterjwt.unit.dto;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class TeacherDtoTest {

    @Test
    void testNoArgsConstructor() {
        TeacherDto dto = new TeacherDto();
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isNull();
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();
        TeacherDto dto = new TeacherDto(1L, "Doe", "Jane", now, now);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getLastName()).isEqualTo("Doe");
        assertThat(dto.getFirstName()).isEqualTo("Jane");
        assertThat(dto.getCreatedAt()).isEqualTo(now);
        assertThat(dto.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testSettersAndGetters() {
        TeacherDto dto = new TeacherDto();
        dto.setId(2L);
        dto.setLastName("Smith");
        dto.setFirstName("Alice");

        assertThat(dto.getId()).isEqualTo(2L);
        assertThat(dto.getLastName()).isEqualTo("Smith");
        assertThat(dto.getFirstName()).isEqualTo("Alice");
    }

    @Test
    void testEqualsAndHashCode() {
        LocalDateTime now = LocalDateTime.now();
        TeacherDto dto1 = new TeacherDto(1L, "Doe", "Jane", now, now);
        TeacherDto dto2 = new TeacherDto(1L, "Doe", "Jane", now, now);
        TeacherDto dto3 = new TeacherDto(2L, "Smith", "Alice", now, now);

        assertThat(dto1).isEqualTo(dto2);
        assertThat(dto1).isNotEqualTo(dto3);
        assertThat(dto1.hashCode()).isEqualTo(dto2.hashCode());
    }

    @Test
    void testToString() {
        TeacherDto dto = new TeacherDto();
        dto.setFirstName("Jane");
        assertThat(dto.toString()).contains("Jane");
    }
}
