import type { NextPage } from "next";
import { useForm } from "@mantine/form";
import { Container } from "@mantine/core";
import { useStore } from "../store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Stack,
} from "@mantine/core";

const Auth: NextPage = (props: PaperProps) => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      password: (val: string | any[]) =>
        val.length <= 6 ? "Password should include at least 6 characters" : null,
    },
  });

  const { loginWithCreds, getToken, token } = useStore((state: any) => state.auth());
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token]);
  return (
    <Container size="xs">
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" weight={500}>
          Welcome to Iras Assistant, login with your IRAS credentials
        </Text>

        <form
          onSubmit={form.onSubmit((values: any) => {
            loginWithCreds(values);
            // router.push('/dashboard');
          })}
        >
          <Stack>
            <TextInput
              required
              label="ID Number"
              placeholder="2110182"
              value={form.values.email}
              onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
              error={form.errors.email && "Invalid email"}
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

          <Group position="apart" mt="xl">
            <Button type="submit">Login</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
