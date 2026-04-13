export type Level = "Iniciante" | "Intermediário" | "Avançado";

export interface Lesson {
  order: number;
  title: string;
  duration: string; // e.g. "14min"
}

export interface Resource {
  label: string;
  url: string;
  type: "repo" | "doc" | "video" | "article";
}

export interface Course {
  slug: string;
  name: string;
  level: Level;
  posts: number;
  image: string;
  description: string;
  outcomes: string[]; // "ao concluir você saberá..."
  lessons: Lesson[];
  resources: Resource[];
  instructor: string;
  duration: string; // total
  enrolled: number;
}

export const courses: Course[] = [
  {
    slug: "python-aplicacoes-reais",
    name: "Python: Real Applications and Innovative Projects",
    level: "Intermediário",
    posts: 12,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=900&q=80",
    instructor: "Ana Beatriz Torres",
    duration: "8h 40min",
    enrolled: 3241,
    description:
      "Vá além do básico e construa soluções reais com Python. Este curso aborda automações, análise de dados, integração com APIs externas e criação de scripts prontos para produção — com foco em boas práticas e código limpo.",
    outcomes: [
      "Criar automações de tarefas repetitivas com scripts Python",
      "Consumir e integrar APIs REST em projetos reais",
      "Manipular dados com Pandas e gerar relatórios automatizados",
      "Estruturar projetos Python com boas práticas e versionamento",
      "Fazer deploy de scripts em servidores Linux",
    ],
    lessons: [
      { order: 1, title: "Ambiente profissional: pyenv, venv e pip", duration: "22min" },
      { order: 2, title: "Estrutura de projetos e boas práticas", duration: "18min" },
      { order: 3, title: "Manipulação avançada de arquivos e paths", duration: "25min" },
      { order: 4, title: "Consumindo APIs REST com requests e httpx", duration: "30min" },
      { order: 5, title: "Tratamento de erros e logging profissional", duration: "20min" },
      { order: 6, title: "Introdução ao Pandas: Series e DataFrames", duration: "35min" },
      { order: 7, title: "Limpeza e transformação de dados reais", duration: "40min" },
      { order: 8, title: "Geração de relatórios em Excel e PDF", duration: "28min" },
      { order: 9, title: "Automação com schedule e cron jobs", duration: "22min" },
      { order: 10, title: "Web scraping ético com BeautifulSoup", duration: "32min" },
      { order: 11, title: "Empacotando e distribuindo seu projeto", duration: "18min" },
      { order: 12, title: "Deploy em servidor Linux com systemd", duration: "25min" },
    ],
    resources: [
      { label: "Repositório do curso", url: "https://github.com/example/python-real", type: "repo" },
      { label: "Documentação oficial Python 3.12", url: "https://docs.python.org/3/", type: "doc" },
      { label: "Pandas User Guide", url: "https://pandas.pydata.org/docs/user_guide/", type: "doc" },
      { label: "Artigo: Boas práticas em projetos Python", url: "https://realpython.com/python-application-layouts/", type: "article" },
    ],
  },
  {
    slug: "react-do-zero",
    name: "React from Zero: Building Modern Interfaces",
    level: "Iniciante",
    posts: 10,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&q=80",
    instructor: "Carlos Mendes",
    duration: "6h 15min",
    enrolled: 5870,
    description:
      "Aprenda React do absoluto zero até criar interfaces modernas e reativas. O curso cobre componentes, estado, efeitos e integração com APIs — com projetos práticos em cada módulo.",
    outcomes: [
      "Entender o modelo mental de componentes e props",
      "Gerenciar estado local com useState e useReducer",
      "Sincronizar efeitos colaterais com useEffect",
      "Consumir APIs REST e exibir dados dinâmicos",
      "Estruturar uma aplicação React escalável",
    ],
    lessons: [
      { order: 1, title: "O que é React e por que ele existe", duration: "15min" },
      { order: 2, title: "JSX, componentes e props", duration: "28min" },
      { order: 3, title: "Estado com useState", duration: "32min" },
      { order: 4, title: "Listas, chaves e renderização condicional", duration: "22min" },
      { order: 5, title: "Formulários controlados", duration: "25min" },
      { order: 6, title: "useEffect e ciclo de vida", duration: "30min" },
      { order: 7, title: "Contexto global com useContext", duration: "28min" },
      { order: 8, title: "Fetch de dados e loading states", duration: "35min" },
      { order: 9, title: "Roteamento com React Router", duration: "22min" },
      { order: 10, title: "Projeto final: app de tarefas completo", duration: "48min" },
    ],
    resources: [
      { label: "Repositório do curso", url: "https://github.com/example/react-zero", type: "repo" },
      { label: "Documentação oficial React", url: "https://react.dev", type: "doc" },
      { label: "React Router Docs", url: "https://reactrouter.com/en/main", type: "doc" },
    ],
  },
  // os demais cursos seguem o mesmo padrão — adicione conforme necessário
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}