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
            AtualizarTasks(task_atual.id)
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



async function AtualizarTasks(id) {
    const tarefa = await obterTarefa(id);
  
    const form = document.createElement("form");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const novaTarefa = Object.fromEntries(formData.entries());
      const response = await atualizarTask(id, novaTarefa);
      if (response.status === 200) {
        console.log("Tarefa atualizada com sucesso");
        MostrarTarefas();
      } else {
        console.log("Erro ao atualizar tarefa");
      }
  
      form.remove();
    });
  
  
    for (const [campo, valor] of Object.entries(tarefa)) {
      if (campo === "id") {
        continue;
      }
      const label = document.createElement("label");
      label.innerText = campo;
      label.classList.add("por_label"); 
      const input = document.createElement("input");
      input.setAttribute("name", campo);
      input.setAttribute("value", valor);
      input.classList.add("sao_inputs"); 
      form.appendChild(label);
      form.appendChild(input);
    }
  
  
    const ConfirmarUpdate = document.createElement("button");
    ConfirmarUpdate.innerText = "Confirmar";
    ConfirmarUpdate.classList.add("como_assim"); 
    form.appendChild(ConfirmarUpdate);
  
    // exibindo o formulário na tela
    const container = document.getElementById("formulario");
    container.innerHTML = "";
    container.appendChild(form);
  }
  
  async function obterTarefa(id) {
    const response = await fetch(`${api_url}${id}`);
    const data = await response.json();
    return data;
  }
  
  async function atualizarTask(id, tarefa) {
    const response = await fetch(`${api_url}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tarefa),
    });
    return response;
  }
  
MostrarTarefas()
