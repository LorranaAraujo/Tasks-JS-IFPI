const api_url = 'https://task-db.onrender.com/tasks/'

async function obterTarefas() {
    const response = await fetch(api_url);
    const data = await response.json();
    return data;
}

async function CriarTarefa() { 
    const descricao = document.getElementById('descricao').value;
    const responsavel = document.getElementById('responsavel').value;
    const nivel = document.getElementById('nivel').value;
    const situacao = document.getElementById('situacao').value;
    const prioridade = document.getElementById('prioridade').value;


    const NovaTarefa = {
        descricao: descricao,
        responsavel: responsavel,
        nivel: parseInt(nivel),
        situacao:situacao,
        prioridade:parseInt(prioridade)

    };

    const response = await fetch(api_url,{
        method:'POST',
        headers : {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(NovaTarefa)
    });

    if (response.status === 201) {
        document.getElementById('descricao').value = '';
        document.getElementById('responsavel').value = '';
        console.log("Tarefa criada com sucesso!")
    }else{
        console.log("ERRO")
    }
    MostrarTarefas()


}

async function MostrarTarefas(){
    const tasks = await obterTarefas()
    const tabela = document.getElementById('Tabela-Tarefas')
    tabela.innerHTML = '';
    const cabecalho = `
    <thead>
        <tr>
            <th>Id</th>
            <th>Descrição</th>
            <th>Responsável</th>
            <th>Nível</th>
            <th>Situação</th>
            <th>Prioridade</th>
        </tr>
    </thead>`;
    tabela.innerHTML+=cabecalho
    for (let task_atual of tasks){
        const row = tabela.insertRow();
        row.insertCell().innerText = task_atual.id
        row.insertCell().innerText = task_atual.descricao
        row.insertCell().innerText = task_atual.responsavel
        row.insertCell().innerText = task_atual.nivel
        row.insertCell().innerText = task_atual.situacao
        row.insertCell().innerText = task_atual.prioridade
        
        

        const BotaoDeletar = document.createElement('button')
        BotaoDeletar.innerText = 'Excluir'
        BotaoDeletar.classList.add('botao')
        BotaoDeletar.addEventListener('click',()=>{
            DeletarTask(task_atual.id)
        })
        row.insertCell().appendChild(BotaoDeletar)


        const BotaoEditar = document.createElement('button')
        BotaoEditar.innerText = 'Editar'
        BotaoEditar.classList.add('botao')
        BotaoEditar.addEventListener('click',()=>{
            EditarTasks(task_atual.id)
        })
        row.insertCell().appendChild(BotaoEditar)
        
}
}


async function DeletarTask(id) {
    const response = await fetch (`${api_url}${id} `, {
        method: 'DELETE',
        headers : {
            'Content-Type':'application/json'
        }
    });

    if (response.status === 204) {

        console.log("Tarefa excluída com sucesso");
    } else {
        console.log("Erro");
    }
    MostrarTarefas();

    }



async function EditarTasks(id) {
    const NovaTarefa = prompt('Digite a nova situação')
    const TarefaAtualizada = {
        situacao:NovaTarefa
    } 
    const response = await fetch (`${api_url}${id}/${TarefaAtualizada.situacao}`,{
        method : 'PUT',
        headers : {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(NovaTarefa)
    })
    if (response.status === 200) {
        console.log("Tarefa Alterada")
        MostrarTarefas()
    } else {
        console.log('Erro')
    }
}
