export type MessageHandler = (name: string, data?: any) => void;

export class MessageBus {
  private listeners: { [key: string]: MessageHandler[] } = {};

  subscribe(name: string, handler: MessageHandler) {
    if (!this.listeners[name]) {
      this.listeners[name] = [handler];
    } else {
      this.listeners[name].push(handler);
    }
  }

  async dispatch(name: string, value?: any): Promise<void> {
    const keys = this.listeners[name];
    if (keys && keys.length) {
      for (let i = 0; i < keys.length; i++) {
        const w = keys[i];
        try {
          await w(name, value);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}

export const bus = new MessageBus();