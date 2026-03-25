package com.openclassrooms.starterjwt.unit.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private Session session;
    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("user@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("password")
                .admin(false)
                .build();

        session = Session.builder()
                .id(1L)
                .name("Morning Yoga")
                .description("A relaxing yoga session")
                .users(new ArrayList<>())
                .build();
    }

    @Test
    void create_shouldSaveAndReturnSession() {
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.create(session);

        assertThat(result).isEqualTo(session);
        verify(sessionRepository).save(session);
    }

    @Test
    void delete_shouldCallDeleteById() {
        sessionService.delete(1L);

        verify(sessionRepository).deleteById(1L);
    }

    @Test
    void findAll_shouldReturnAllSessions() {
        List<Session> sessions = Arrays.asList(session);
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(session);
    }

    @Test
    void getById_shouldReturnSession_whenExists() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        Session result = sessionService.getById(1L);

        assertThat(result).isEqualTo(session);
    }

    @Test
    void getById_shouldReturnNull_whenNotExists() {
        when(sessionRepository.findById(99L)).thenReturn(Optional.empty());

        Session result = sessionService.getById(99L);

        assertThat(result).isNull();
    }

    @Test
    void update_shouldSetIdAndSave() {
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.update(1L, session);

        assertThat(result.getId()).isEqualTo(1L);
        verify(sessionRepository).save(session);
    }

    @Test
    void participate_shouldAddUser_whenSessionAndUserExist() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        sessionService.participate(1L, 1L);

        assertThat(session.getUsers()).contains(user);
        verify(sessionRepository).save(session);
    }

    @Test
    void participate_shouldThrowNotFoundException_whenSessionNotFound() {
        when(sessionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.participate(99L, 1L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void participate_shouldThrowNotFoundException_whenUserNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.participate(1L, 99L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void participate_shouldThrowBadRequestException_whenAlreadyParticipating() {
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> sessionService.participate(1L, 1L))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void noLongerParticipate_shouldRemoveUser_whenParticipating() {
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(1L, 1L);

        assertThat(session.getUsers()).doesNotContain(user);
        verify(sessionRepository).save(session);
    }

    @Test
    void noLongerParticipate_shouldThrowNotFoundException_whenSessionNotFound() {
        when(sessionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.noLongerParticipate(99L, 1L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void noLongerParticipate_shouldThrowBadRequestException_whenNotParticipating() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> sessionService.noLongerParticipate(1L, 1L))
                .isInstanceOf(BadRequestException.class);
    }
}
