package com.openclassrooms.starterjwt.unit.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class SessionMapperTest {

    @Autowired
    private SessionMapper sessionMapper;

    @Test
    void testToDto() {
        Teacher teacher = Teacher.builder().id(1L).firstName("Jane").lastName("Doe").build();
        User user = User.builder().id(10L).email("u@u.com").firstName("U").lastName("U").password("p").admin(false).build();
        Session session = Session.builder()
                .id(1L)
                .name("Yoga")
                .date(new Date())
                .description("desc")
                .teacher(teacher)
                .users(Arrays.asList(user))
                .build();

        SessionDto dto = sessionMapper.toDto(session);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getName()).isEqualTo("Yoga");
        assertThat(dto.getTeacher_id()).isEqualTo(1L);
        assertThat(dto.getUsers()).containsExactly(10L);
    }

    @Test
    void testToDtoWithNullTeacherAndUsers() {
        Session session = Session.builder()
                .id(2L)
                .name("Pilates")
                .date(new Date())
                .description("desc")
                .teacher(null)
                .users(null)
                .build();

        SessionDto dto = sessionMapper.toDto(session);

        assertThat(dto.getId()).isEqualTo(2L);
        assertThat(dto.getTeacher_id()).isNull();
        assertThat(dto.getUsers()).isEmpty();
    }

    @Test
    void testToDtoList() {
        Session s1 = Session.builder().id(1L).name("Yoga").date(new Date()).description("d").build();
        Session s2 = Session.builder().id(2L).name("Pilates").date(new Date()).description("d").build();

        List<SessionDto> dtos = sessionMapper.toDto(Arrays.asList(s1, s2));

        assertThat(dtos).hasSize(2);
        assertThat(dtos.get(0).getId()).isEqualTo(1L);
        assertThat(dtos.get(1).getId()).isEqualTo(2L);
    }

    @Test
    void testToDtoNull() {
        assertThat(sessionMapper.toDto((Session) null)).isNull();
    }

    @Test
    void testToEntityNull() {
        assertThat(sessionMapper.toEntity((SessionDto) null)).isNull();
    }
}
