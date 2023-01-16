interface MessageInterface {
  id?: number,
  text: string,
  type: 'success' | 'warning' | 'danger'
}

export type { MessageInterface }