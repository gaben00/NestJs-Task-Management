import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskFilterDto } from './dto/task-filter.dto';
import { User } from '../auth/user.entity';

/**
 * TypeOrmDocumentation: http://typeorm.delightful.studio/classes/_repository_repository_.repository.html
 */
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: TaskFilterDto, user: User): Promise<Task[]> {
    const { status, searchTerm } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (searchTerm) {
      // LIKE is similar to =, but it doesnt have to match
      query.andWhere(
        '(task.title LIKE :searchTerm OR task.description LIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    delete task.user;
    return task;
  }
}
