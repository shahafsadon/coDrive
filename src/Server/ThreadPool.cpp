#include "ThreadPool.h"

// Constructor to initialize the thread pool with a given number of threads and maximum queue size
ThreadPool::ThreadPool(size_t numThreads, size_t maxQueueSize)
    : stop(false), maxQueueSize(maxQueueSize) {

    for (size_t i = 0; i < numThreads; ++i) {
        workers.emplace_back(&ThreadPool::workerLoop, this);
    }
}

// Enqueue a new task into the thread pool
void ThreadPool::enqueue(std::function<void()> task) {
    {
        std::lock_guard<std::mutex> lock(queueMutex);

        if (tasks.size() >= maxQueueSize) {
            std::cerr << "[THREAD_POOL] Queue full – task rejected" << std::endl;
            return;
        }

        tasks.push(std::move(task));
    }
    condition.notify_one();
}


void ThreadPool::workerLoop() {
    while (true) {
        std::function<void()> task;

        {
            std::unique_lock<std::mutex> lock(queueMutex);
            condition.wait(lock, [this]() {
                return stop || !tasks.empty();
            });

            if (stop && tasks.empty()) {
                return;
            }

            task = std::move(tasks.front());
            tasks.pop();
        }

        // Execute the task and handle any exceptions
        try {
            task();
        } catch (const std::exception& e) {
            std::cerr << "[THREAD_POOL] Task exception: "
                      << e.what() << std::endl;
        } catch (...) {
            std::cerr << "[THREAD_POOL] Unknown task exception"
                      << std::endl;
        }

    }
}

ThreadPool::~ThreadPool() {
    {
        std::lock_guard<std::mutex> lock(queueMutex);
        stop = true;
    }

    condition.notify_all();

    for (std::thread& worker : workers) {
        if (worker.joinable()) {
            worker.join();
        }
    }
}
