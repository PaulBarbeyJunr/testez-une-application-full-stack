package com.openclassrooms.starterjwt.unit.models;

import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class TeacherModelTest {

    @Test
    void testBuilderAndGetters() {
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName("Jane")
                .lastName("Doe")
                .createdAt(now)
                .updatedAt(now)
                .build();

        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getFirstName()).isEqualTo("Jane");
        assertThat(teacher.getLastName()).isEqualTo("Doe");
        assertThat(teacher.getCreatedAt()).isEqualTo(now);
        assertThat(teacher.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testChainedSetters() {
        Teacher teacher = new Teacher()
                .setId(2L)
                .setFirstName("Alice")
                .setLastName("Smith");

        assertThat(teacher.getId()).isEqualTo(2L);
        assertThat(teacher.getFirstName()).isEqualTo("Alice");
        assertThat(teacher.getLastName()).isEqualTo("Smith");
    }

    @Test
    void testEqualsAndHashCode() {
        Teacher t1 = Teacher.builder().id(1L).firstName("A").lastName("B").build();
        Teacher t2 = Teacher.builder().id(1L).firstName("C").lastName("D").build();
        Teacher t3 = Teacher.builder().id(2L).firstName("A").lastName("B").build();

        assertThat(t1).isEqualTo(t2);
        assertThat(t1).isNotEqualTo(t3);
        assertThat(t1.hashCode()).isEqualTo(t2.hashCode());
    }

    @Test
    void testToString() {
        Teacher teacher = Teacher.builder().id(1L).firstName("Jane").lastName("Doe").build();
        assertThat(teacher.toString()).contains("Jane");
    }

    @Test
    void testNoArgsConstructor() {
        Teacher teacher = new Teacher();
        assertThat(teacher).isNotNull();
        assertThat(teacher.getId()).isNull();
    }
}
