import { ApiProperty } from "@nestjs/swagger";

export class PageDTO {
  @ApiProperty({
    description: '第几页',
    example: 1,
  })
  readonly page?: number;
}