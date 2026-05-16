const replacements = [
  [/\bTecnologia\b/g, "Tecnología"],
  [/\btecnologia\b/g, "tecnología"],
  [/\bestrategica\b/g, "estratégica"],
  [/\bsatelites\b/g, "satélites"],
  [/\belectrica\b/g, "eléctrica"],
  [/\bbioingenieria\b/g, "bioingeniería"],
  [/\bOpinion\b/g, "Opinión"],
  [/\bopinion\b/g, "opinión"],
  [/\bAnalisis\b/g, "Análisis"],
  [/\banalisis\b/g, "análisis"],
  [/\bAccion\b/g, "Acción"],
  [/\baccion\b/g, "acción"],
  [/\bAmbicion\b/g, "Ambición"],
  [/\bambicion\b/g, "ambición"],
  [/\bDecada\b/g, "Década"],
  [/\bdecada\b/g, "década"],
  [/\bDia\b/g, "Día"],
  [/\bdia\b/g, "día"],
  [/\bDidactica\b/g, "Didáctica"],
  [/\bdidactica\b/g, "didáctica"],
  [/\bInnovacion\b/g, "Innovación"],
  [/\binnovacion\b/g, "innovación"],
  [/\bMas\b/g, "Más"],
  [/\bmas\b/g, "más"],
  [/\bPaises\b/g, "Países"],
  [/\bpaises\b/g, "países"],
  [/\bPublica\b/g, "Pública"],
  [/\bpublica\b/g, "pública"],
  [/\bTecnica\b/g, "Técnica"],
  [/\btecnica\b/g, "técnica"],
  [/\bSenales\b/g, "Señales"],
  [/\bsenales\b/g, "señales"],
  [/\bSenal\b/g, "Señal"],
  [/\bsenal\b/g, "señal"],
  [/\bTodavia\b/g, "Todavía"],
  [/\btodavia\b/g, "todavía"],
  [/\bUtil\b/g, "Útil"],
  [/\butil\b/g, "útil"],
  [/\bVersion\b/g, "Versión"],
  [/\bversion\b/g, "versión"],
  [/\bContrasena\b/g, "Contraseña"],
  [/\bcontrasena\b/g, "contraseña"],
  [/\bRevision\b/g, "Revisión"],
  [/\brevision\b/g, "revisión"],
  [/\bautenticacion\b/g, "autenticación"],
  [/\bAutenticacion\b/g, "Autenticación"],
  [/\binformacion\b/g, "información"],
  [/\bInformacion\b/g, "Información"],
  [/\bQuienes\b/g, "Quiénes"],
  [/\bquienes\b/g, "quiénes"],
  [/\bArticulo\b/g, "Artículo"],
  [/\barticulo\b/g, "artículo"],
  [/\bArticulos\b/g, "Artículos"],
  [/\barticulos\b/g, "artículos"],
  [/\bGeneracion\b/g, "Generación"],
  [/\bgeneracion\b/g, "generación"],
  [/\bproximos\b/g, "próximos"],
  [/\bProximos\b/g, "Próximos"],
  [/\bpolitica\b/g, "política"],
  [/\bPolitica\b/g, "Política"],
  [/\bcientifica\b/g, "científica"],
  [/\bcientificas\b/g, "científicas"],
  [/\bcientifico\b/g, "científico"],
  [/\beconomicos\b/g, "económicos"],
  [/\bEconomicos\b/g, "Económicos"],
  [/\bestan\b/g, "están"],
  [/\bEstan\b/g, "Están"],
  [/\bclinico\b/g, "clínico"],
  [/\bgenica\b/g, "génica"],
  [/\borbita\b/g, "órbita"],
  [/\bboletin\b/g, "boletín"],
  [/\bpoliticos\b/g, "políticos"],
  [/\bPoliticos\b/g, "Políticos"],
  [/\bregulacion\b/g, "regulación"],
  [/\bRegulacion\b/g, "Regulación"],
  [/\bsintetica\b/g, "sintética"],
  [/\benergetica\b/g, "energética"],
  [/\bfotonico\b/g, "fotónico"],
  [/\baun\b/g, "aún"],
  [/\bTambien\b/g, "También"],
  [/\btambien\b/g, "también"]
] as const;

function repairMojibake(value: string) {
  if (!/[ÃÂ]/.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return value;
  }
}

export function restoreSpanishText(value: string) {
  const repaired = repairMojibake(value);
  return replacements.reduce((text, [search, replacement]) => text.replace(search, replacement), repaired);
}
