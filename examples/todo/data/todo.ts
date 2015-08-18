
export type TodoListData = TodoItemData[];

export type TodoItemData = {
  id: number,
  text: string,
  //* indica que a tarefa foi feita */
  marked: boolean
}
