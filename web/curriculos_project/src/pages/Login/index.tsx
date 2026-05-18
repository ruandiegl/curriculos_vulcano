import logo from '../../assets/logo.png';
import {
  Brand,
  Card,
  Field,
  ForgotLink,
  Form,
  LoginButton,
  LoginIcon,
  Page,
  PhotoPanel,
  SignupText,
} from './styles';

export default function Login() {
  return (
    <Page>
      <Card>
        <Form>
          <Brand>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <h1>Faça seu Login</h1>

          <Field>
            <span>Email</span>
            <input type="email" placeholder="Email" autoComplete="email" />
          </Field>

          <Field>
            <span>Senha</span>
            <input type="password" placeholder="Senha" autoComplete="current-password" />
          </Field>

          <LoginButton type="button" >
            <LoginIcon aria-hidden="true">
              <span className="head" />
              <span className="body" />
              <span className="plus horizontal" />
              <span className="plus vertical" />
            </LoginIcon>
            Login
          </LoginButton>

          <ForgotLink href="#">Esqueci minha senha</ForgotLink>

          <SignupText>
            Não tem uma conta? <a href="/register">Cadastro</a>
          </SignupText>
        </Form>

        <PhotoPanel />
      </Card>
    </Page>
  );
}
