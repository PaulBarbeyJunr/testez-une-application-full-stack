package com.openclassrooms.starterjwt.unit.dto;

import com.openclassrooms.starterjwt.dto.SessionDto;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SessionDtoTest {

    @Test
    void testNoArgsConstructor() {
        SessionDto dto = new SessionDto();
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isNull();
    }

    @Test
    void testAllArgsConstructor() {
        Date date = new Date();
        LocalDateTime now = LocalDateTime.now();
        List<Long> users = Arrays.asList(1L, 2L);

        SessionDto dto = new SessionDto(1L, "Yoga", date, 10L, "desc", users, now, now);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getName()).isEqualTo("Yoga");
        assertThat(dto.getDate()).isEqualTo(date);
        assertThat(dto.getTeacher_id()).isEqualTo(10L);
        assertThat(dto.getDescription()).isEqualTo("desc");
        assertThat(dto.getUsers()).isEqualTo(users);
        assertThat(dto.getCreatedAt()).isEqualTo(now);
        assertThat(dto.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testSettersAndGetters() {
        SessionDto dto = new SessionDto();
        Date date = new Date();
        dto.setId(2L);
        dto.setName("Pilates");
        dto.setDate(date);
        dto.setTeacher_id(5L);
        dto.setDescription("Pilates session");
        dto.setUsers(Arrays.asList(3L));

        assertThat(dto.getId()).isEqualTo(2L);
        assertThat(dto.getName()).isEqualTo("Pilates");
        assertThat(dto.getDate()).isEqualTo(date);
        assertThat(dto.getTeacher_id()).isEqualTo(5L);
        assertThat(dto.getDescription()).isEqualTo("Pilates session");
        assertThat(dto.getUsers()).containsExactly(3L);
    }

    @Test
    void testEqualsAndHashCode() {
        Date date = new Date();
        SessionDto dto1 = new SessionDto(1L, "Yoga", date, 1L, "desc", null, null, null);
        SessionDto dto2 = new SessionDto(1L, "Yoga", date, 1L, "desc", null, null, null);
        SessionDto dto3 = new SessionDto(2L, "Pilates", date, 1L, "desc", null, null, null);

        assertThat(dto1).isEqualTo(dto2);
        assertThat(dto1).isNotEqualTo(dto3);
        assertThat(dto1.hashCode()).isEqualTo(dto2.hashCode());
    }

    @Test
    void testToString() {
        SessionDto dto = new SessionDto();
        dto.setName("Yoga");
        assertThat(dto.toString()).contains("Yoga");
    }
}
