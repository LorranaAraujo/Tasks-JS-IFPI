from fastapi import FastAPI, HTTPException,status
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

lista_task = []
situacao_list = ["nova" , "pendente", "em andamento" , "cancelada"]
sit_final = ["resolvida"]
contador = 0


origins = ['http://127.0.0.1:8000/tasks/','http://localhost:5500','http://127.0.0.1:5500']

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class Tasks(BaseModel):
    id: int | None
    descricao: str
    responsavel: str| None
    nivel: int
    situacao: str| None = situacao_list[0]
    prioridade: int




 

@app.post("/tasks/",status_code=201)
async def adicionar_task(task: Tasks):
    niveis = [1,3,5,8]
    prioridade = [1,2,3]

    for task_atual in lista_task:
        if task_atual.id == task.id:
            raise HTTPException(404, detail="Tarefa já existe")
    
    if task.nivel not in niveis:
        raise HTTPException(404, detail="Digite um nível válido(1,3,5,8)")
    elif task.prioridade not in prioridade:
        raise HTTPException(404, detail="Digite uma prioridade válida(1,2,3)")

    elif task.situacao not in situacao_list and task.situacao not in sit_final :
        raise HTTPException(404, detail="Digite uma situação válida")
    global contador
    contador += 1
    task.id = contador
    lista_task.append(task)
    return {"Mensagem": "Tarefa criada"}


@app.get("/tasks/")
async def listar_tarefa():
    return lista_task

#situacao
@app.get("/tasksit/{situacao}")
async def listar_sit(situacao:str) -> List[Tasks]:
    return [tasks_atual for tasks_atual in lista_task if tasks_atual.situacao == situacao]

#nivel
@app.get("/tasknivel/{nivel}")
async def listar_niv(nivel:int) -> List[Tasks]:
    return [task for task in lista_task if task.nivel == nivel]

#prioridade
@app.get("/tasksprioridade/{prioridade}")
async def listar_prioridade(prioridade:int) -> List[Tasks]:
    return [tarefa for tarefa in lista_task if tarefa.prioridade == prioridade]



@app.delete("/tasks/{task_id}")
async def remover(task_id: int):
    for task_atual in lista_task:
        if task_atual.id == task_id:
            lista_task.remove(task_atual)
            return {"Mensagem": "Tarefa Removida"}

    raise HTTPException(404, detail="Tarefa Removida")



@app.put("/tasks/{task_id}/{situacao}")
async def mudar_situacao(task_id:int,situacao:str):
    for task_atual in lista_task:
        if task_atual.id == task_id and situacao in situacao_list:
            task_atual.situacao = situacao
            return {"Mensagem":"Situação alterada"}
        elif task_atual.id == task_id and task_atual.situacao == situacao_list[1] or task_atual.situacao == situacao_list[2]:
            if situacao in sit_final :
                task_atual.situacao = situacao
                return {"Mensagem":"Situação alterada"}
          
            task_atual.situacao = situacao
            return{"Mensagem":"Situacão Alterada"}
        

    raise HTTPException(404,detail="tarefa não encontrada")




