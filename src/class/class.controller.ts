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
import { ClassService } from './class.service';
import { ClassDto } from './dto';

@UseGuards(JwtGuard)
@Controller('class')
export class ClassController {
  constructor(private classService: ClassService) {}

  @Post('/')
  createClass(@Body() dto: ClassDto) {
    return this.classService.createClass(dto);
  }

  @Get('/:id')
  getClass(@Param('id', ParseIntPipe) id: number) {
    return this.classService.getClass(id);
  }

  @Get('/')
  getClasses() {
    return this.classService.getClasses();
  }

  @Put('/:id')
  updateClass(@Param('id', ParseIntPipe) id: number, @Body() dto: ClassDto) {
    return this.classService.updateClass(id, dto);
  }

  @Delete('/:id')
  deleteClass(@Param('id', ParseIntPipe) id: number) {
    return this.classService.deleteClass(id);
  }
}
