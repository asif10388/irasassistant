import type { NextPage } from 'next';
import { useForm } from '@mantine/form';
import { Container } from '@mantine/core';
import axios from 'axios';
import { useStore } from '../store';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Stack,
} from '@mantine/core';

const Auth: NextPage = (props: PaperProps) => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      password: (val) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
    },
  });

  const { token, setToken } = useStore((state: any) => state.auth());

  const loginWithId = async (values: { email: string; password: string }) => {
    const res = await axios.post(
      'https://iras.iub.edu.bd:8079//v2/account/token',
      {
        email: values.email,
        password: values.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    setToken(res.data.data[0].access_token);
  };
  return (
    <Container size='xs'>
      <Paper radius='md' p='xl' withBorder {...props}>
        <Text size='lg' weight={500}>
          Welcome to Iras Assistant, login with your IRAS credentials
        </Text>

        <form
          onSubmit={form.onSubmit((values) => {
            loginWithId(values);
          })}
        >
          <Stack>
            <TextInput
              required
              label='ID Number'
              placeholder='2110182'
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue('email', event.currentTarget.value)
              }
              error={form.errors.email && 'Invalid email'}
            />

            <PasswordInput
              required
              label='Password'
              placeholder='Your password'
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue('password', event.currentTarget.value)
              }
              error={
                form.errors.password &&
                'Password should include at least 6 characters'
              }
            />
          </Stack>

          <Group position='apart' mt='xl'>
            <Button type='submit'>Login</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
