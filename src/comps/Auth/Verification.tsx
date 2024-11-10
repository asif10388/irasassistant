"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Paper, Text, Title, Button, Container, TextInput } from "@mantine/core";

import classes from "./Auth.module.css";
import { useForm } from "@mantine/form";
import { confirmSignUpWithEmail } from "lib/auth/cognito";
import axios from "axios";

export default function VerificationForm() {
  const router = useRouter();
  const search = useSearchParams();

  const form = useForm({
    initialValues: {
      confirmationCode: "",
      email: search.get("email") ?? "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      confirmationCode: (val) => (val.length <= 5 ? "Code should include at least 6 digits" : null),
    },
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/auth/confirm-user", {
        email: form.values.email,
        code: form.values.confirmationCode,
      });

      if (response.status === 200) router.push("/auth");
    } catch (error) {
      console.error("Error confirming user: ", error);
    }
  };

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} ta="center">
        We sent a verification code to {search.get("email") ?? "your email"}
      </Title>

      <Text c="dimmed" fz="sm" ta="center">
        Please enter the code below to confirm your account
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            placeholder="123456"
            label="Verification code"
            value={form.values.confirmationCode}
            error={form.errors.confirmationCode && "Code should include at least 6 digits"}
            onChange={(e) => form.setFieldValue("confirmationCode", e.currentTarget.value)}
          />

          <Button type="submit" mt="md" className={classes.control} fullWidth>
            Verify
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
