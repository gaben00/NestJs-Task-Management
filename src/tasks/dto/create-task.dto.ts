import { IsNotEmpty } from 'class-validator';

/**
 * Install  class-validator and class-transformer for validation
 * Available validation pipes: https://github.com/typestack/class-validator#validation-decorators
 */
export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
