import { Article, RadarItem } from "@/types/article";

function body(...paragraphs: string[]) {
  return paragraphs;
}

export const featuredArticle: Article = {
  id: "infraestructura-europea-ia",
  title: "Europa quiere soberania en IA, pero la carrera real se gana en energia, chips y tiempo de inferencia",
  excerpt:
    "La discusion sobre modelos fundacionales ya no se decide solo en laboratorios: se decide en capacidad electrica, acceso a GPU y disciplina industrial.",
  category: "ia",
  author: "Marta Iriarte",
  readingTime: "8 min",
  publishedAt: "13 MAY 2026",
  accent: "from-cyan-400/30 via-sky-500/10 to-transparent",
  tag: "Analisis",
  deck:
    "La narrativa de soberania tecnologica suena politica, pero la diferencia competitiva inmediata sigue siendo material: potencia, suministro y capacidad de operar a escala.",
  body: body(
    "Durante anos, la conversacion sobre inteligencia artificial se concentro en el talento cientifico y en la calidad de los modelos. Esa fase sigue importando, pero ya no explica por si sola donde se produce la ventaja.",
    "Hoy la distancia entre actores no se mide solo en papers o demos. Se mide en acceso a hardware, contratos energeticos, pipelines de datos y capacidad de integrar inferencia en productos reales con costes sostenibles.",
    "Para Europa, el reto no es unicamente producir modelos competitivos. El reto es construir una cadena industrial suficientemente disciplinada como para convertir investigacion en despliegue, y despliegue en posicion estrategica.",
    "Eso obliga a mirar mas alla de la retorica sobre soberania. Un ecosistema con buenos investigadores, pero sin escala de compute, sin suministro estable y sin incentivos para desplegar, acaba dependiendo de infraestructura ajena aunque produzca conocimiento propio.",
    "La cuestion tambien es temporal. En IA aplicada, llegar tarde unos cuantos ciclos de producto implica perder datos de uso, confianza empresarial y espacio presupuestario. Recuperar ese retraso cuesta mucho mas que lanzar un buen prototipo.",
    "El mapa competitivo se esta desplazando hacia quienes consiguen reducir latencia, abaratar inferencia y convertir modelos en sistemas fiables dentro de sectores concretos como salud, energia, defensa o industria.",
    "Por eso la carrera de la IA no se gana solo entrenando mejor. Se gana orquestando mejor: red, chips, energia, software, regulacion y capacidad de absorcion del tejido empresarial.",
    "Europa todavia puede jugar un papel relevante, pero necesita menos simbolismo y mas continuidad industrial. Sin esa base, la conversacion sobre autonomia sera un eslogan elegante sobre una dependencia muy real."
  )
};

export const radarItems: RadarItem[] = [
  {
    title: "Una nueva familia de malware ataca entornos edge con credenciales expuestas",
    category: "Ciberseguridad",
    timestamp: "Hace 18 min"
  },
  {
    title: "La ESA adjudica una fase critica para remolcadores orbitales reutilizables",
    category: "Espacio",
    timestamp: "Hace 42 min"
  },
  {
    title: "Un laboratorio logra mayor estabilidad en tejidos impresos con vascularizacion funcional",
    category: "Biotech",
    timestamp: "Hace 1 h"
  },
  {
    title: "Los copilots empresariales pasan del hype al control de costes por tarea",
    category: "IA",
    timestamp: "Hace 2 h"
  }
];

