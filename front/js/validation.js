export function validarVistoria(vistoria) {
    const erros = [];

    if (!vistoria.codigo_identificador)
        erros.push("Informe o identificador único da vistoria");

    if (!vistoria.placa)
        erros.push("Informe a placa do veículo");

    if (!vistoria.modelo)
        erros.push("Informe o modelo do veículo");

    if (!vistoria.ano || vistoria.ano < 1900 || vistoria.ano > 2100)
        erros.push("Informe um ano válido para o veículo");

    if (!vistoria.responsavel)
        erros.push("Informe o responsável");

    if (!vistoria.data_abertura)
        erros.push("Informe a data de abertura");

    return erros;
}

export function validarOcorrencia(ocorrencia) {
    const erros = [];

    if (!ocorrencia.vistoria_id)
        erros.push("Selecione uma vistoria");

    if (!ocorrencia.classificacao)
        erros.push("Informe a classificação da ocorrência");

    if (!ocorrencia.data_ocorrencia)
        erros.push("Informe a data da ocorrência");

    if (!ocorrencia.descricao)
        erros.push("Informe a descrição da ocorrência");

    return erros;
}