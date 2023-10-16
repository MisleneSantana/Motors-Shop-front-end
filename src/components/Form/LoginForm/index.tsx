import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { LoginFormSchema, TLoginFormSchema } from './LoginFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../Input';
import { AuthContext } from '../../../providers/Auth/AuthContext';
import { LoadingContext } from '../../../providers/Loading/LoadingContext';

export const LoginForm = () => {
  const route = useLocation();
  const location = `${route.pathname}`;

  const { login } = useContext(AuthContext);
  const { loading } = useContext(LoadingContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFormSchema>({ resolver: zodResolver(LoginFormSchema) });

  const submit: SubmitHandler<TLoginFormSchema> = (formData) => {
    login(formData);
  };
  if (location === '/login') {
    return (
      <form onSubmit={handleSubmit(submit)}>
        <h1>Login</h1>
        <Input
          id='login'
          type='email'
          disabled={loading}
          label='Email'
          placeholder='Digitar email'
          {...register('email')}
        />
        {errors ? <p>{errors.email?.message}</p> : null}
        <Input
          id='senha'
          type='password'
          label='Senha'
          placeholder='Digitar senha'
          {...register('password')}
        />
        {errors ? <p>{errors.password?.message}</p> : null}
        <button type='submit' disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    );
  }
  return null;
};
