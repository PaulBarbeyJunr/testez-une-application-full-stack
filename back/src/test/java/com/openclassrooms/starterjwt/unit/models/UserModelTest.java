package com.openclassrooms.starterjwt.unit.models;

import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class UserModelTest {

    @Test
    void testBuilderAndGetters() {
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .id(1L)
                .email("test@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("password123")
                .admin(true)
                .createdAt(now)
                .updatedAt(now)
                .build();

        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getEmail()).isEqualTo("test@test.com");
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getLastName()).isEqualTo("Doe");
        assertThat(user.getPassword()).isEqualTo("password123");
        assertThat(user.isAdmin()).isTrue();
        assertThat(user.getCreatedAt()).isEqualTo(now);
        assertThat(user.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testRequiredArgsConstructor() {
        User user = new User("user@test.com", "Smith", "Alice", "pwd", false);
        assertThat(user.getEmail()).isEqualTo("user@test.com");
        assertThat(user.getLastName()).isEqualTo("Smith");
        assertThat(user.getFirstName()).isEqualTo("Alice");
        assertThat(user.getPassword()).isEqualTo("pwd");
        assertThat(user.isAdmin()).isFalse();
    }

    @Test
    void testChainedSetters() {
        User user = new User()
                .setId(2L)
                .setEmail("chain@test.com")
                .setFirstName("Bob")
                .setLastName("Brown")
                .setPassword("pass")
                .setAdmin(false);

        assertThat(user.getId()).isEqualTo(2L);
        assertThat(user.getEmail()).isEqualTo("chain@test.com");
    }

    @Test
    void testEqualsAndHashCode() {
        User u1 = User.builder().id(1L).email("a@a.com").firstName("A").lastName("A").password("p").admin(false).build();
        User u2 = User.builder().id(1L).email("b@b.com").firstName("B").lastName("B").password("p").admin(true).build();
        User u3 = User.builder().id(2L).email("a@a.com").firstName("A").lastName("A").password("p").admin(false).build();

        assertThat(u1).isEqualTo(u2);
        assertThat(u1).isNotEqualTo(u3);
        assertThat(u1.hashCode()).isEqualTo(u2.hashCode());
    }

    @Test
    void testToString() {
        User user = User.builder().id(1L).email("test@test.com").firstName("John").lastName("Doe").password("pwd").admin(false).build();
        assertThat(user.toString()).contains("test@test.com");
    }

    @Test
    void testNoArgsConstructor() {
        User user = new User();
        assertThat(user).isNotNull();
        assertThat(user.getId()).isNull();
    }
}
