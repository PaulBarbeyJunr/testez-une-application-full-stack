package com.openclassrooms.starterjwt.unit.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    void findAll_shouldReturnAllTeachers() {
        Teacher teacher1 = Teacher.builder().id(1L).firstName("John").lastName("Doe").build();
        Teacher teacher2 = Teacher.builder().id(2L).firstName("Jane").lastName("Smith").build();
        when(teacherRepository.findAll()).thenReturn(Arrays.asList(teacher1, teacher2));

        List<Teacher> result = teacherService.findAll();

        assertThat(result).hasSize(2);
        verify(teacherRepository).findAll();
    }

    @Test
    void findById_shouldReturnTeacher_whenExists() {
        Teacher teacher = Teacher.builder().id(1L).firstName("John").lastName("Doe").build();
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Teacher result = teacherService.findById(1L);

        assertThat(result).isEqualTo(teacher);
    }

    @Test
    void findById_shouldReturnNull_whenNotExists() {
        when(teacherRepository.findById(99L)).thenReturn(Optional.empty());

        Teacher result = teacherService.findById(99L);

        assertThat(result).isNull();
    }
}
