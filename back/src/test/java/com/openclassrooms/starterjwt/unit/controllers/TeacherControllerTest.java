package com.openclassrooms.starterjwt.unit.controllers;

import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class TeacherControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    private Teacher teacher;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(teacherController).build();

        teacher = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .build();
    }

    @Test
    void findById_shouldReturn200_whenTeacherExists() throws Exception {
        when(teacherService.findById(1L)).thenReturn(teacher);

        mockMvc.perform(get("/api/teacher/1"))
                .andExpect(status().isOk());
    }

    @Test
    void findById_shouldReturn404_whenTeacherNotFound() throws Exception {
        when(teacherService.findById(99L)).thenReturn(null);

        mockMvc.perform(get("/api/teacher/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void findById_shouldReturn400_whenIdIsNotANumber() throws Exception {
        mockMvc.perform(get("/api/teacher/abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void findAll_shouldReturn200WithList() throws Exception {
        List<Teacher> teachers = Arrays.asList(teacher);
        when(teacherService.findAll()).thenReturn(teachers);

        mockMvc.perform(get("/api/teacher"))
                .andExpect(status().isOk());
    }
}
