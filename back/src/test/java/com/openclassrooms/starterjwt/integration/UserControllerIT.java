package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private String userToken;
    private User user;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        user = userRepository.save(
                User.builder()
                        .email("user@test.com")
                        .firstName("John")
                        .lastName("Doe")
                        .password("encoded")
                        .admin(false)
                        .build()
        );

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(user.getId())
                .username(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .admin(user.isAdmin())
                .password(user.getPassword())
                .build();

        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        userToken = jwtUtils.generateJwtToken(auth);
    }

    @Test
    void findById_shouldReturn200_whenUserExists() throws Exception {
        mockMvc.perform(get("/api/user/" + user.getId())
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@test.com"));
    }

    @Test
    void findById_shouldReturn404_whenUserNotFound() throws Exception {
        mockMvc.perform(get("/api/user/9999")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturn200_whenDeletingOwnAccount() throws Exception {
        mockMvc.perform(delete("/api/user/" + user.getId())
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk());
    }

    @Test
    void delete_shouldReturn401_whenDeletingOtherAccount() throws Exception {
        User otherUser = userRepository.save(
                User.builder()
                        .email("other@test.com")
                        .firstName("Other")
                        .lastName("User")
                        .password("encoded")
                        .admin(false)
                        .build()
        );

        mockMvc.perform(delete("/api/user/" + otherUser.getId())
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void findById_shouldReturn401_whenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/user/" + user.getId()))
                .andExpect(status().isUnauthorized());
    }
}
