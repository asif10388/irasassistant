"use client";

import { useForm } from "@mantine/form";
import { Container } from "@mantine/core";

import {
  Text,
  Stack,
  Paper,
  Group,
  Button,
  TextInput,
  PaperProps,
  PasswordInput,
} from "@mantine/core";

const LoginForm = (props: PaperProps) => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      password: (val: string) =>
        val.length <= 6 ? "Password should include at least 6 characters" : null,
    },
  });

  return (
    <Container size="xs">
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg">Welcome to Iras Assistant, login with your IRAS credentials</Text>

        <form>
          <Stack>
            <TextInput
              required
              label="ID Number"
              placeholder="2110182"
              value={form.values.email}
              error={form.errors.email && "Invalid email"}
              onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
              error={form.errors.password && "Password should include at least 6 characters"}
            />
          </Stack>

          <Group mt="xl">
            <Button type="submit">Login</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginForm;
