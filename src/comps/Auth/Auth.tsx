"use client";

import { v4 as uuidv4 } from "uuid";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { GoogleButton } from "@assets/GoogleButton";
import { useToggle, upperFirst } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Text,
  Paper,
  Group,
  Stack,
  Button,
  Divider,
  Anchor,
  TextInput,
  Container,
  PaperProps,
  PasswordInput,
} from "@mantine/core";
import axios from "axios";

export default function AuthenticationForm(props: PaperProps) {
  const router = useRouter();
  const [type, toggle] = useToggle(["login", "register"]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) => (val.length <= 6 ? "Password should include at least 6 characters" : null),
      confirmPassword: (value, values) => {
        if (type === "register") {
          return value !== values.password ? "Passwords did not match" : null;
        }

        return null;
      },
    },
  });

  const handleSubmit = async () => {
    try {
      if (type === "register") {
        const res = await axios.post("/api/auth/register", {
          username: uuidv4(),
          email: form.values.email,
          password: form.values.password,
        });

        if (res.status === 200) router.push(`/auth/verification?email=${form.values.email}`);
      }

      const response = await axios.post("/api/auth/login", {
        email: form.values.email,
        password: form.values.password,
      });

      if (response.status === 200) router.push("/dashboard");
    } catch (error: any) {
      console.error("Error logging in: ", error);

      notifications.show({
        color: "red",
        title: "Error",
        message: error.response?.data.error || "Failed to login",
      });
    }
  };

  const redirectToGoogle = async () => {
    window.location.href = "/api/oauth/oauth-login?flow=register";
  };

  return (
    <Container size="xs">
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" fw={500}>
          Welcome to Mantine, {type} with
        </Text>

        <span onClick={redirectToGoogle}>
          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Google</GoogleButton>
          </Group>
        </span>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              radius="md"
              label="Email"
              value={form.values.email}
              placeholder="hello@mantine.dev"
              error={form.errors.email && "Invalid email"}
              onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
            />

            <PasswordInput
              required
              radius="md"
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
              error={form.errors.password && "Password should include at least 6 characters"}
            />

            {type === "register" && (
              <PasswordInput
                required
                radius="md"
                label="Confirm Password"
                placeholder="Your password"
                value={form.values.confirmPassword}
                error={form.errors.confirmPassword && "Passwords do not match"}
                onChange={(event) =>
                  form.setFieldValue("confirmPassword", event.currentTarget.value)
                }
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="sm">
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>

            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
