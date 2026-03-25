package com.openclassrooms.starterjwt.unit.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void testToDto() {
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .id(1L)
                .email("test@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("password")
                .admin(false)
                .createdAt(now)
                .updatedAt(now)
                .build();

        UserDto dto = userMapper.toDto(user);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getEmail()).isEqualTo("test@test.com");
        assertThat(dto.getFirstName()).isEqualTo("John");
        assertThat(dto.getLastName()).isEqualTo("Doe");
        assertThat(dto.isAdmin()).isFalse();
    }

    @Test
    void testToEntity() {
        LocalDateTime now = LocalDateTime.now();
        UserDto dto = new UserDto(1L, "test@test.com", "Doe", "John", false, "password", now, now);

        User user = userMapper.toEntity(dto);

        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getEmail()).isEqualTo("test@test.com");
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getLastName()).isEqualTo("Doe");
    }

    @Test
    void testToDtoList() {
        User u1 = User.builder().id(1L).email("a@a.com").firstName("A").lastName("A").password("p").admin(false).build();
        User u2 = User.builder().id(2L).email("b@b.com").firstName("B").lastName("B").password("p").admin(true).build();

        List<UserDto> dtos = userMapper.toDto(Arrays.asList(u1, u2));

        assertThat(dtos).hasSize(2);
        assertThat(dtos.get(0).getId()).isEqualTo(1L);
        assertThat(dtos.get(1).getId()).isEqualTo(2L);
    }

    @Test
    void testToEntityList() {
        UserDto dto1 = new UserDto(1L, "a@a.com", "A", "A", false, "p", null, null);
        UserDto dto2 = new UserDto(2L, "b@b.com", "B", "B", true, "p", null, null);

        List<User> users = userMapper.toEntity(Arrays.asList(dto1, dto2));

        assertThat(users).hasSize(2);
        assertThat(users.get(0).getId()).isEqualTo(1L);
        assertThat(users.get(1).getId()).isEqualTo(2L);
    }

    @Test
    void testToDtoNull() {
        assertThat(userMapper.toDto((User) null)).isNull();
    }

    @Test
    void testToEntityNull() {
        assertThat(userMapper.toEntity((UserDto) null)).isNull();
    }
}
