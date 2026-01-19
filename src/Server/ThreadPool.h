#ifndef THREAD_POOL_H
#define THREAD_POOL_H

#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>

// A simple thread pool implementation 
class ThreadPool {

public:
    // Constructor to initialize the thread pool with a given number of threads and maximum queue size
    ThreadPool(size_t numThreads, size_t maxQueueSize);
    ~ThreadPool();

    // Disable copy & assignment
    ThreadPool(const ThreadPool&) = delete;
    ThreadPool& operator=(const ThreadPool&) = delete;

    void enqueue(std::function<void()> task);

private:
    void workerLoop();

    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;

    std::mutex queueMutex;
    std::condition_variable condition;
    bool stop;
    size_t maxQueueSize;
};

#endif // THREAD_POOL_H
