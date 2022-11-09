import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { StudentDto } from './dto';
import { StudentService } from './student.service';

@UseGuards(JwtGuard)
@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post('/')
  createStudent(@Body() dto: StudentDto) {
    return this.studentService.createStudent(dto);
  }

  @Get('/:id')
  getStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.getStudent(id);
  }

  @Get('/')
  getStudents() {
    return this.studentService.getStudents();
  }

  @Put('/:id')
  updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: StudentDto,
  ) {
    return this.studentService.updateStudent(id, dto);
  }

  @Delete('/:id')
  deleteStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.deleteStudent(id);
  }
}
