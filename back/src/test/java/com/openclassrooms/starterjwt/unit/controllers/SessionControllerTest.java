package com.openclassrooms.starterjwt.unit.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @InjectMocks
    private SessionController sessionController;

    private ObjectMapper objectMapper = new ObjectMapper();
    private Session session;
    private SessionDto sessionDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(sessionController).build();

        session = Session.builder()
                .id(1L)
                .name("Morning Yoga")
                .description("A relaxing yoga session")
                .date(new Date())
                .build();

        sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Morning Yoga");
        sessionDto.setDescription("A relaxing yoga session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
    }

    @Test
    void findById_shouldReturn200_whenSessionExists() throws Exception {
        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isOk());
    }

    @Test
    void findById_shouldReturn404_whenSessionNotFound() throws Exception {
        when(sessionService.getById(99L)).thenReturn(null);

        mockMvc.perform(get("/api/session/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void findById_shouldReturn400_whenIdIsNotANumber() throws Exception {
        mockMvc.perform(get("/api/session/abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void findAll_shouldReturn200WithList() throws Exception {
        List<Session> sessions = Arrays.asList(session);
        List<SessionDto> sessionDtos = Arrays.asList(sessionDto);
        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk());
    }

    @Test
    void create_shouldReturn200_whenValidRequest() throws Exception {
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk());
    }

    @Test
    void update_shouldReturn200_whenValidRequest() throws Exception {
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionService.update(eq(1L), any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(put("/api/session/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk());
    }

    @Test
    void update_shouldReturn400_whenIdIsNotANumber() throws Exception {
        mockMvc.perform(put("/api/session/abc")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void delete_shouldReturn200_whenSessionExists() throws Exception {
        when(sessionService.getById(1L)).thenReturn(session);

        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());

        verify(sessionService).delete(1L);
    }

    @Test
    void delete_shouldReturn404_whenSessionNotFound() throws Exception {
        when(sessionService.getById(99L)).thenReturn(null);

        mockMvc.perform(delete("/api/session/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturn400_whenIdIsNotANumber() throws Exception {
        mockMvc.perform(delete("/api/session/abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void participate_shouldReturn200_whenValid() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/1"))
                .andExpect(status().isOk());

        verify(sessionService).participate(1L, 1L);
    }

    @Test
    void participate_shouldReturn400_whenIdIsNotANumber() throws Exception {
        mockMvc.perform(post("/api/session/abc/participate/1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void participate_shouldReturn400_whenBadRequest() throws Exception {
        doThrow(new BadRequestException()).when(sessionService).participate(1L, 1L);

        mockMvc.perform(post("/api/session/1/participate/1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void noLongerParticipate_shouldReturn200_whenValid() throws Exception {
        mockMvc.perform(delete("/api/session/1/participate/1"))
                .andExpect(status().isOk());

        verify(sessionService).noLongerParticipate(1L, 1L);
    }

    @Test
    void noLongerParticipate_shouldReturn400_whenIdIsNotANumber() throws Exception {
        mockMvc.perform(delete("/api/session/abc/participate/1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void noLongerParticipate_shouldReturn400_whenBadRequest() throws Exception {
        doThrow(new BadRequestException()).when(sessionService).noLongerParticipate(1L, 1L);

        mockMvc.perform(delete("/api/session/1/participate/1"))
                .andExpect(status().isBadRequest());
    }
}
