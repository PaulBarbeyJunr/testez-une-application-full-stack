package com.openclassrooms.starterjwt.unit.payload;

import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MessageResponseTest {

    @Test
    void testConstructorAndGetter() {
        MessageResponse response = new MessageResponse("Hello World");
        assertThat(response.getMessage()).isEqualTo("Hello World");
    }

    @Test
    void testSetter() {
        MessageResponse response = new MessageResponse("initial");
        response.setMessage("updated");
        assertThat(response.getMessage()).isEqualTo("updated");
    }
}
