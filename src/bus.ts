export type MessageHandler = (name: string, data?: any) => void;

export class MessageBus {
  private listeners: Map<string, Map<number, MessageHandler>> = new Map();
  private counter = 0;

  subscribe(name: string, handler: MessageHandler): number {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, new Map());
    }
    this.listeners.get(name)!.set(++this.counter, handler);
    return this.counter;
  }

  unsubscrive(name: string, token: number): boolean {
    if (this.listeners.has(name)) {
      return this.listeners.get(name)!.delete(token);
    }
    return false;
  }

  async dispatch(name: string, value?: any): Promise<void> {
    const map = this.listeners.get(name);
    if (map) {
      map.forEach(async (handler) => {
        try {
          await handler(name, value);
        } catch (err) {
          console.error(err);
        }
      });
    }
  }
}

export const bus = new MessageBus();