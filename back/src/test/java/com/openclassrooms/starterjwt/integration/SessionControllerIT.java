package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SessionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private Teacher teacher;
    private User regularUser;

    @BeforeEach
    void setUp() {
        sessionRepository.deleteAll();
        userRepository.deleteAll();
        teacherRepository.deleteAll();

        teacher = teacherRepository.save(
                Teacher.builder().firstName("John").lastName("Doe").build()
        );

        User adminUser = userRepository.save(
                User.builder()
                        .email("admin@test.com")
                        .firstName("Admin")
                        .lastName("User")
                        .password("encoded")
                        .admin(true)
                        .build()
        );

        regularUser = userRepository.save(
                User.builder()
                        .email("user@test.com")
                        .firstName("Regular")
                        .lastName("User")
                        .password("encoded")
                        .admin(false)
                        .build()
        );

        UserDetailsImpl adminDetails = UserDetailsImpl.builder()
                .id(adminUser.getId())
                .username(adminUser.getEmail())
                .firstName(adminUser.getFirstName())
                .lastName(adminUser.getLastName())
                .admin(adminUser.isAdmin())
                .password(adminUser.getPassword())
                .build();

        Authentication adminAuth = new UsernamePasswordAuthenticationToken(adminDetails, null, adminDetails.getAuthorities());
        adminToken = jwtUtils.generateJwtToken(adminAuth);
    }

    @Test
    void findAll_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/session")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void create_shouldReturn200_andPersistSession() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Morning Yoga");
        sessionDto.setDescription("A relaxing session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(teacher.getId());

        mockMvc.perform(post("/api/session")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Morning Yoga"));
    }

    @Test
    void findById_shouldReturn200_whenExists() throws Exception {
        Session session = sessionRepository.save(
                Session.builder()
                        .name("Evening Yoga")
                        .description("Relaxing")
                        .date(new Date())
                        .teacher(teacher)
                        .users(new ArrayList<>())
                        .build()
        );

        mockMvc.perform(get("/api/session/" + session.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Evening Yoga"));
    }

    @Test
    void findById_shouldReturn404_whenNotFound() throws Exception {
        mockMvc.perform(get("/api/session/9999")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_shouldReturn200_andUpdateSession() throws Exception {
        Session session = sessionRepository.save(
                Session.builder()
                        .name("Old Name")
                        .description("Old description")
                        .date(new Date())
                        .teacher(teacher)
                        .users(new ArrayList<>())
                        .build()
        );

        SessionDto updateDto = new SessionDto();
        updateDto.setName("New Name");
        updateDto.setDescription("New description");
        updateDto.setDate(new Date());
        updateDto.setTeacher_id(teacher.getId());

        mockMvc.perform(put("/api/session/" + session.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Name"));
    }

    @Test
    void delete_shouldReturn200_andRemoveSession() throws Exception {
        Session session = sessionRepository.save(
                Session.builder()
                        .name("To Delete")
                        .description("Will be deleted")
                        .date(new Date())
                        .teacher(teacher)
                        .users(new ArrayList<>())
                        .build()
        );

        mockMvc.perform(delete("/api/session/" + session.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void participate_shouldReturn200() throws Exception {
        Session session = sessionRepository.save(
                Session.builder()
                        .name("Yoga")
                        .description("Yoga session")
                        .date(new Date())
                        .teacher(teacher)
                        .users(new ArrayList<>())
                        .build()
        );

        mockMvc.perform(post("/api/session/" + session.getId() + "/participate/" + regularUser.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void noLongerParticipate_shouldReturn200() throws Exception {
        ArrayList<User> users = new ArrayList<>();
        users.add(regularUser);

        Session session = sessionRepository.save(
                Session.builder()
                        .name("Yoga")
                        .description("Yoga session")
                        .date(new Date())
                        .teacher(teacher)
                        .users(users)
                        .build()
        );

        mockMvc.perform(delete("/api/session/" + session.getId() + "/participate/" + regularUser.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }
}
