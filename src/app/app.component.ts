import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  url: string = "";
  depth: number = 1;
  result: any[] = [];
  loading: boolean = false;

  session_id: string = "";

  constructor(private http: HttpClient, private socket: Socket) {
    this.connectToSocket();

    this.socket.on("disconnect", () => {
      this.connectToSocketChannel();
    })
  }

  submit() {
    const apiUrl = `http://localhost:8000/api/crawl?url=${encodeURIComponent(this.url)}&depth=${this.depth}&session_id=${this.session_id}`;
    this.http.get(apiUrl).subscribe(() => {
    });
  }

  getSessionId() {
    return new Promise((resolve: any, rejct) => {
      const apiUrl = `http://localhost:8000/api/session_id`;
      this.http.get(apiUrl).subscribe((data: any) => {
        this.session_id = data.session_id;

        resolve();
      });
    })
  }

  connectToSocket() {
    this.socket.connect();
    this.getSessionId().then(() => {
      this.connectToSocketChannel();
    })
  }

  connectToSocketChannel() {
    this.socket.emit("connect_channel", { channel: "channel_" + this.session_id });
    this.socket.on('message', (data: any) => {
      console.log("Got data from socket:", data);
      this.result.push(data.url);
    });
  }
}