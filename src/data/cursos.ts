export interface Curso {
  id: string;
  slug: string;
  img: string;
  images?: string[];
  title: string;
  desc: string;
  descLong: string;
  lessons: string;
  duration: string;
  level: string;
  teacher: string;
  priceProfesional: string;
  priceEstudiante: string;
  offerPriceProfesional?: string;
  offerPriceEstudiante?: string;
  offerEndDate?: string;
  startDate: string;
  endDate: string;
  temas: { titulo: string; contenidos: string[] }[];
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
    priceProfesional: "$120",
    priceEstudiante: "$100",
    offerPriceProfesional: "$100",
    offerPriceEstudiante: "$100",
    offerEndDate: "2024-03-31",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    temas: [
      { titulo: "Modelado avanzado en BIM", contenidos: ["Domina modelado avanzado en BIM", "Gestiona proyectos colaborativos"] },
      { titulo: "Certificación y recursos", contenidos: ["Certificado profesional", "Acceso a recursos exclusivos"] }
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
    priceProfesional: "Gratis",
    priceEstudiante: "Gratis",
    offerPriceProfesional: "$50",
    offerPriceEstudiante: "$50",
    offerEndDate: "2024-04-15",
    startDate: "2024-03-01",
    endDate: "2024-04-15",
    temas: [
      { titulo: "Aprende Revit desde cero", contenidos: ["Aprende Revit desde cero", "Crea proyectos arquitectónicos reales"] },
      { titulo: "Descarga archivos de práctica", contenidos: ["Descarga archivos de práctica", "Certificado de finalización"] }
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
    priceProfesional: "$150",
    priceEstudiante: "$120",
    offerPriceProfesional: "$120",
    offerPriceEstudiante: "$120",
    offerEndDate: "2024-05-31",
    startDate: "2024-04-01",
    endDate: "2024-05-31",
    temas: [
      { titulo: "Especialización en BIM para ingeniería", contenidos: ["Especialización en BIM para ingeniería", "Optimiza procesos de diseño y construcción"] },
      { titulo: "Acceso a casos prácticos", contenidos: ["Acceso a casos prácticos", "Certificado profesional"] }
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
    priceProfesional: "$180",
    priceEstudiante: "$150",
    offerPriceProfesional: "$150",
    offerPriceEstudiante: "$150",
    offerEndDate: "2024-06-30",
    startDate: "2024-05-01",
    endDate: "2024-06-30",
    temas: [
      { titulo: "Domina los fundamentos de programación para BIM", contenidos: ["Domina los fundamentos de programación para BIM", "Crea automatizaciones personalizadas"] },
      { titulo: "Optimiza flujos de trabajo", contenidos: ["Optimiza flujos de trabajo", "Proyectos prácticos reales"] }
    ],
    categoria: "Tecnología",
  },
]; 