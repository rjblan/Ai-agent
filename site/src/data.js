// All content here is demonstration data for a mock site.

export const LINES = {
  1: { color: 'var(--l1)', on: '#fff' },
  2: { color: 'var(--l2)', on: '#fff' },
  3: { color: 'var(--l3)', on: 'var(--ink)' },
  4: { color: 'var(--l4)', on: '#fff' },
}

// kind: 'auto' runs on its own, 'ask' stops for permission (irreversible).
export const EXAMPLES = [
  {
    id: 'correo',
    chip: 'Contesta los correos de clientes',
    task: 'Contesta los correos de clientes que llegaron hoy',
    line: 1,
    steps: [
      { label: 'Leer 14 correos sin responder', kind: 'auto' },
      { label: 'Agruparlos por tema', kind: 'auto' },
      { label: 'Redactar 12 respuestas', kind: 'auto' },
      {
        label: 'Enviar las 12 respuestas',
        kind: 'ask',
        question: '¿Envío 12 respuestas a clientes?',
        detail: 'Un correo enviado no se puede recuperar. Puedes leer los borradores antes.',
      },
      { label: 'Archivar y anotar en el registro', kind: 'auto' },
    ],
    result: '12 respuestas enviadas, 2 marcadas para ti',
  },
  {
    id: 'reunion',
    chip: 'Mueve la reunión del jueves',
    task: 'Mueve mi reunión del jueves a la semana que viene',
    line: 2,
    steps: [
      { label: 'Encontrar la reunión del jueves', kind: 'auto' },
      { label: 'Mirar huecos de los 4 asistentes', kind: 'auto' },
      { label: 'Proponer martes a las 10:00', kind: 'auto' },
      {
        label: 'Avisar a los 4 asistentes',
        kind: 'ask',
        question: '¿Aviso a los 4 asistentes del cambio?',
        detail: 'Les llegará una invitación nueva. La anterior se cancela.',
      },
      { label: 'Actualizar tu calendario', kind: 'auto' },
    ],
    result: 'Reunión movida al martes 10:00',
  },
  {
    id: 'facturas',
    chip: 'Ordena las facturas de octubre',
    task: 'Ordena las facturas de octubre',
    line: 3,
    steps: [
      { label: 'Encontrar 23 PDF en Descargas', kind: 'auto' },
      { label: 'Leer importe y proveedor', kind: 'auto' },
      { label: 'Renombrar con fecha y proveedor', kind: 'auto' },
      {
        label: 'Borrar 3 duplicados',
        kind: 'ask',
        question: '¿Borro 3 facturas duplicadas?',
        detail: 'Se van a la papelera. Las otras 20 se mueven a Facturas/2026-10.',
      },
      { label: 'Dejar un resumen de gastos', kind: 'auto' },
    ],
    result: '20 facturas ordenadas, 3 duplicados borrados',
  },
]

// A plan for anything typed that does not match an example.
export function planFor(text) {
  const clean = text.trim().replace(/\s+/g, ' ')
  const match = EXAMPLES.find((e) => e.task.toLowerCase() === clean.toLowerCase())
  if (match) return match
  const short = clean.length > 42 ? clean.slice(0, 40).trimEnd() + '…' : clean
  return {
    id: 'libre',
    task: clean,
    line: 4,
    steps: [
      { label: 'Entender el encargo', kind: 'auto' },
      { label: 'Reunir lo que hace falta', kind: 'auto' },
      { label: 'Preparar el resultado', kind: 'auto' },
      {
        label: 'Aplicar los cambios',
        kind: 'ask',
        question: '¿Aplico los cambios?',
        detail: `Último paso de «${short}». Después de esto no hay vuelta atrás.`,
      },
      { label: 'Anotarlo en el registro', kind: 'auto' },
    ],
    result: 'Encargo terminado',
  }
}

// Log fixtures. "worst" follows the break-ui catalog: plausible, not random.
export const LOG = {
  demo: [
    { id: 'a', line: 1, task: 'Contestar correos de clientes', result: '12 enviados, 2 para ti', approvedBy: 'Lucía', at: 'Hoy, 9:41', state: 'done' },
    { id: 'b', line: 3, task: 'Ordenar facturas de septiembre', result: '18 ordenadas', approvedBy: 'Lucía', at: 'Ayer, 18:02', state: 'done' },
    { id: 'c', line: 2, task: 'Mover la revisión de diseño', result: 'Corregido: la primera propuesta pisaba otra reunión. Se movió al viernes.', approvedBy: 'Lucía', at: 'Ayer, 11:15', state: 'corrected' },
    { id: 'd', line: 4, task: 'Borrar fotos repetidas', result: 'Descartado por ti antes de borrar', approvedBy: null, at: 'Lun, 20:30', state: 'discarded' },
  ],
  worst: [
    { id: 'w1', line: 1, task: 'Contestar a bartholomew.fitzgerald@northwind-industries-holdings.example.com sobre el pedido Q3-report…v12-final.pdf', result: 'Enviado', approvedBy: 'Aleksandra Wiśniewska-Kowalczyk', at: 'Hoy, 9:41', state: 'done' },
    { id: 'w2', line: 2, task: 'Jo', result: '', approvedBy: 'J', at: 'Hoy, 9:40', state: 'done' },
    { id: 'w3', line: 3, task: 'Benachrichtigungseinstellungen aktualisieren für alle Arbeitsbereiche', result: 'Corregido: el primer intento usó la zona horaria equivocada (UTC−3 en vez de UTC+1) y movió 1.284 avisos; se revirtieron todos.', approvedBy: 'María José de la Cruz y Fernández', at: 'Hace 12 días', state: 'corrected' },
    { id: 'w4', line: 4, task: 'Đặng Thị Ngọc Hân 👩🏽‍💻 — revisar contrato', result: 'Descartado por ti antes de borrar', approvedBy: null, at: 'Lun, 20:30', state: 'discarded' },
    { id: 'w5', line: 1, task: '<script>alert(1)</script> &amp; **negrita**', result: 'Texto mostrado tal cual', approvedBy: '王秀英', at: 'Dom, 8:00', state: 'done' },
  ],
  empty: [],
  one: [
    { id: 'o1', line: 1, task: 'Contestar correos de clientes', result: '1 enviado', approvedBy: 'Lucía', at: 'Hoy, 9:41', state: 'done' },
  ],
}
