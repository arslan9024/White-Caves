/**
 * whatsappQueue.js — Nadia WhatsApp Queue with Exponential Backoff Retry
 *
 * Handles outgoing WhatsApp webhooks and messages with retry attempts
 * and exponential delay backoff algorithm.
 */

class WhatsAppQueue {
  constructor() {
    this.queue = [];
    this.maxRetries = 5;
    this.baseDelayMs = 1000;
  }

  enqueue(messageData) {
    const job = {
      id: `wa-job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      payload: messageData,
      attempts: 0,
      status: 'pending',
      nextRetryTime: Date.now(),
    };
    this.queue.push(job);
    return job;
  }

  calculateBackoff(attempts) {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s + jitter
    const delay = this.baseDelayMs * Math.pow(2, attempts) + Math.random() * 200;
    return Math.min(delay, 30000); // cap at 30 seconds
  }

  async processNextJob(sendHandler) {
    const now = Date.now();
    const readyJob = this.queue.find(
      (j) => j.status === 'pending' && j.nextRetryTime <= now
    );

    if (!readyJob) return null;

    readyJob.attempts += 1;
    try {
      const result = await sendHandler(readyJob.payload);
      readyJob.status = 'completed';
      return { success: true, jobId: readyJob.id, result };
    } catch (err) {
      if (readyJob.attempts >= this.maxRetries) {
        readyJob.status = 'failed';
        readyJob.error = err.message;
        return { success: false, jobId: readyJob.id, failedPermanently: true, error: err.message };
      } else {
        const backoffMs = this.calculateBackoff(readyJob.attempts);
        readyJob.nextRetryTime = Date.now() + backoffMs;
        return { success: false, jobId: readyJob.id, retryingInMs: backoffMs };
      }
    }
  }

  getMetrics() {
    return {
      totalInQueue: this.queue.length,
      pending: this.queue.filter((j) => j.status === 'pending').length,
      completed: this.queue.filter((j) => j.status === 'completed').length,
      failed: this.queue.filter((j) => j.status === 'failed').length,
    };
  }
}

export const whatsappQueue = new WhatsAppQueue();
