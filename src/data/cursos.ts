export interface Curso {
  id: string;
  slug: string;
  img: string;
  title: string;
  desc: string;
  descLong: string;
  lessons: string;
  duration: string;
  level: string;
  teacher: string;
  price: string;
  benefits: string[];
  categoria: string;
  visible?: boolean;
}

export const cursos: Curso[] = [
  {
    id: "1",
    slug: "curso-bim-avanzado",
    img: "/curso1.jpg",
    title: "Curso BIM Avanzado",
    desc: "Aprende técnicas avanzadas de modelado y gestión BIM.",
    descLong: "Este curso avanzado de BIM te permitirá dominar técnicas de modelado, gestión de información y flujos de trabajo colaborativos. Ideal para profesionales que buscan llevar sus habilidades al siguiente nivel.",
    lessons: "8 lecciones",
    duration: "12h 30m",
    level: "Experto",
    teacher: "Ing. Laura Pérez",
    price: "$120",
    benefits: [
      "Domina modelado avanzado en BIM",
      "Gestiona proyectos colaborativos",
      "Certificado profesional",
      "Acceso a recursos exclusivos",
    ],
    categoria: "BIM",
  },
  {
    id: "2",
    slug: "revit-para-arquitectos",
    img: "/curso2.jpg",
    title: "Revit para Arquitectos",
    desc: "Domina Revit para el diseño arquitectónico profesional.",
    descLong: "Aprende a utilizar Revit desde cero para crear proyectos arquitectónicos completos, desde el modelado hasta la documentación y presentación.",
    lessons: "6 lecciones",
    duration: "9h 10m",
    level: "Intermedio",
    teacher: "Arq. Juan Gómez",
    price: "Gratis",
    benefits: [
      "Aprende Revit desde cero",
      "Crea proyectos arquitectónicos reales",
      "Descarga archivos de práctica",
      "Certificado de finalización",
    ],
    categoria: "Arquitectura",
  },
  {
    id: "3",
    slug: "bim-para-ingenieros",
    img: "/curso3.jpg",
    title: "BIM para Ingenieros",
    desc: "Especialízate en BIM para ingeniería estructural y MEP.",
    descLong: "Conviértete en un experto en la aplicación de BIM en proyectos de ingeniería estructural y MEP, optimizando procesos y resultados.",
    lessons: "10 lecciones",
    duration: "15h 00m",
    level: "Avanzado",
    teacher: "Ing. Sofía Ruiz",
    price: "$150",
    benefits: [
      "Especialización en BIM para ingeniería",
      "Optimiza procesos de diseño y construcción",
      "Acceso a casos prácticos",
      "Certificado profesional",
    ],
    categoria: "Ingeniería",
  },
  {
    id: "4",
    slug: "introduccion-programacion-bim",
    img: "/curso4.jpg",
    title: "Introducción a la Programación BIM",
    desc: "Aprende a crear scripts y automatizaciones para flujos de trabajo BIM.",
    descLong: "Este curso te introduce al mundo de la programación aplicada a BIM, permitiéndote crear scripts y automatizaciones que optimizarán tu flujo de trabajo. Ideal para profesionales que quieren aumentar su productividad.",
    lessons: "12 lecciones",
    duration: "18h 45m",
    level: "Intermedio",
    teacher: "Ing. Carlos Martínez",
    price: "$180",
    benefits: [
      "Domina los fundamentos de programación para BIM",
      "Crea automatizaciones personalizadas",
      "Optimiza flujos de trabajo",
      "Proyectos prácticos reales",
    ],
    categoria: "Tecnología",
  },
]; 