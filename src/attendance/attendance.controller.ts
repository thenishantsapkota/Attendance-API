import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { AttendanceService } from './attendance.service';
import { AttendanceDto } from './dto/attendance.dto';

@UseGuards(JwtGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('/')
  createAttendance(@Body() dto: AttendanceDto) {
    return this.attendanceService.createAttendance(dto);
  }

  @Put('/mark/:id')
  markAttendance(@Param('id', ParseIntPipe) id) {
    return this.attendanceService.markAttendance(id);
  }

  @Delete('/:id')
  deleteAttendance(@Param('id', ParseIntPipe) id) {
    return this.attendanceService.deleteAttendance(id);
  }
}