export const categoryHighlights: Article[] = [
  {
    id: "gemelos-digitales-industria",
    title: "Por que los gemelos digitales vuelven a la agenda industrial",
    excerpt: "La madurez del dato operacional convierte una vieja promesa en una herramienta de margen.",
    category: "tecnologia",
    author: "Daniel Varo",
    readingTime: "5 min",
    publishedAt: "13 MAY 2026",
    accent: "from-sky-500/25 via-cyan-400/10 to-transparent",
    tag: "Contexto",
    deck:
      "La promesa ya no esta en la simulacion vistosa, sino en la reduccion del error operativo y del tiempo improductivo.",
    body: body(
      "Los gemelos digitales regresan al centro del debate industrial porque ahora existen mejores sensores, mas integracion de sistemas y una urgencia clara por ganar eficiencia.",
      "Lo relevante no es la visualizacion en si misma, sino la capacidad de conectar mantenimiento, logistica y consumo energetico en una sola lectura operacional.",
      "En ese contexto, el gemelo digital deja de ser una maqueta cara y se convierte en una herramienta de decision.",
      "Las plantas que los incorporan de forma madura no persiguen una replica perfecta de la realidad. Buscan un entorno suficientemente util para anticipar fallos, probar cambios de configuracion y medir impactos antes de intervenir sobre activos costosos.",
      "Ese salto coincide con una presion industrial mas severa: energia cara, cadenas de suministro menos estables y necesidad de aprovechar mejor cada hora de maquina.",
      "Tambien cambia el perfil del comprador. Ya no es solo un equipo de innovacion buscando pilotos, sino responsables de operacion y mantenimiento que exigen retorno medible.",
      "El problema es que muchas implementaciones siguen llegando con exceso de capa visual y poca disciplina de dato. Sin calidad en historicos, sin modelos operativos claros y sin criterios de actualizacion, el gemelo digital degenera en escaparate.",
      "Cuando esta bien resuelto, en cambio, se convierte en una interfaz de lectura industrial. No vende futuro: reduce incertidumbre."
    )
  },
  {
    id: "observatorios-clima",
    title: "La nueva generacion de observatorios climaticos ya no solo mide: predice cadenas de impacto",
    excerpt: "Mas resolucion implica mejores escenarios y tambien decisiones politicas mas auditables.",
    category: "ciencia",
    author: "Laura Nerin",
    readingTime: "6 min",
    publishedAt: "12 MAY 2026",
    accent: "from-emerald-400/20 via-cyan-400/10 to-transparent",
    tag: "Contexto",
    deck:
      "Mejorar la resolucion ya no solo perfecciona la observacion: altera la calidad de las decisiones aguas abajo.",
    body: body(
      "La nueva instrumentacion climatica incrementa el detalle de los datos y, con ello, la calidad de los modelos de impacto.",
      "Eso afecta tanto a politicas publicas como a seguros, cadenas de suministro y planes de mitigacion urbana.",
      "Cuando la medicion mejora, tambien cambia la exigencia sobre quienes deben actuar con esa evidencia.",
      "La diferencia no es solo cuantitativa. Un sistema capaz de leer mejor humedad del suelo, corrientes atmosfericas o dinamicas costeras cambia el tipo de preguntas que se pueden responder.",
      "Ya no basta con decir que un evento extremo es mas probable. Empieza a ser posible estimar como se transmite su impacto sobre redes electricas, cultivos, puertos, transporte o salud publica.",
      "Eso tiene un efecto politico importante: cuanto mas fina es la observacion, menos espacio queda para decisiones justificadas en vaguedad tecnica.",
      "Tambien cambia la economia del riesgo. Empresas, aseguradoras y administraciones pueden afinar mejor sus escenarios y, por tanto, reasignar capital de forma mas precisa.",
      "Los observatorios climaticos dejan de ser solo infraestructura cientifica. Se convierten en una capa de inteligencia para decidir que proteger, cuando invertir y donde aceptar vulnerabilidad."
    )
  },
  {
    id: "mini-reactores-datos",
    title: "Mini reactores y centros de datos: una alianza discutida que ya dejo de ser marginal",
    excerpt: "La IA reabre debates energeticos que hace cinco anos eran perifericos.",
    category: "ia",
    author: "Adrian Bosch",
    readingTime: "7 min",
    publishedAt: "12 MAY 2026",
    accent: "from-cyan-400/25 via-blue-500/10 to-transparent",
    tag: "Analisis",
    deck:
      "La economia computacional de la IA ha devuelto centralidad a preguntas que parecian ajenas al software.",
    body: body(
      "Los centros de datos orientados a IA han reactivado discusiones sobre generacion estable, redes y autonomia energetica.",
      "En ese marco, los mini reactores aparecen menos como curiosidad futurista y mas como respuesta a una tension estructural.",
      "La cuestion no es solo tecnica: tambien es regulatoria, financiera y territorial.",
      "A diferencia del viejo centro de datos orientado a web o enterprise, la infraestructura de IA exige densidad electrica muy superior y curvas de demanda menos faciles de absorber con el sistema actual.",
      "Eso ha devuelto atractivo a soluciones capaces de ofrecer suministro continuo y relativamente predecible cerca del punto de consumo.",
      "Los defensores de los pequeños reactores modulares argumentan que encajan bien con cargas intensivas y con horizontes de planificacion largos. Sus criticos recuerdan que plazos, coste de capital y permisos siguen siendo enormes.",
      "La discusion seria no es si la idea suena futurista, sino si existe una combinacion creible de seguridad, financiacion y regulacion que permita materializarla sin retrasos sistemicos.",
      "Lo importante es que el software vuelve a depender de infraestructura fisica visible. La IA, al crecer, ha devuelto el debate tecnologico al terreno de la energia."
    )
  },
  {
    id: "terapias-edicion",
    title: "Las terapias de edicion genetica se acercan al cuello de botella regulatorio",
    excerpt: "La ciencia avanza rapido, pero la validacion clinica sigue marcando el ritmo real.",
    category: "salud",
    author: "Nora Vidal",
    readingTime: "4 min",
    publishedAt: "11 MAY 2026",
    accent: "from-fuchsia-400/15 via-cyan-400/10 to-transparent",
    tag: "Seguimiento",
    deck:
      "El laboratorio acelera, pero la aprobacion clinica sigue siendo el filtro que define ganadores reales.",
    body: body(
      "La edicion genetica avanza con una velocidad cientifica notable, especialmente en precision y estabilidad.",
      "Sin embargo, la traslacion a terapias aprobadas depende de evidencia robusta, seguimiento prolongado y marcos regulatorios consistentes.",
      "La distancia entre descubrimiento y tratamiento sigue siendo, sobre todo, una distancia institucional.",
      "Muchas plataformas ya son capaces de editar con niveles de exactitud que hace pocos anos parecian inalcanzables. El problema es que la medicina no valida una promesa por elegancia experimental, sino por seguridad sostenida y beneficio reproducible.",
      "Eso obliga a ensayos largos, cohortes bien definidas y vigilancia posterior al tratamiento. Cada una de esas fases consume tiempo, capital y tolerancia regulatoria.",
      "El cuello de botella no debe leerse como un freno irracional. En terapias irreversibles o de efectos prolongados, la prudencia regulatoria es parte de la infraestructura de confianza del sector.",
      "La tension aparece cuando la velocidad del laboratorio genera expectativas de mercado que el proceso clinico no puede seguir sin comprometer calidad.",
      "La proxima ventaja no sera solo editar mejor genes, sino construir trayectorias clinicas y regulatorias que conviertan ese avance en medicina usable."
    )
  },
  {
    id: "estaciones-privadas",
    title: "La economia de las estaciones privadas entra en su fase de contratos concretos",
    excerpt: "Los anuncios grandilocuentes dejan paso a ventanas de lanzamiento, carga y retorno esperado.",
    category: "espacio",
    author: "Enzo Salas",
    readingTime: "5 min",
    publishedAt: "11 MAY 2026",
    accent: "from-indigo-400/20 via-cyan-400/10 to-transparent",
    tag: "Seguimiento",
    deck:
      "La economia espacial madura cuando abandona la retorica y empieza a firmar calendarios y contratos.",
    body: body(
      "El mercado de estaciones privadas entra en una fase menos especulativa y mas contractual.",
      "Eso implica discutir capacidades concretas: carga, tripulacion, servicios y continuidad operativa.",
      "La industria espacial comercial empieza a medirse con criterios mas cercanos a infraestructura que a marketing.",
      "Mientras la narrativa anterior se apoyaba en renders y promesas amplias, la etapa actual exige ventanas de lanzamiento, acuerdos de acceso y detalles operativos verificables.",
      "La viabilidad depende de algo menos espectacular pero mas decisivo: cuantas misiones puede soportar una estacion, con que margen, con que clientes y durante cuanto tiempo.",
      "Las agencias publicas siguen siendo anclas esenciales, pero el sector intenta construir demanda complementaria en investigacion, manufactura avanzada y servicios orbitales.",
      "Eso obliga a pasar de la imaginacion comercial a la disciplina de contrato. Cada retraso, cada sobrecoste y cada duda sobre mantenimiento pesa mucho mas cuando los compromisos ya estan firmados.",
      "La buena señal para el mercado es que la conversacion se ha vuelto concreta. La mala es que, justo por eso, ahora resulta mas facil distinguir entre proyecto serio y propaganda orbital."
    )
  },
  {
    id: "seguridad-modelos",
    title: "Blindar modelos abiertos ya es un problema de cadena de suministro",
    excerpt: "Pesos, datasets y plugins amplian la superficie de ataque mucho antes del despliegue.",
    category: "ciberseguridad",
    author: "Irene Marco",
    readingTime: "6 min",
    publishedAt: "10 MAY 2026",
    accent: "from-rose-400/20 via-cyan-400/10 to-transparent",
    tag: "Analisis",
    deck:
      "La seguridad de modelos abiertos ya depende tanto del ecosistema que los rodea como del modelo mismo.",
    body: body(
      "Datasets, checkpoints, dependencias y extensiones han ampliado la superficie de ataque alrededor de los modelos abiertos.",
      "Eso desplaza la conversacion desde el comportamiento del sistema hacia la integridad de la cadena de suministro.",
      "Asegurar IA abierta exige una disciplina operativa mas cercana a DevSecOps que a la investigacion academica.",
      "Un modelo puede estar razonablemente alineado y aun asi incorporarse a un entorno comprometido a traves de pesos manipulados, datasets contaminados o integraciones inseguras.",
      "Ese riesgo se agrava porque muchos equipos incorporan componentes abiertos con una velocidad propia del prototipado, no de sistemas criticos.",
      "La seguridad deja entonces de ser una revision final y pasa a ser una practica de trazabilidad: de donde viene un artefacto, quien lo mantuvo, como se verifico y que permisos adquiere al desplegarse.",
      "La cultura del open source sigue siendo una ventaja enorme para experimentar, pero necesita capas mas maduras de firma, auditoria y reputacion tecnica.",
      "En modelos abiertos, la pregunta correcta ya no es solo que puede hacer el sistema. Tambien es que puede introducir silenciosamente en tu stack."
    )
  }
];

