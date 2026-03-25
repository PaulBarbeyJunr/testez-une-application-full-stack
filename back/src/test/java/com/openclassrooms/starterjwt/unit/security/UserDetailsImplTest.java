package com.openclassrooms.starterjwt.unit.security;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class UserDetailsImplTest {

    private UserDetailsImpl buildUser(Long id) {
        return UserDetailsImpl.builder()
                .id(id)
                .username("user@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("password")
                .admin(false)
                .build();
    }

    @Test
    void getAuthorities_shouldReturnEmptySet() {
        UserDetailsImpl user = buildUser(1L);
        assertThat(user.getAuthorities()).isEmpty();
    }

    @Test
    void isAccountNonExpired_shouldReturnTrue() {
        assertThat(buildUser(1L).isAccountNonExpired()).isTrue();
    }

    @Test
    void isAccountNonLocked_shouldReturnTrue() {
        assertThat(buildUser(1L).isAccountNonLocked()).isTrue();
    }

    @Test
    void isCredentialsNonExpired_shouldReturnTrue() {
        assertThat(buildUser(1L).isCredentialsNonExpired()).isTrue();
    }

    @Test
    void isEnabled_shouldReturnTrue() {
        assertThat(buildUser(1L).isEnabled()).isTrue();
    }

    @Test
    void equals_shouldReturnTrue_forSameId() {
        UserDetailsImpl user1 = buildUser(1L);
        UserDetailsImpl user2 = buildUser(1L);
        assertThat(user1).isEqualTo(user2);
    }

    @Test
    void equals_shouldReturnFalse_forDifferentId() {
        UserDetailsImpl user1 = buildUser(1L);
        UserDetailsImpl user2 = buildUser(2L);
        assertThat(user1).isNotEqualTo(user2);
    }

    @Test
    void equals_shouldReturnFalse_forNull() {
        assertThat(buildUser(1L)).isNotEqualTo(null);
    }

    @Test
    void equals_shouldReturnTrue_forSameObject() {
        UserDetailsImpl user = buildUser(1L);
        assertThat(user).isEqualTo(user);
    }
}
