package com.example.taskmanagement.service;

import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.enums.TaskStatus;
import com.example.taskmanagement.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    public Task create(Task task) {
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.TASK);
        }
        return repo.save(task);
    }

    public List<Task> getAll() {
        return repo.findAll();
    }

    public Task move(Long id, TaskStatus newStatus) {
        Task task = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id " + id));

        if (newStatus == TaskStatus.IN_PROGRESS) {
            if (task.getStatus() != TaskStatus.TASK) {
                throw new RuntimeException("Only tasks in TASK status can move to IN_PROGRESS");
            }
            task.setStartTime(LocalDateTime.now());
            task.setStatus(newStatus);
        } else if (newStatus == TaskStatus.COMPLETED) {
            if (task.getStatus() != TaskStatus.IN_PROGRESS) {
                throw new RuntimeException("Task should first move to IN_PROGRESS");
            }
            task.setEndTime(LocalDateTime.now());
            task.setTotalSeconds(Duration.between(task.getStartTime(), task.getEndTime()).getSeconds());
            task.setStatus(newStatus);
        } else if (newStatus == TaskStatus.TASK) {
            task.setStatus(newStatus);
            task.setStartTime(null);
            task.setEndTime(null);
            task.setTotalSeconds(null);
        }

        return repo.save(task);
    }
}
