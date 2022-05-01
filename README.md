# Projeto Minigram (Clone do Instagram utilizando AdonisJS)

## Sobre

- Esse é meu primeiro projeto utilizando AdonisJS.
- Como é um clone do Instagram a interface e as funcionalidades são todas baseadas nele. Sendo elas:
    - Cadastro e edição de usuário;
    - Login e Logout;
    - Esqueci minha senha(O e-mail enviado expira em 30 minutos e só pode ser utilizado uma vez);
    - Confirmar e-mail(O e-mail enviado expira em 30 minutos e só pode ser utilizado uma vez);
    - Acessar perfil do usuário;
    - Seguir e deixar de seguir usuário;
    - Acessar os "seguidores" e "seguindo" do usuário;
    - Pesquisar usuário;
    - Criar e editar post(Foto com legenda);
    - Na página inicial você recebe recomendações de 6 usuários que não segue;
    - Dar like ou tirar like de post;
    - Listar todos os posts que você curtiu;
    - Criar categoria de salvar post;
    - Salvar post(Com ou sem categoria);
    - Listar todos os posts que você salvou(Ou por categoria).

## Preparação de ambiente

- Instale as dependências dos arquivos json.
- Crie um banco de dados e em seguida rode as migrations com o comando: node ace migration:run
- Para utilizar um servidor de teste do projeto é só usar o comando: node ace serve --watch
- Se quiser já ter dados em seu banco de dados, pode utilizar o comando: 
    - await UserFactory.with('posts', 5).createMany(15) 
    (Utilize em AuthController.loginShow, assim, quando entrar na primeira página do projeto ele já cadastrará. Mas lembre de retirar após a primeira utilização)