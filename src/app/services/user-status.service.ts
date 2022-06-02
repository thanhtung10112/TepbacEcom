import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStatusService {
  userStatus = new EventEmitter();
  constructor() { }
  pushEventLogin(data: {}) {
    this.userStatus.emit(data);
  }
}
