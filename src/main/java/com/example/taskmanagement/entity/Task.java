package com.example.taskmanagement.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.example.taskmanagement.enums.*;
@Entity
public class Task{
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String title; private String description;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    @Enumerated(EnumType.STRING)
    private TaskStatus status=TaskStatus.TASK;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long totalSeconds;
    public Task(){}
    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}
    public String getTitle(){return title;}
    public void setTitle(String title){this.title=title;}
    public String getDescription(){return description;}
    public void setDescription(String description){this.description=description;}
    public Priority getPriority(){return priority;}
    public void setPriority(Priority priority){this.priority=priority;}
    public TaskStatus getStatus(){return status;}
    public void setStatus(TaskStatus status){this.status=status;}
    public LocalDateTime getStartTime(){return startTime;}
    public void setStartTime(LocalDateTime startTime){this.startTime=startTime;}
    public LocalDateTime getEndTime(){return endTime;}
    public void setEndTime(LocalDateTime endTime){this.endTime=endTime;}
    public Long getTotalSeconds(){return totalSeconds;}
    public void setTotalSeconds(Long totalSeconds){this.totalSeconds=totalSeconds;}
}