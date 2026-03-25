package com.openclassrooms.starterjwt.unit.models;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SessionModelTest {

    @Test
    void testBuilderAndGetters() {
        Date date = new Date();
        Teacher teacher = Teacher.builder().id(1L).firstName("John").lastName("Doe").build();
        List<User> users = Arrays.asList(
                User.builder().id(1L).email("a@a.com").firstName("Alice").lastName("Smith").password("pwd").admin(false).build()
        );
        LocalDateTime now = LocalDateTime.now();

        Session session = Session.builder()
                .id(1L)
                .name("Yoga")
                .date(date)
                .description("A yoga session")
                .teacher(teacher)
                .users(users)
                .createdAt(now)
                .updatedAt(now)
                .build();

        assertThat(session.getId()).isEqualTo(1L);
        assertThat(session.getName()).isEqualTo("Yoga");
        assertThat(session.getDate()).isEqualTo(date);
        assertThat(session.getDescription()).isEqualTo("A yoga session");
        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getUsers()).isEqualTo(users);
        assertThat(session.getCreatedAt()).isEqualTo(now);
        assertThat(session.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testSetters() {
        Session session = new Session();
        Date date = new Date();
        session.setId(2L);
        session.setName("Pilates");
        session.setDate(date);
        session.setDescription("Pilates session");

        assertThat(session.getId()).isEqualTo(2L);
        assertThat(session.getName()).isEqualTo("Pilates");
        assertThat(session.getDate()).isEqualTo(date);
        assertThat(session.getDescription()).isEqualTo("Pilates session");
    }

    @Test
    void testChainedSetters() {
        Date date = new Date();
        Session session = new Session()
                .setId(3L)
                .setName("Flow")
                .setDate(date)
                .setDescription("Flow session");

        assertThat(session.getId()).isEqualTo(3L);
        assertThat(session.getName()).isEqualTo("Flow");
    }

    @Test
    void testEqualsAndHashCode() {
        Session s1 = Session.builder().id(1L).name("Yoga").build();
        Session s2 = Session.builder().id(1L).name("Pilates").build();
        Session s3 = Session.builder().id(2L).name("Yoga").build();

        assertThat(s1).isEqualTo(s2);
        assertThat(s1).isNotEqualTo(s3);
        assertThat(s1.hashCode()).isEqualTo(s2.hashCode());
    }

    @Test
    void testToString() {
        Session session = Session.builder().id(1L).name("Yoga").build();
        assertThat(session.toString()).contains("Yoga");
    }

    @Test
    void testNoArgsConstructor() {
        Session session = new Session();
        assertThat(session).isNotNull();
        assertThat(session.getId()).isNull();
    }
}
