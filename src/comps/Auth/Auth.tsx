"use client";

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

  const redirectToGoogle = () => {
    const params = new URLSearchParams({
      scope: process.env.COGNITO_SCOPE || "",
      client_id: process.env.COGNITO_CLIENT_ID || "",
      redirect_uri: process.env.COGNITO_REDIRECT_URI || "",
      response_type: process.env.COGNITO_RESPONSE_TYPE || "",
    });

    const url = `${process.env.COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
    window.location.href = url;
  };

  const handleSubmit = async () => {
    try {
      if (type === "register") {
        const response = await axios.post("/api/auth/register", {
          email: form.values.email,
          password: form.values.password,
        });

        if (response.status === 200) {
          router.push(`/auth/verification?email=${form.values.email}`);
        }

        return;
      }

      const response = await axios.post("/api/auth/login", {
        email: form.values.email,
        password: form.values.password,
      });

      if (response.status === 200) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error logging in: ", error);

      notifications.show({
        color: "red",
        title: "Error",
        message: "Error logging in",
      });
    }
  };

  return (
    <Container size="xs">
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" fw={500}>
          Welcome to Mantine, {type} with
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl" onClick={redirectToGoogle}>
            Google
          </GoogleButton>
        </Group>

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
