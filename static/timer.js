class Timer {

  parseDuration(duration) {
    return parseInt(duration) * 1000;
  }

  setDuration(duration) {
    this.duration = this.parseDuration(duration);
  }

  getDuration() {
    return this.duration;
  }

  serializeDuration() {
    return this.duration / 1000;
  }

  getDurationMinutes() {
    return Math.floor((this.duration || 0) / 1000 / 60);
  }

  getDurationSeconds() {
    return Math.floor((this.duration || 0) / 1000) % 60;
  }

  getDurationSubseconds() {
    return Math.floor((this.duration || 0) % 1000 / 10);
  }

  parseTargetTime(seconds) {
    return new Date(seconds * 1000);
  }

  setTargetTime(seconds) {
    this.targetTime = this.parseTargetTime(seconds);
  }

  getTargetTime() {
    return this.targetTime;
  }

  serializeTargetTime() {
    return this.targetTime.getTime() / 1000;
  }

  getTargetTimeBy(date) {
    const ms = this.getDuration();
    return new Date(date.getTime() + ms);
  }

  getRemainingTime(now) {
    if (this.isRunning()) {
      return this.targetTime - now;
    }
  }

  isPassed(remainingTime) {
    return remainingTime < 0;
  }

  getRandomMinutes() {
    return Math.floor(Math.random() * 100);
  }

  getRandomSeconds() {
    return Math.floor(Math.random() * 60);
  }

  getRandomSubseconds() {
    return Math.floor(Math.random() * 100);
  }

  getRemainingMinutes(remainingTime) {
    if (this.isPassed(remainingTime)) {
      return 0;
    } else {
      return Math.floor(remainingTime / 1000 / 60);
    }
  }

  getRemainingSeconds(remainingTime) {
    if (this.isPassed(remainingTime)) {
      return 0;
    } else {
      return Math.floor(remainingTime / 1000) % 60;
    }
  }

  getRemainingSubseconds(remainingTime) {
    if (this.isPassed(remainingTime)) {
      return 0;
    } else {
      return Math.floor((remainingTime % 1000) / 10);
    }
  }

  getRemainingMinutesString(remainingTime) {
    if (this.isLoading()) {
      return this.getRandomMinutes().toString().padStart(2, '0');
    } else if (this.isStopped()) {
      return this.getDurationMinutes().toString().padStart(2, '0');
    } else if (!remainingTime || this.isPassed(remainingTime)) {
      return '00';
    } else {
      const minutes = this.getRemainingMinutes(remainingTime);
      return minutes.toString().padStart(2, '0');
    }
  }

  getRemainingSecondsString(remainingTime) {
    if (this.isLoading()) {
      return this.getRandomSeconds().toString().padStart(2, '0');
    } else if (this.isStopped()) {
      return this.getDurationSeconds().toString().padStart(2, '0');
    } else if (!remainingTime || this.isPassed(remainingTime)) {
      return '00';
    } else {
      const seconds = this.getRemainingSeconds(remainingTime);
      return seconds.toString().padStart(2, '0');
    }
  }

  getRemainingSubsecondsString(remainingTime) {
    if (this.isLoading()) {
      return this.getRandomSubseconds().toString().padStart(2, '0');
    } else if (this.isStopped()) {
      return this.getDurationSubseconds().toString().padStart(2, '0');
    } else if (!remainingTime || this.isPassed(remainingTime)) {
      return '00';
    } else {
      const subseconds = this.getRemainingSubseconds(remainingTime);
      return subseconds.toString().padStart(2, '0');
    }
  }

  getBlinkingColon(remainingTime) {
    if (this.isLoading()) {
      return ':';
    } else if (this.isStopped()) {
      return ':';
    } else if (this.isRunning()) {
      const subseconds = this.getRemainingSubseconds(remainingTime);
      return 0 < subseconds && subseconds < 15 || 50 < subseconds && subseconds < 65 ? ' ' : ':';
    } else {
      return ':';
    }
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  serializeStatus() {
    return this.status;
  }

  isLoading() {
    return this.status === 'loading';
  }

  isRunning() {
    return this.status === 'running';
  }

  isStopped() {
    return this.status === 'stopped';
  }

  makeLoading() {
    this.status = 'loading';
  }

  makeRunning(now) {
    this.targetTime = this.getTargetTimeBy(now);
    this.status = 'running';
  }

  makeStopped() {
    this.startAt = null;
    this.status = 'stopped';
  }

}
