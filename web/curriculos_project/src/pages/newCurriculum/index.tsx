import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {
  ActionButtons,
  Brand,
  Copyright,
  Field,
  Footer,
  FooterContent,
  Grid,
  Greeting,
  Header,
  HeaderContent,
  HeaderNav,
  Input,
  Label,
  LogoutButton,
  Main,
  NavLink,
  Page,
  RadioGroup,
  RadioLabel,
  Section,
  SectionTitle,
  Select,
  SubmitButton,
} from './styles';

const jobRoles = [
  'FISCAL',
  'FINANCEIRO',
  'SOLDADOR TIG',
  'SOLDADOR MIG/MAG',
  'MECÂNICO DE MANUTENÇÃO',
  'MECÂNICO DE MONTAGEM',
  'RECURSOS HUMANOS',
  'SEGURANÇA DO TRABALHO',
  'ELETRICISTA',
  'QUALIDADE',
  'CONTROLADORIA',
  'ENGENHARIA',
  'COMPRAS',
  'ALMOXARIFADO',
  'LOGÍSTICA',
  'LIMPEZA',
  'CONSTRUÇÃO CIVIL',
  'TRANSPORTE / MOTORISTA',
  'AJUDANTE',
  'ESMERILHADOR',
  'OPERADOR DE EMPILHADEIRA',
  'OPERADOR DE PONTE ROLANTE',
  'OPERADOR DE MANDRILHADORA',
  'PINTOR DE VEÍCULOS',
  'MAÇARIQUEIRO',
  'DESENHISTA PROJETISTA',
  'OPERADOR DE MÁQUINAS OPERATRIZES',
];

export default function NewCurriculum() {
  const navigate = useNavigate();
  const [possuiCNH, setPossuiCNH] = useState('Não');

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => {}}>Início</NavLink>
            <NavLink onClick={() => {}}>Vagas</NavLink>
            <LogoutButton>Sair</LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <Greeting>
          <p>Ruan, seja bem vindo(a) a central de Recursos Humanos do Grupo Metalúrgica Vulcano!</p>
          <p>Vamos precisar de suas informações - Preencha seus dados pessoais</p>
        </Greeting>

        <Section>
          <SectionTitle>Dados Pessoais</SectionTitle>
          <Grid>
            <Field>
              <Label>Nome Completo</Label>
              <Input type="text" placeholder="ruan diego dos santos" />
            </Field>
            <Field>
              <Label>Celular</Label>
              <Input type="text" placeholder="(24) 99999-9999" />
            </Field>
            <Field>
              <Label>Data de Nascimento</Label>
              <Input type="text" placeholder="03/11/2001" />
            </Field>

            <Field>
              <Label>Estado Civil</Label>
              <Select defaultValue="Solteiro">
                <option value="Solteiro">Solteiro</option>
                <option value="Casado">Casado</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Viúvo">Viúvo</option>
              </Select>
            </Field>
            <Field>
              <Label>RG</Label>
              <Input type="text" placeholder="00.000.000-0" />
            </Field>
            <Field>
              <Label>Telefone</Label>
              <Input type="text" placeholder="(24) 3333-33333" />
            </Field>

            <Field>
              <Label>CPF</Label>
              <Input type="text" placeholder="000.000.000-00" />
            </Field>
            <Field>
              <Label>Possui CNH?</Label>
              <RadioGroup>
                <RadioLabel>
                  <input
                    type="radio"
                    name="cnh"
                    value="Sim"
                    checked={possuiCNH === 'Sim'}
                    onChange={(e) => setPossuiCNH(e.target.value)}
                  />
                  Sim
                </RadioLabel>
                <RadioLabel>
                  <input
                    type="radio"
                    name="cnh"
                    value="Não"
                    checked={possuiCNH === 'Não'}
                    onChange={(e) => setPossuiCNH(e.target.value)}
                  />
                  Não
                </RadioLabel>
              </RadioGroup>
            </Field>
            <Field>
              <Label>Possui curso ativo de CBSP e HUET?</Label>
              <RadioGroup>
                <RadioLabel>
                  <input type="radio" name="cbsp" value="Sim" />
                  Sim
                </RadioLabel>
                <RadioLabel>
                  <input type="radio" name="cbsp" value="Não" defaultChecked />
                  Não
                </RadioLabel>
              </RadioGroup>
            </Field>

            <Field>
              <Label>Cargo/Área de Atuação desejado</Label>
              <Select defaultValue="ENGENHARIA">
                <option value="" disabled>Selecione</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Cargo/Área de Atuação secundário</Label>
              <Select defaultValue="">
                <option value="">Selecione</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Cargo/Área de Atuação terciário</Label>
              <Select defaultValue="">
                <option value="">Selecione</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </Field>

            {possuiCNH === 'Sim' && (
              <>
                <Field>
                  <Label>Número da CNH</Label>
                  <Input type="text" placeholder="00000000000000000000" />
                </Field>
                <Field>
                  <Label>Vencimento da CNH</Label>
                  <Input type="text" placeholder="25/11/2030" />
                </Field>
                <Field>
                  <Label>Categoria da CNH</Label>
                  <Select defaultValue="A">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="AB">AB</option>
                  </Select>
                </Field>
              </>
            )}
          </Grid>

          <ActionButtons>
            <SubmitButton type="button" onClick={() => navigate('/newAddress')}>
              Continuar
            </SubmitButton>
          </ActionButtons>
        </Section>
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2023 Multi Publicidade</Copyright>
        </FooterContent>
      </Footer>
    </Page>
  );
}
