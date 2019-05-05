import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient'
import { BehaviorSubject } from 'rxjs';


export class Message {
  constructor(
    public content: string,
    public sentBy: string,
  ){}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly token = environment.dialogFlow.angularBot;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  /**
   * Updates Messages
   * @param msg
   */
  update(msg: Message) {
    this.conversation.next([msg])
  }

  converse(msg: string) {
    const userMessage = new Message(msg, 'user')
    this.update(userMessage);
    
    this.client.textRequest(msg)
      .then(res => {
        const speech = res.result.fulfillment.speech;
        const botMessage = new Message(speech, 'bot');
        this.update(botMessage);
      }).catch(error => { console.log(error) });
  }
}