export const opinionAndLabArticles: Article[] = [
  {
    id: "la-fatiga-de-las-demos",
    title: "La fatiga de las demos de IA revela un problema de criterio, no de producto",
    excerpt: "La industria no necesita mas promesas espectaculares. Necesita mejores preguntas sobre utilidad y coste.",
    category: "opinion",
    author: "Clara Mejia",
    readingTime: "4 min",
    publishedAt: "10 MAY 2026",
    accent: "from-amber-300/15 via-cyan-400/10 to-transparent",
    tag: "Analisis",
    deck:
      "El mercado empieza a castigar la espectacularidad cuando no viene acompanada de encaje operativo.",
    body: body(
      "La abundancia de demos ha saturado la capacidad de sorpresa del sector, pero no ha resuelto la evaluacion real de valor.",
      "Lo que falta no son mas interfaces brillantes, sino mejores marcos para medir impacto, dependencia y coste de mantenimiento.",
      "La madurez llega cuando el criterio supera al entusiasmo.",
      "Durante meses, bastaba con una interfaz fluida, una voz convincente o una escena bien ejecutada para capturar atencion. Eso funciono mientras el mercado premiaba el asombro por encima de la integracion.",
      "Ahora muchas organizaciones se enfrentan a la pregunta incomoda: una vez pasada la demo, que cambia realmente en productividad, riesgo, calidad o margen.",
      "La fatiga no indica que la IA se haya vaciado de valor. Indica que el publico profesional esta subiendo el liston y exigiendo pruebas mas cercanas a negocio que a escenario.",
      "En ese contexto, la mejor tecnologia no siempre sera la mas vistosa. Sera la que se incruste en procesos reales, con menos friccion, menos deuda operativa y mejor gobernanza.",
      "La epoca del aplauso facil termina. Y eso, para el sector, es una buena noticia."
    )
  },
  {
    id: "benchmark-agentes-redaccion",
    title: "Probamos agentes para redaccion asistida y el resultado fue menos autonomo de lo prometido",
    excerpt: "La automatizacion editorial funciona mejor como sistema supervisado que como sustitucion total del proceso.",
    category: "laboratorio",
    author: "Sergio Aranda",
    readingTime: "9 min",
    publishedAt: "09 MAY 2026",
    accent: "from-violet-300/15 via-cyan-400/10 to-transparent",
    tag: "Cobertura",
    deck:
      "La distancia entre agente convincente y flujo editorial confiable sigue siendo considerable.",
    body: body(
      "En pruebas de redaccion asistida, los agentes destacaron en tareas de apoyo como resumen, reescritura y estructuracion inicial.",
      "Su rendimiento cayo cuando la tarea requirio jerarquia informativa, precision terminologica y sensibilidad editorial.",
      "La conclusion es menos espectacular, pero mas util: los agentes ya suman valor, siempre que trabajen dentro de un sistema con supervision.",
      "Cuando se les pidio proponer enfoques de pieza, consolidar fuentes o extraer claves de documentos extensos, los resultados fueron competitivos y ahorraron tiempo real.",
      "Sin embargo, al delegar decisiones de portada, tono o evaluacion de relevancia, aparecieron errores de prioridad que un editor humano detecta casi de inmediato.",
      "Tambien se observan fragilidades al trabajar con informacion ambigua o tecnicamente delicada. El agente puede sonar seguro incluso cuando simplifica demasiado o mezcla niveles de certeza.",
      "Eso no invalida la herramienta. Al contrario: ayuda a ubicar su mejor uso dentro de un flujo editorial profesional, donde opera como acelerador y no como sustituto de criterio.",
      "El resultado final es menos cinematografico que la promesa comercial, pero mucho mas interesante: automatizar bien significa redisenar supervision, no eliminarla."
    )
  }
];

