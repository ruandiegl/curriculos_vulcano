export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'API Curriculos Vulcano',
    version: '1.0.0',
    description: 'Documentacao da API de gerenciamento de curriculos, vagas e candidaturas.',
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Ambiente local',
    },
  ],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Usuarios' },
    { name: 'Curriculos' },
    { name: 'Vagas' },
    { name: 'Candidaturas' },
  ],
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica se a API esta online',
        security: [],
        responses: {
          200: {
            description: 'API online',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
        },
      },
    },
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Realiza login do usuario',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: {
            description: 'Credenciais invalidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/login/register': {
      post: {
        tags: ['Auth'],
        summary: 'Cria usuario com senha para autenticacao local',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuario criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterResponse' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          409: { $ref: '#/components/responses/ConflictError' },
        },
      },
    },
    '/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Lista usuarios',
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Busca por nome, email, CPF ou Firebase UID.',
          },
        ],
        responses: {
          200: {
            description: 'Lista paginada de usuarios',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedUsuarios' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Cria um usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UsuarioInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuario criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          409: { $ref: '#/components/responses/ConflictError' },
        },
      },
    },
    '/usuarios/{id}': {
      get: {
        tags: ['Usuarios'],
        summary: 'Busca um usuario por ID',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: {
            description: 'Usuario encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UsuarioDetalhado' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFoundError' },
        },
      },
      put: {
        tags: ['Usuarios'],
        summary: 'Atualiza um usuario',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UsuarioUpdate' },
            },
          },
        },
        responses: {
          200: {
            description: 'Usuario atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFoundError' },
          409: { $ref: '#/components/responses/ConflictError' },
        },
      },
      delete: {
        tags: ['Usuarios'],
        summary: 'Remove um usuario',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          204: { description: 'Usuario removido' },
          404: { $ref: '#/components/responses/NotFoundError' },
        },
      },
    },
    '/curriculos': {
      get: {
        tags: ['Curriculos'],
        summary: 'Lista e busca curriculos',
        description:
          'A busca percorre dados do curriculo e relacoes: usuario, enderecos, atuacoes, cursos, experiencias e escolaridades.',
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Termo geral de busca.',
          },
          {
            name: 'status',
            in: 'query',
            schema: { $ref: '#/components/schemas/CurriculoStatus' },
          },
          {
            name: 'cidade',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'estado',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'atuacao',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'cursoAtivo',
            in: 'query',
            schema: { type: 'boolean' },
          },
        ],
        responses: {
          200: {
            description: 'Lista paginada de curriculos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedCurriculos' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Curriculos'],
        summary: 'Cria um curriculo com relacoes',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CurriculoInput' },
              examples: {
                completo: {
                  value: {
                    usuarioId: '6e37e2fb-8e1b-4e83-bb0e-239c99f10d10',
                    nome: 'Joao da Silva',
                    cpf: '12345678900',
                    rg: '1234567',
                    nascimento: '1995-03-20',
                    estadoCivil: 'Solteiro',
                    email: 'joao@email.com',
                    celular: '19999999999',
                    possuiCnh: true,
                    categoriaCnh: 'B',
                    cursoAtivo: true,
                    status: 'visualizado',
                    enderecos: [
                      {
                        rua: 'Rua A',
                        numero: '123',
                        bairro: 'Centro',
                        cidade: 'Americana',
                        estado: 'SP',
                      },
                    ],
                    atuacoes: [
                      { nome: 'Soldador MIG/MAG', prioridade: 1 },
                      { nome: 'Caldeireiro', prioridade: 2 },
                    ],
                    cursos: [{ nome: 'NR-35', instituicao: 'SENAI' }],
                    experiencias: [{ empresa: 'Metalurgica Exemplo', cargo: 'Soldador' }],
                    escolaridades: [{ escola: 'Ensino Medio Completo' }],
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Curriculo criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Curriculo' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          409: { $ref: '#/components/responses/ConflictError' },
        },
      },
    },
    '/curriculos/{id}': {
      get: {
        tags: ['Curriculos'],
        summary: 'Busca um curriculo por ID',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: {
            description: 'Curriculo encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Curriculo' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFoundError' },
        },
      },
      put: {
        tags: ['Curriculos'],
        summary: 'Atualiza um curriculo',
        description:
          'Quando uma lista relacional for enviada, ela substitui os registros anteriores daquela relacao.',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CurriculoUpdate' },
            },
          },
        },
        responses: {
          200: {
            description: 'Curriculo atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Curriculo' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFoundError' },
          409: { $ref: '#/components/responses/ConflictError' },
        },
      },
      delete: {
        tags: ['Curriculos'],
        summary: 'Remove um curriculo',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          204: { description: 'Curriculo removido' },
          404: { $ref: '#/components/responses/NotFoundError' },
        },
      },
    },
    '/vagas': {
      get: {
        tags: ['Vagas'],
        summary: 'Lista vagas',
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'ativa',
            in: 'query',
            schema: { type: 'boolean' },
          },
        ],
        responses: {
          200: {
            description: 'Lista paginada de vagas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedVagas' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Vagas'],
        summary: 'Cria uma vaga',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VagaInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Vaga criada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vaga' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/vagas/{id}': {
      get: {
        tags: ['Vagas'],
        summary: 'Busca uma vaga por ID',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: {
            description: 'Vaga encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VagaDetalhada' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFoundError' },
        },
      },
      put: {
        tags: ['Vagas'],
        summary: 'Atualiza uma vaga',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VagaUpdate' },
            },
          },
        },
        responses: {
          200: {
            description: 'Vaga atualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vaga' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFoundError' },
        },
      },
      delete: {
        tags: ['Vagas'],
        summary: 'Remove uma vaga',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          204: { description: 'Vaga removida' },
          404: { $ref: '#/components/responses/NotFoundError' },
        },
      },
    },
    '/candidaturas': {
      get: {
        tags: ['Candidaturas'],
        summary: 'Lista candidaturas',
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' },
          {
            name: 'usuarioId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'vagaId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: {
            description: 'Lista paginada de candidaturas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedCandidaturas' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Candidaturas'],
        summary: 'Cria uma candidatura',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CandidaturaInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Candidatura criada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Candidatura' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          409: { $ref: '#/components/responses/ConflictError' },
        },
      },
    },
    '/candidaturas/{id}': {
      delete: {
        tags: ['Candidaturas'],
        summary: 'Remove uma candidatura',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          204: { description: 'Candidatura removida' },
          404: { $ref: '#/components/responses/NotFoundError' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    parameters: {
      Id: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
      },
      Page: {
        name: 'page',
        in: 'query',
        schema: { type: 'integer', minimum: 1, default: 1 },
      },
      Limit: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      },
    },
    responses: {
      ValidationError: {
        description: 'Erro de validacao',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      ConflictError: {
        description: 'Registro duplicado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      NotFoundError: {
        description: 'Registro nao encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          total: { type: 'integer', example: 120 },
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          totalPages: { type: 'integer', example: 6 },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Dados invalidos.' },
          issues: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Invalid email' },
              },
            },
          },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@email.com' },
          password: { type: 'string', format: 'password', example: '123456' },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['nome', 'email', 'password'],
        properties: {
          nome: { type: 'string', example: 'Administrador' },
          email: { type: 'string', format: 'email', example: 'admin@email.com' },
          password: { type: 'string', format: 'password', example: '123456' },
          firebaseUid: {
            type: 'string',
            description: 'Opcional. Quando omitido, a API salva local:<email>.',
            example: 'local-admin',
          },
          cpf: { type: 'string', nullable: true, example: '12345678900' },
          tipo: { type: 'string', example: 'admin' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Login bem sucedido.' },
          user: { $ref: '#/components/schemas/Usuario' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          usuario: {
            type: 'object',
            properties: {
              nome: { type: 'string', example: 'Administrador' },
              email: { type: 'string', format: 'email', example: 'admin@email.com' },
            },
          },
        },
      },
      CurriculoStatus: {
        type: 'string',
        enum: ['visualizado', 'entrevistado', 'selecionado', 'desconsiderado'],
      },
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          firebaseUid: { type: 'string' },
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          cpf: { type: 'string', nullable: true },
          tipo: { type: 'string', example: 'usuario' },
          possuiCurriculo: { type: 'boolean' },
          dataCheck: { type: 'string', format: 'date', nullable: true },
          horaCheck: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UsuarioInput: {
        type: 'object',
        required: ['firebaseUid', 'nome', 'email'],
        properties: {
          firebaseUid: { type: 'string', example: 'firebase_uid_123' },
          nome: { type: 'string', example: 'Maria Souza' },
          email: { type: 'string', format: 'email', example: 'maria@email.com' },
          cpf: { type: 'string', nullable: true, example: '12345678900' },
          tipo: { type: 'string', example: 'usuario' },
          possuiCurriculo: { type: 'boolean', example: false },
          dataCheck: { type: 'string', format: 'date', nullable: true },
          horaCheck: { type: 'string', nullable: true, example: '14:30:00' },
        },
      },
      UsuarioUpdate: {
        allOf: [{ $ref: '#/components/schemas/UsuarioInput' }],
      },
      UsuarioDetalhado: {
        allOf: [
          { $ref: '#/components/schemas/Usuario' },
          {
            type: 'object',
            properties: {
              curriculos: {
                type: 'array',
                items: { $ref: '#/components/schemas/CurriculoResumo' },
              },
            },
          },
        ],
      },
      Endereco: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          rua: { type: 'string', nullable: true },
          numero: { type: 'string', nullable: true },
          complemento: { type: 'string', nullable: true },
          bairro: { type: 'string', nullable: true },
          cidade: { type: 'string', nullable: true },
          estado: { type: 'string', nullable: true },
        },
      },
      EnderecoInput: {
        type: 'object',
        properties: {
          rua: { type: 'string', nullable: true },
          numero: { type: 'string', nullable: true },
          complemento: { type: 'string', nullable: true },
          bairro: { type: 'string', nullable: true },
          cidade: { type: 'string', nullable: true },
          estado: { type: 'string', nullable: true },
        },
      },
      Atuacao: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          prioridade: { type: 'integer', nullable: true },
        },
      },
      AtuacaoInput: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string', example: 'Soldador MIG/MAG' },
          prioridade: { type: 'integer', nullable: true, example: 1 },
        },
      },
      Curso: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          instituicao: { type: 'string', nullable: true },
        },
      },
      CursoInput: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string', example: 'NR-35' },
          instituicao: { type: 'string', nullable: true, example: 'SENAI' },
        },
      },
      Experiencia: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          empresa: { type: 'string' },
          cargo: { type: 'string', nullable: true },
        },
      },
      ExperienciaInput: {
        type: 'object',
        required: ['empresa'],
        properties: {
          empresa: { type: 'string', example: 'Metalurgica Exemplo' },
          cargo: { type: 'string', nullable: true, example: 'Soldador' },
        },
      },
      Escolaridade: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          escola: { type: 'string' },
        },
      },
      EscolaridadeInput: {
        type: 'object',
        required: ['escola'],
        properties: {
          escola: { type: 'string', example: 'Ensino Medio Completo' },
        },
      },
      CurriculoResumo: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          email: { type: 'string', nullable: true },
          cpf: { type: 'string', nullable: true },
          status: { $ref: '#/components/schemas/CurriculoStatus' },
        },
      },
      Curriculo: {
        allOf: [
          { $ref: '#/components/schemas/CurriculoResumo' },
          {
            type: 'object',
            properties: {
              usuarioId: { type: 'string', format: 'uuid', nullable: true },
              rg: { type: 'string', nullable: true },
              nascimento: { type: 'string', format: 'date', nullable: true },
              estadoCivil: { type: 'string', nullable: true },
              celular: { type: 'string', nullable: true },
              telefone: { type: 'string', nullable: true },
              possuiCnh: { type: 'boolean' },
              categoriaCnh: { type: 'string', nullable: true },
              numeroCnh: { type: 'string', nullable: true },
              vencimentoCnh: { type: 'string', format: 'date', nullable: true },
              cursoAtivo: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              usuario: { $ref: '#/components/schemas/Usuario' },
              enderecos: {
                type: 'array',
                items: { $ref: '#/components/schemas/Endereco' },
              },
              atuacoes: {
                type: 'array',
                items: { $ref: '#/components/schemas/Atuacao' },
              },
              cursos: {
                type: 'array',
                items: { $ref: '#/components/schemas/Curso' },
              },
              experiencias: {
                type: 'array',
                items: { $ref: '#/components/schemas/Experiencia' },
              },
              escolaridades: {
                type: 'array',
                items: { $ref: '#/components/schemas/Escolaridade' },
              },
            },
          },
        ],
      },
      CurriculoInput: {
        type: 'object',
        required: ['nome'],
        properties: {
          usuarioId: { type: 'string', format: 'uuid', nullable: true },
          nome: { type: 'string', example: 'Joao da Silva' },
          cpf: { type: 'string', nullable: true },
          rg: { type: 'string', nullable: true },
          nascimento: { type: 'string', format: 'date', nullable: true },
          estadoCivil: { type: 'string', nullable: true },
          email: { type: 'string', format: 'email', nullable: true },
          celular: { type: 'string', nullable: true },
          telefone: { type: 'string', nullable: true },
          possuiCnh: { type: 'boolean' },
          categoriaCnh: { type: 'string', nullable: true },
          numeroCnh: { type: 'string', nullable: true },
          vencimentoCnh: { type: 'string', format: 'date', nullable: true },
          cursoAtivo: { type: 'boolean' },
          status: { $ref: '#/components/schemas/CurriculoStatus' },
          enderecos: {
            type: 'array',
            items: { $ref: '#/components/schemas/EnderecoInput' },
          },
          atuacoes: {
            type: 'array',
            items: { $ref: '#/components/schemas/AtuacaoInput' },
          },
          cursos: {
            type: 'array',
            items: { $ref: '#/components/schemas/CursoInput' },
          },
          experiencias: {
            type: 'array',
            items: { $ref: '#/components/schemas/ExperienciaInput' },
          },
          escolaridades: {
            type: 'array',
            items: { $ref: '#/components/schemas/EscolaridadeInput' },
          },
        },
      },
      CurriculoUpdate: {
        allOf: [{ $ref: '#/components/schemas/CurriculoInput' }],
      },
      Vaga: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          titulo: { type: 'string' },
          descricao: { type: 'string', nullable: true },
          cidade: { type: 'string', nullable: true },
          estado: { type: 'string', nullable: true },
          ativa: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      VagaInput: {
        type: 'object',
        required: ['titulo'],
        properties: {
          titulo: { type: 'string', example: 'Soldador MIG/MAG' },
          descricao: { type: 'string', nullable: true },
          cidade: { type: 'string', nullable: true, example: 'Americana' },
          estado: { type: 'string', nullable: true, example: 'SP' },
          ativa: { type: 'boolean', example: true },
        },
      },
      VagaUpdate: {
        allOf: [{ $ref: '#/components/schemas/VagaInput' }],
      },
      VagaDetalhada: {
        allOf: [
          { $ref: '#/components/schemas/Vaga' },
          {
            type: 'object',
            properties: {
              candidaturas: {
                type: 'array',
                items: { $ref: '#/components/schemas/Candidatura' },
              },
            },
          },
        ],
      },
      Candidatura: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          usuarioId: { type: 'string', format: 'uuid' },
          vagaId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          usuario: { $ref: '#/components/schemas/Usuario' },
          vaga: { $ref: '#/components/schemas/Vaga' },
        },
      },
      CandidaturaInput: {
        type: 'object',
        required: ['usuarioId', 'vagaId'],
        properties: {
          usuarioId: { type: 'string', format: 'uuid' },
          vagaId: { type: 'string', format: 'uuid' },
        },
      },
      PaginatedUsuarios: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Usuario' },
          },
          meta: { $ref: '#/components/schemas/PaginationMeta' },
        },
      },
      PaginatedCurriculos: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Curriculo' },
          },
          meta: { $ref: '#/components/schemas/PaginationMeta' },
        },
      },
      PaginatedVagas: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Vaga' },
          },
          meta: { $ref: '#/components/schemas/PaginationMeta' },
        },
      },
      PaginatedCandidaturas: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Candidatura' },
          },
          meta: { $ref: '#/components/schemas/PaginationMeta' },
        },
      },
    },
  },
};
