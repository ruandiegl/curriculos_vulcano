import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {
  Brand,
  Card,
  Field,
  Form,
  RegisterButton,
  ReturnButton,
  LoginIcon,
  Page,
  PhotoPanel,
} from './styles';

export default function Register() {
  const navigate = useNavigate();

  return (
    <Page>
      <Card>
        <Form>
          <Brand>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <p>Seja Bem vindo(a) a Plataforma de Recursos Humanos da Metalurgica Vulcano!</p>

          <Field>
            <span>Nome</span>
            <input type="text" placeholder="Nome" autoComplete="name" />
          </Field>

          <Field>
            <span>Email</span>
            <input type="email" placeholder="Email" autoComplete="email" />
          </Field>

          <Field>
            <span>Senha</span>
            <input type="password" placeholder="Senha" autoComplete="new-password" />
          </Field>

          <RegisterButton type="button">
            <LoginIcon aria-hidden="true">
              <span className="head" />
              <span className="body" />
              <span className="plus horizontal" />
              <span className="plus vertical" />
            </LoginIcon>
            Registrar
          </RegisterButton>

          <ReturnButton type="button" onClick={() => navigate('/')}>
            <LoginIcon aria-hidden="true">
              <span className="head" />
              <span className="body" />
            </LoginIcon>
            Ja tenho cadastro
          </ReturnButton>
        </Form>

        <PhotoPanel />
      </Card>
    </Page>
  );
}
