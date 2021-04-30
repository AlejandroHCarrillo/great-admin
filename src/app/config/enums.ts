export const eEstatusCargos = {
    NO_PAGADO: "NO_PAGADO", 
    PAGO_PARCIAL: "PAGO_PARCIAL", 
    PAGADO: "PAGADO", 
    CANCELADO: "CANCELADO"
}

export const eTiposPago = {
    CONTADO: "CONTADO",
    TCREDITO: "TARJETA DE CREDITO",
    TDEBITO: "TARJETA DE DEBITO",
    CHEQUE: "CHEQUE"
}

export const eSeverityMessages = {
        success: "success",
        info: "info",
        warn: "warn",
        error: "error",
}

export const aMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
]

export const enumNivel = {
        KINDER: "KINDER",
        PRIMARIA: "PRIMARIA",
        SECUNDARIA: "SECUNDARIA",
        PREPARATORIA: "PREPARATORIA",
        LICENCIATURA: "LICENCIATURA",
        POSGRADO: "POSGRADO",
        DOCTORADO: "DOCTORADO",
}

export const enumRol = {
    USER: "USER_ROLE",
    ADMIN: "ADMIN_ROLE"
}

export const ddNiveles = [
    { code: "KINDER", name: "KINDER" },
    { code: "PRIMARIA", name: "PRIMARIA" },
    { code: "SECUNDARIA", name: "SECUNDARIA" },
    { code: "PREPARATORIA", name: "PREPARATORIA" },
    { code: "LICENCIATURA", name: "LICENCIATURA" },
    { code: "MAESTRIA", name: "MAESTRIA" },
    { code: "DOCTORADO", name: "DOCTORADO" }
]

export const ddTiposCargos = [
    { code: "COL", name: "COLEGIATURA" },
    { code: "INSC", name: "INSCRIPCION" },
    { code: "CTAFAM", name: "CUOTA FAMILIAR" },
    { code: "TRANSP", name: "TRANSPORTE" },
    { code: "SEGACC", name: "SEGURO ACCIDENTES" },
    { code: "COMIDA", name: "COMIDAS" },
    { code: "AFTERKDS", name: "AFTER NIÑOS" },
    { code: "AFTERADLT", name: "AFTER ADULTOS" },
    { code: "MATESC", name: "MATERIALES ESCOLARES" },
    { code: "HOREXT", name: "HORARIO EXTENDIDO" },
    { code: "PASSAL", name: "PASEOS Y SALIDAS" },
    { code: "CURSOS", name: "CURSOS" },
    { code: "CONF", name: "CONFERENCIAS" },
    { code: "OTROS", name: "OTROS" }
]

export const ddTipoItemVenta = [
    { name: 'Producto', code: 'P' },
    { name: 'Servicio', code: 'S' }
];

export const tiposmovimiento = {
    cargo: "cargo",
    abono: "abono",
    saldo: "saldo"
};

export const ddUnidadesMedida = [
    { code: '', name: 'No unidad de medida.' },
    { code: 'PZA', name: 'Pieza' },
    { code: 'PLZA', name: 'Poliza' },
    { code: 'KG', name: 'Kilogramo' },
    { code: 'CAJA', name: 'Caja' },
    { code: 'LB', name: 'Libra' },
    { code: 'GR', name: 'Gramo' },
    // { code: '', name: ' ' }
  ];

export const ddFormasPago = [
    { code: '', name: 'Seleccione una forma de pago.' },
    { code: 'EF', name: 'EFECTIVO' },
    { code: 'DEPEF', name: 'DEPOSITO' },
    { code: 'TRNS', name: 'TRANSFERENCIA' },
    { code: 'TC', name: 'TARJETA CREDITO' },
    { code: 'TD', name: 'TARJETA DEBITO' },
    { code: 'CHQ', name: 'CHEQUE' },
    { code: 'OTRO', name: 'OTRO' }
    // { code: '', name: ' ' }
  ];
