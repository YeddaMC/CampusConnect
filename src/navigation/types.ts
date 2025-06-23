// src/navigation/types.ts

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Perfil: undefined;  // <-- Adicionado para reconhecer a rota 'Perfil'
  MainTabs: undefined;
  AlterarSenha: undefined; // Se você tiver essa tela, adicione aqui também
  // outras rotas que seu app usar
};