export const sectorArticles: Article[] = [
  {
    id: "agua-exoplaneta-habitable",
    title: "Vapor de agua en un exoplaneta pequeno reordena la lista de mundos a vigilar",
    excerpt: "La observacion no prueba vida, pero si altera de forma sustancial el mapa de objetivos prioritarios.",
    category: "espacio",
    author: "Lia Ortega",
    readingTime: "5 min",
    publishedAt: "08 MAY 2026",
    accent: "from-blue-400/25 via-indigo-500/10 to-transparent",
    tag: "Contexto",
    deck:
      "El hallazgo estrecha la lista de exoplanetas con condiciones relevantes para futuras campanas espectroscopicas.",
    body: body(
      "La deteccion de vapor de agua en la atmosfera del exoplaneta no equivale a confirmar condiciones de habitabilidad plena, pero si cambia la priorizacion cientifica.",
      "Los equipos de observacion ahora pueden concentrar tiempo de telescopio en un candidato con mejores probabilidades de ofrecer senales atmosfericas interpretables.",
      "La noticia importa menos por su componente simbolico y mas por su efecto en la asignacion de recursos de la astrofisica observacional.",
      "En la practica, cada hora de instrumentos avanzados es escasa y cara. Encontrar un objetivo que combine accesibilidad observacional y relevancia fisica modifica la agenda de programas enteros.",
      "El agua no funciona aqui como icono pop de vida alienigena, sino como indicador de procesos atmosfericos y quimicos que merecen seguimiento.",
      "Los proximos pasos seran comparar senales, descartar interpretaciones alternativas y medir mejor temperatura, composicion y comportamiento orbital.",
      "Como casi siempre en astronomia, la noticia no cierra una pregunta. Lo que hace es afinarla.",
      "Ese es precisamente el valor del hallazgo: vuelve mas concreta una busqueda que con demasiada frecuencia se cuenta de forma vaga."
    )
  },
  {
    id: "chip-fotonico-revoluciona-ia",
    title: "Lo que cambia un procesador fotonico de nueva generacion para la infraestructura de IA",
    excerpt: "La promesa de la fotonica no es magia computacional: es menos perdida energetica y mas ancho de banda.",
    category: "tecnologia",
    author: "Aitor Salcedo",
    readingTime: "7 min",
    publishedAt: "07 MAY 2026",
    accent: "from-cyan-300/20 via-sky-500/10 to-transparent",
    tag: "Contexto",
    deck:
      "La fotonica integrada vuelve a escena porque responde a uno de los cuellos de botella estructurales de la IA: mover datos sin disparar el coste energetico.",
    body: body(
      "En lugar de transportar informacion unicamente con electrones, los chips fotonicos aprovechan luz guiada para ciertas operaciones de comunicacion y computo.",
      "Eso reduce calor y latencia en escenarios concretos, especialmente cuando el movimiento de datos pesa tanto como el calculo mismo.",
      "La tecnologia aun no sustituye a la electronica convencional, pero si puede redefinir la arquitectura de aceleradores especializados.",
      "El interes actual no nace de una fascinacion nueva, sino de una necesidad antigua que se ha vuelto urgente: la IA mueve tal cantidad de datos que las interconexiones se han convertido en un cuello de botella energetico.",
      "La fotonica integrada promete aliviar parte de esa carga haciendo que determinadas rutas de transferencia sean mas eficientes y escalen mejor.",
      "Aun asi, conviene evitar el triunfalismo. Integrar componentes fotonicos en procesos industriales maduros, con costes razonables y tolerancias aceptables, sigue siendo dificil.",
      "La pregunta importante no es si el chip impresiona en laboratorio, sino donde obtiene ventaja clara frente a soluciones electronicas avanzadas.",
      "Si esa respuesta aparece en inferencia a gran escala o en interconexion entre aceleradores, la fotonica dejara de ser una promesa recurrente para convertirse en pieza de infraestructura."
    )
  },
  {
    id: "fusion-nuclear-22-minutos",
    title: "Un hito en la fusion nuclear: un plasma estable durante 1.066 segundos reaviva el debate",
    excerpt: "La duracion por si sola no resuelve la viabilidad comercial, pero si mejora la credibilidad del campo.",
    category: "ciencia",
    author: "Paula Ribes",
    readingTime: "6 min",
    publishedAt: "06 MAY 2026",
    accent: "from-orange-300/20 via-cyan-400/10 to-transparent",
    tag: "Seguimiento",
    deck:
      "La fusion avanza cuando acumula estabilidad reproducible, no solo cuando produce titulares espectaculares.",
    body: body(
      "Mantener un plasma estable durante 1.066 segundos no equivale a disponer de una central de fusion, pero si demuestra madurez creciente en el control del plasma.",
      "El sector necesita menos anuncios absolutos y mas hitos operativos que permitan valorar fiabilidad, coste y escalado.",
      "Cada mejora de estabilidad reduce incertidumbre y acerca el debate a la ingenieria, no solo a la promesa.",
      "La fusion ha vivido durante decadas atrapada entre logros cientificos reales y narrativas demasiado amplias sobre una energia infinita a la vuelta de la esquina.",
      "Por eso los avances relevantes son los que afinan variables concretas: estabilidad, contencion, repetibilidad y gestion de materiales.",
      "Sostener mejor el plasma permite estudiar con mayor precision los limites del sistema y las condiciones necesarias para operar con continuidad.",
      "Eso no resuelve automaticamente el balance energetico, la durabilidad de componentes ni el coste total de una planta comercial.",
      "Pero convierte la conversacion en algo mas serio. Y en fusion, hacerse mas serio ya es un progreso sustancial."
    )
  },
  {
    id: "terapia-genica-sin-cirugia",
    title: "La terapia genica que podria curar enfermedades hereditarias sin cirugia",
    excerpt: "La administracion menos invasiva amplia el potencial de adopcion, pero no elimina el reto de seguridad a largo plazo.",
    category: "salud",
    author: "Helena Costa",
    readingTime: "5 min",
    publishedAt: "05 MAY 2026",
    accent: "from-fuchsia-300/15 via-cyan-400/10 to-transparent",
    tag: "Seguimiento",
    deck:
      "La clave no es solo editar mejor, sino hacerlo con una logistica terapeutica compatible con hospitales reales.",
    body: body(
      "Las nuevas aproximaciones de terapia genica buscan evitar procedimientos complejos y reducir la carga para paciente y sistema sanitario.",
      "Eso mejora el potencial de escalado, aunque sigue exigiendo evidencia exhaustiva sobre efectos secundarios y durabilidad del tratamiento.",
      "La medicina de precision gana valor cuando sus beneficios pueden integrarse en circuitos asistenciales viables.",
      "Una terapia extraordinaria sobre el papel puede fracasar en adopcion si depende de cirugias complejas, infraestructuras escasas o procesos demasiado personalizados.",
      "Por eso la via de administracion importa tanto como la eficacia molecular. Hacer que un tratamiento sea menos invasivo tambien es una forma de innovacion clinica.",
      "No obstante, reducir complejidad operativa no elimina las preguntas centrales: como se distribuye la terapia, cuanto dura el efecto y que ocurre en el largo plazo.",
      "La historia de la biomedicina esta llena de soluciones elegantes que tropezaron en escalado, coste o seguridad posterior.",
      "La diferencia la marcara quien combine biologia de alta precision con una ruta clinica asumible para hospitales y sistemas publicos."
    )
  },
  {
    id: "rover-buscara-vida-marte-2026",
    title: "El rover Rosalind Franklin buscara vida en Marte a partir de 2028",
    excerpt: "La nueva mision europea se centra menos en el gesto simbolico y mas en la capacidad instrumental para leer sedimentos antiguos.",
    category: "espacio",
    author: "Eva Cifuentes",
    readingTime: "5 min",
    publishedAt: "04 MAY 2026",
    accent: "from-red-300/15 via-orange-300/10 to-transparent",
    tag: "Seguimiento",
    deck:
      "La posibilidad de detectar firmas biologicas depende tanto del sitio de aterrizaje como de la sensibilidad analitica embarcada.",
    body: body(
      "El rover de nueva generacion esta pensado para analizar sedimentos donde pudieron quedar rastros quimicos de actividad biologica pasada.",
      "La mision combina movilidad, perforacion y capacidad analitica para acotar mejor las hipotesis sobre habitabilidad marciana.",
      "Su relevancia sera tecnica: seleccionar bien donde mirar y con que instrumentos.",
      "Buscar vida en Marte ya no significa recorrer sin criterio un paisaje iconico. Significa elegir estratos, minerales y contextos geologicos donde la señal tenga mas posibilidades de conservarse.",
      "Eso convierte la cartografia previa, el modelado del terreno y la capacidad de muestreo en componentes tan importantes como el laboratorio embarcado.",
      "La mision tambien ilustra una madurez del campo: menos obsesion por la foto memorable y mas interes por el protocolo de deteccion.",
      "Cada dato que recoja servira no solo para responder preguntas sobre Marte, sino para perfeccionar como se diseña la busqueda de biofirmas en otros cuerpos del sistema solar.",
      "La exploracion planetaria avanza cuando convierte la imaginacion en metodo. Este rover pretende precisamente eso."
    )
  },
  {
    id: "pacientes-crispr-exito",
    title: "CRISPR ya sale del laboratorio: que cambia tras los primeros tratamientos aprobados",
    excerpt: "Los resultados son prometedores, pero la escalabilidad seguira dependiendo de coste, seguimiento y seleccion de casos.",
    category: "salud",
    author: "Mireia Valls",
    readingTime: "6 min",
    publishedAt: "03 MAY 2026",
    accent: "from-emerald-300/15 via-cyan-400/10 to-transparent",
    tag: "Seguimiento",
    deck:
      "La validacion clinica inicial abre una nueva etapa: traducir eficacia puntual en tratamiento accesible y sostenible.",
    body: body(
      "Los casos tratados con exito confirman que CRISPR puede producir beneficio tangible en contexto clinico, no solo en laboratorio.",
      "A partir de aqui, la discusion real se desplaza a manufactura, coste, control de efectos fuera de objetivo y seguimiento longitudinal.",
      "La madurez biotecnologica comienza cuando la promesa se somete a las restricciones del sistema sanitario.",
      "Cada paciente tratado con buenos resultados aporta algo mas que entusiasmo. Aporta una referencia concreta para discutir indicaciones, protocolos y limites.",
      "La dificultad viene despues: transformar un exito inicial en un tratamiento replicable, financiable y administrable fuera de entornos muy especializados.",
      "Eso exige estandarizar procesos, asegurar calidad y demostrar que el beneficio compensa complejidad y coste en poblaciones mas amplias.",
      "Tambien obliga a una conversacion etica y regulatoria mas adulta, porque la capacidad de intervenir geneticamente deja de ser experimental en sentido abstracto.",
      "CRISPR entra asi en una etapa decisiva: abandonar la condicion de avance espectacular para convertirse en medicina rutinaria donde realmente pueda."
    )
  },
  {
    id: "redes-electricas-centros-datos",
    title: "La red electrica que tendra que sostener el boom de los centros de datos",
    excerpt: "El debate sobre IA no puede separarse ya de subestaciones, almacenamiento y capacidad de interconexion.",
    category: "energia",
    author: "Ramon Tella",
    readingTime: "5 min",
    publishedAt: "02 MAY 2026",
    accent: "from-lime-300/15 via-cyan-400/10 to-transparent",
    tag: "Analisis",
    deck:
      "La expansion del compute necesita una conversacion mas seria sobre red, permisos y disponibilidad fisica de energia.",
    body: body(
      "Cada nueva ola de centros de datos intensivos en IA incrementa la presion sobre una infraestructura electrica ya tensionada.",
      "La competencia entre industria, movilidad electrica y compute obliga a priorizar inversiones de red y almacenamiento.",
      "Hablar de IA a escala sin hablar de electrones es una simplificacion cada vez menos defendible.",
      "Las empresas tecnologicas han tendido a presentar la capacidad computacional como si dependiera solo de chips y software. La realidad es mucho menos abstracta.",
      "Cada megavatio disponible requiere subestaciones, lineas, permisos, coordinacion regulatoria y, a menudo, anos de obra e integracion.",
      "Eso introduce una geografia nueva del compute: los despliegues ya no se deciden solo por incentivos fiscales o proximidad al cliente, sino por acceso real a energia y red.",
      "En ese marco, la planificacion electrica se convierte en factor competitivo para la economia digital.",
      "Quien quiera liderar la IA industrial tendra que aprender a hablar tambien el lenguaje de transformadores, picos de demanda y capacidad de evacuacion."
    )
  },
  {
    id: "biologia-sintetica-farmacos",
    title: "La biologia sintetica acelera el diseno de farmacos, pero tensiona la validacion experimental",
    excerpt: "Los modelos de laboratorio generativo reducen iteraciones, aunque la prueba biologica sigue siendo el cuello de botella real.",
    category: "biotech",
    author: "Julia Ferrer",
    readingTime: "6 min",
    publishedAt: "01 MAY 2026",
    accent: "from-teal-300/15 via-cyan-400/10 to-transparent",
    tag: "Analisis",
    deck:
      "La velocidad de diseno mejora, pero el sistema sigue necesitando comprobacion fisica, ensayos y trazabilidad cientifica.",
    body: body(
      "La biologia sintetica esta incorporando herramientas generativas para proponer compuestos, rutas y configuraciones con mayor rapidez.",
      "Ese avance reduce iteraciones de laboratorio, aunque no elimina el tramo costoso: validar funcion, seguridad y reproducibilidad.",
      "La promesa del sector se sostiene cuando la aceleracion computacional mejora ciencia real y no solo throughput aparente.",
      "Los nuevos modelos son capaces de sugerir estructuras, optimizar candidatos y explorar espacios de combinacion que antes exigian mucho mas tiempo de laboratorio.",
      "Sin embargo, la biologia sigue imponiendo una friccion saludable: lo plausible en simulacion no siempre se comporta igual en sistemas vivos.",
      "Esa distancia entre propuesta y validacion es precisamente donde se juega el valor. No gana quien genera mas opciones, sino quien convierte mejor esas opciones en evidencia util.",
      "El riesgo del hype es confundir velocidad de ideacion con velocidad terapeutica. Son dos cosas distintas.",
      "La biologia sintetica sera transformadora si logra comprimir el ciclo completo entre hipotesis, prueba y aprendizaje. No solo la primera parte."
    )
  }
];

export const manifestoPoints = [
  "Interpretamos sistemas complejos sin sacrificar claridad ni rigor.",
  "Priorizamos contexto sobre velocidad y explicacion sobre estridencia.",
  "Tratamos ciencia y tecnologia como fuerzas politicas, economicas y culturales."
];

export const authorityMetrics = [
  { value: "Desde 2012", label: "Cobertura continua de tecnologia y ciencia" },
  { value: "+12.500", label: "Articulos, analisis y entrevistas publicadas" },
  { value: "+2.5M", label: "Lectores mensuales en mercados hispanohablantes" },
  { value: "150+", label: "Paises con audiencia recurrente" }
];

export const allArticles = [
  featuredArticle,
  ...categoryHighlights,
  ...opinionAndLabArticles,
  ...sectorArticles
];
