class EventHorizonTimerApplication {

  setTimer(timer) {
    this.timer = timer;
  }

  getTimer() {
    return this.timer;
  }

  getTimerId() {
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1];
  }

  getHttpHostname() {
    const hostname = 'example.com';
    return hostname;
  }

  getTimerUrl() {
    const hostname = this.getHttpHostname();
    const id = this.getTimerId();
    const url = `https://${hostname}/api/timers/${id}`;
    return url;
  }

  getDefaultHeaders() {
    return {
      'Content-Type': 'application/json',
    }
  }

  async getTimerFromApi() {
    const url = this.getTimerUrl();
    const headers = this.getDefaultHeaders();

    return fetch(url, {
      method: 'GET',
      headers: headers,
    });
  }

  async updateTimer() {
    const response = await this.getTimerFromApi();
    const { timer } = await response.json();

    this.timer.setDuration(timer.duration);
    this.timer.setStatus(timer.status);
    this.timer.setTargetTime(timer.target_time);
  }

  async putTimerToApi() {
    const url = this.getTimerUrl();
    const headers = this.getDefaultHeaders();

    return fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({
        duration: this.timer.serializeDuration(),
        status: this.timer.serializeStatus(),
        target_time: this.timer.serializeTargetTime(),
      }),
    });
  }

  getWebSocketUrl() {
    const hostname = 'example.com';
    const id = this.getTimerId();
    const url = `wss://${hostname}/develop?timer_id=${id}`;
    return url;
  }

  createWebSocket() {
    const url = this.getWebSocketUrl();
    this.webSocket = new WebSocket(url);
    return this.webSocket;
  }

  getWebSocket() {
    return this.webSocket;
  }

  openHandler(event) {
  }

  bindOpenHandler() {
    if (this.webSocket && !this.openListener) {
      this.openListener = this.webSocket.addEventListener('open', this.openHandler.bind(this));
    }
  }

  messageHandler(event) {
    const data = JSON.parse(event.data);

    if (data.action === 'update_timer') {
      this.timer.setDuration(data.timer.duration);
      this.timer.setStatus(data.timer.status);
      this.timer.setTargetTime(data.timer.target_time);
    }
  }

  bindMessageHandler() {
    if (this.webSocket && !this.messageListener) {
      this.messageListener = this.webSocket.addEventListener('message', this.messageHandler.bind(this));
    }
  }

  errorHandler(event) {
  }

  bindErrorHandler() {
    if (this.webSocket && !this.errorListener) {
      this.errorListener = this.webSocket.addEventListener('error', this.errorHandler.bind(this));
    }
  }

  closeHandler(event) {
  }

  bindCloseHandler() {
    if (this.webSocket && !this.closeListener) {
      this.closeListener = this.webSocket.addEventListener('close', this.closeHandler.bind(this));
    }
  }

}
