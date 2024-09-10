class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false

            }
        }
        return true
    }
}

class Bd{

    constructor(){
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

getProximoId(){
    let proximoId = localStorage.getItem('id')//null
    return(parseInt(proximoId) + 1)
}
    gravar(d){
        
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros(){

        //array de despesas
        let despesas = Array()


        let id = localStorage.getItem('id')

        //Recuperando todos os dados do LocalStorage
        for( let i = 1; i <= id; i++){
            //recuperar a depesa
        let despesa = JSON.parse(localStorage.getItem(i))

        //Checando indices que foram pulados ou removidos
        //nesse caso ele é pulados
        if(despesa === null){
           continue
        }

        despesa.id = i
        despesas.push(despesa)
    }
    return despesas
    }
    pesquisar(despesa){
    let despesasFiltradas = Array()
    despesasFiltradas = this.recuperarTodosRegistros()
    console.log(despesa)
    console.log(despesasFiltradas)
    //recuperando ano
    if(despesa.ano != ''){
        console.log('filtro de ano')
    despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
}   
    //recuperando mes
    if(despesa.mes != ''){
        console.log('filtro de mes')
        despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
}
    //recuperando dia
    if(despesa.dia!= ''){
        console.log('filtro de dia')
        despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
}   
    //recuperando tipo
    if(despesa.tipo != ''){
    console.log('filtro de tipo')
    despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
}
    //reculperando Descrição
    if(despesa.descricao != ''){
    console.log('filtro de descricao')
    despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
}
    //reculperando Valor
    if(despesa.valor != ''){
    console.log('filtro de valor')
    despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
}


    return despesasFiltradas
    }
    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value) 

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    //dialog de Sucesso e de ERRO

    if(despesa.validarDados()){
        bd.gravar(despesa)
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-primary'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-primary'
        document.getElementById('btn-x').className = 'btn btn-primary'

        
        $('#modalRegistraDespesa').modal('show') 

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
        
    } else {
       
        document.getElementById('modal_titulo').innerHTML = 'ERRO - Verifique os dados!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Existem campos em branco!'
        document.getElementById('modal_btn').innerHTML = 'CORRIGIR!'
        document.getElementById('modal_btn').className = 'btn btn-danger'
        $('#modalRegistraDespesa').modal('show')    
    }
}

// Guardando informaçoes no 'consulta.html'.

function carregaListaDespesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }
    
    

    //Preenchendo o tbody da consulta
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    // Percorrendo o Arry listando dinamicamente
    despesas.forEach(function(d){
        //console.log(d)
        //criando a lista (tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 
        
        // Ajustando o tipo
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        // botão de Exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //remover despesa
            
            let id = this.id.replace('id_despesa_', '')
            //alert(id)
            bd.remover(id)
            window.location.reload()
            
        }
        linha.insertCell(4).append(btn)
        console.log(d)


    })

    /*<tr>
        <td>21/06/1991</td>
        <td>Nascimento</td>
        <td>Fabricio</td>
        <td>SUS</td>
    </tr>*/
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    
    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)

    

}