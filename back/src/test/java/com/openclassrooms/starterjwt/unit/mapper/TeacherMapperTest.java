package com.openclassrooms.starterjwt.unit.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class TeacherMapperTest {

    @Autowired
    private TeacherMapper teacherMapper;

    @Test
    void testToDto() {
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName("Jane")
                .lastName("Doe")
                .createdAt(now)
                .updatedAt(now)
                .build();

        TeacherDto dto = teacherMapper.toDto(teacher);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getFirstName()).isEqualTo("Jane");
        assertThat(dto.getLastName()).isEqualTo("Doe");
        assertThat(dto.getCreatedAt()).isEqualTo(now);
        assertThat(dto.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testToEntity() {
        LocalDateTime now = LocalDateTime.now();
        TeacherDto dto = new TeacherDto(1L, "Doe", "Jane", now, now);

        Teacher teacher = teacherMapper.toEntity(dto);

        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getFirstName()).isEqualTo("Jane");
        assertThat(teacher.getLastName()).isEqualTo("Doe");
    }

    @Test
    void testToDtoList() {
        Teacher t1 = Teacher.builder().id(1L).firstName("Jane").lastName("Doe").build();
        Teacher t2 = Teacher.builder().id(2L).firstName("Alice").lastName("Smith").build();

        List<TeacherDto> dtos = teacherMapper.toDto(Arrays.asList(t1, t2));

        assertThat(dtos).hasSize(2);
        assertThat(dtos.get(0).getId()).isEqualTo(1L);
        assertThat(dtos.get(1).getId()).isEqualTo(2L);
    }

    @Test
    void testToEntityList() {
        TeacherDto dto1 = new TeacherDto(1L, "Doe", "Jane", null, null);
        TeacherDto dto2 = new TeacherDto(2L, "Smith", "Alice", null, null);

        List<Teacher> teachers = teacherMapper.toEntity(Arrays.asList(dto1, dto2));

        assertThat(teachers).hasSize(2);
        assertThat(teachers.get(0).getId()).isEqualTo(1L);
        assertThat(teachers.get(1).getId()).isEqualTo(2L);
    }

    @Test
    void testToDtoNull() {
        assertThat(teacherMapper.toDto((Teacher) null)).isNull();
    }

    @Test
    void testToEntityNull() {
        assertThat(teacherMapper.toEntity((TeacherDto) null)).isNull();
    }
}
